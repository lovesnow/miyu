(function(){
var friendsData = '';
// 上面是数据
var config = {
		boxID:"autoTalkBox",
		valuepWrap:'autoTalkText',
		wrap:'recipientsTips',
		listWrap:"autoTipsUserList",
		position:'autoUserTipsPosition',
		positionHTML:'<span id="autoUserTipsPosition"></span>',
		className:'autoSelected'
	};
var html = '<div id="autoTalkBox"style="visibility:hidden;line-height:16px;z-index:-2000;top:571px;left:55px;width:268px;height:$height$px;z-index:1;position:absolute;scroll-top:$SCTOP$px;overflow-y:auto;word-break:break-all;word-wrap:break-word;*font-family:Tahoma, Arial;"><span id="autoTalkText"></span></div><div id="recipientsTips" class="recipients-tips"><ul id="autoTipsUserList"></ul></div>';
var listHTML = '<li><a title="$NAME$" >$NAME$$REMARK$</a></li>';
var tipHTML = '<li><a style="cursor:default;">想用@提到谁？</a></li>';

/*
 * D 基本DOM操作
 * $(ID)
 * DC(tn) TagName
 * EA(a,b,c,e)
 * ER(a,b,c)
 * BS()
 * FF blooar
 */
var D = {
	$:function(ID){
		return document.getElementById(ID)
	},
	DC:function(tn){
		return document.createElement(tn);
	},
    EA:function(a, b, c, e) {
        if (a.addEventListener) {
            if (b == "mousewheel") b = "DOMMouseScroll";
            a.addEventListener(b, c, e);
            return true
        } else return a.attachEvent ? a.attachEvent("on" + b, c) : false
    },
    ER:function(a, b, c) {
        if (a.removeEventListener) {
            a.removeEventListener(b, c, false);
            return true
        } else return a.detachEvent ? a.detachEvent("on" + b, c) : false
    },
	BS:function(){
		var db=document.body,
			dd=document.documentElement,
			top = db.scrollTop+dd.scrollTop,
			left = db.scrollLeft+dd.scrollLeft;
		return { 'top':top , 'left':left };
	},
	
	E:function(e){
		//e = window.event || e;
		return {
            stop: function() {
                if (e && e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true
            },
            prevent: function() {
                if (e && e.preventDefault) e.preventDefault();
                else e.returnValue = false
            }
		}
	},
	
	FF:(function(){
		var ua=window.navigator.userAgent.toLowerCase();
		return /firefox\/([\d\.]+)/.test(ua);
	})(),
	
	opera:(function(){
		var ua=window.navigator.userAgent.toLowerCase();
		return /opera\/([\d\.]+)/.test(ua);
	})()
};

/*
 * TT textarea 操作函数
 * info(t) 基本信息
 * getCursorPosition(t) 光标位置
 * setCursorPosition(t, p) 设置光标位置
 * add(t,txt) 添加内容到光标处
 */
var TT = {
	
	info:function(t){
		var o = t.getBoundingClientRect();
		var w = t.offsetWidth;
		var h = t.offsetHeight;
		return {top:o.top, left:o.left, width:w, height:h};
	},
	
	getCursorPosition: function(t){
		if (document.selection) {
			t.focus();
			var ds = document.selection;
			var range = null;
			range = ds.createRange();
			var stored_range = range.duplicate();
			stored_range.moveToElementText(t);
			stored_range.setEndPoint("EndToEnd", range);
			t.selectionStart = stored_range.text.length - range.text.length;
			t.selectionEnd = t.selectionStart + range.text.length;
			return t.selectionStart;
		} else return t.selectionStart
	},
	
	setCursorPosition:function(t, p){
		var n = p == 'end' ? t.value.length : p;
		if(document.selection){
			var range = t.createTextRange();
			range.moveEnd('character', -t.value.length);         
			range.moveEnd('character', n);
			range.moveStart('character', n);
			range.select();
		}else{
			t.setSelectionRange(n,n);
			t.focus();
		}
	},
	
	add:function (t, txt){
		var val = t.value;
		var wrap = wrap || '' ;
		if(document.selection){
			document.selection.createRange().text = txt;  
		} else {
			var cp = t.selectionStart;
			var ubbLength = t.value.length;
			t.value = t.value.slice(0,t.selectionStart) + txt + t.value.slice(t.selectionStart, ubbLength);
			this.setCursorPosition(t, cp + txt.length); 
		};
	},
	
	del:function(t, n){
		var p = this.getCursorPosition(t);
		var s = t.scrollTop;
		t.value = t.value.slice(0,p - n) + t.value.slice(p);
		this.setCursorPosition(t ,p - n);
		D.FF && setTimeout(function(){t.scrollTop = s},10);
	}

}

/*
 * selectList
 * _this
 * index
 * list
 * selectIndex(code) code : e.keyCode
 * setSelected(ind) ind:Number
 */

var selectList = {
	_this:null,
	index:-1,
	list:null,
	selectIndex:function(code){
		if(D.$(config.wrap).style.display == 'none') return true;
		var i = selectList.index;
		switch(code){
		   case 40:
			 i = i + 1;
			 break
		   case 38:
			 i = i - 1;
			 break
		   case 13:
			return selectList._this.enter();
			break
		}

		i = i >= selectList.list.length ? 0 : i < 0 ? selectList.list.length-1 : i;
		return selectList.setSelected(i);
	},
	setSelected:function(ind){
		if(selectList.index >= 0) selectList.list[selectList.index].className = '';
		selectList.list[ind].className = config.className;
		selectList.index = ind;
		return false;
	}

}
/*
var setAjax = function(type,request,page,runcode){
        jQuery.ajax({
                url:page,
                type:type,
                data:'r=' + Math.random() + '&' + request,
                success:function(res){
                        //clearWaitInfo();
                        eval(runcode);
                }
        });
}
/*
var GetData = function(d){
	var q = encodeURIComponent(d);
	setAjax('POST','q='+q,'share_search.php','showList(res,"'+d+'")');
}

function showList(v,c){
	//alert(v);
	friendsData = v;
	AutoTips.showList(c);
}
*/
/*
 *
 */
var AutoTips = function(A){
	var elem = A.id ? D.$(A.id) : A.elem;
	var checkLength = 5;
	var _this = {};
	var key = '';

	_this.start = function(){
		if(!D.$(config.boxID)){
			var h = html.slice();
			var info = TT.info(elem);
			var div = D.DC('DIV');
			var bs = D.BS();
			h = h.replace('$width$',info.width).
					replace('$height$',info.height).
					replace('$SCTOP$','0');
			div.innerHTML = h;
			document.body.appendChild(div);
		}else{
			_this.updatePosstion();
		}
	}
	
  	_this.keyupFn = function(e){	
		var e = e || window.event;
		var code = e.keyCode;
		if(code == 38 || code == 40 || code == 13) {
			//if(code==13 && D.$(config.wrap).style.display != 'none'){
			//	_this.enter();
			//}
			D.E(e).prevent();
			return false;
		}
		
		var cp = TT.getCursorPosition(elem);
		if(!cp) return _this.hide();
		var valuep = elem.value.slice(0, cp);
		var val = valuep.slice(-checkLength);
		var chars = val.match(/(\w+)?@(.+)$|@$/);
		if(chars == null) return _this.hide();
		var char = chars[2] ? chars[2] : '';
		D.$(config.valuepWrap).innerHTML = valuep.slice(0,valuep.length - char.length).replace(/\n/g,'<br/>') + config.positionHTML;

		//alert(D.$(config.valuepWrap).innerHTML);
		//_this.showList(char);
		if(!char) return;
		_this.getData(char);
	}

	_this.getData = function(d){
        	var q = encodeURIComponent(d);
        	_this.setAjax('POST','q='+q,'search.php','_this.showListResult(res,"'+d+'")');
	}
	_this.setAjax = function(type,request,page,runcode){
        	jQuery.ajax({
                	url:page,
                	type:type,
                	data:'r=' + Math.random() + '&' + request,
                	success:function(res){
                        	//clearWaitInfo();
                        	eval(runcode);
                	}
        	});
	}
	_this.showListResult = function(v,c){
        	//alert(v);return;
		friendsData = eval('('+v+')');
		_this.showList(c);
	}
	
	_this.showList = function(char){
		key = char;
		var data = friendsData;
		var html = listHTML.slice();
		var h = '';
		var len = data.length;
		if(len == 0){_this.hide();return;}
		var reg = new RegExp(char);
		var em = '<em>'+ char +'</em>';
		for(var i=0; i<len; i++){
			var emName = data[i]['nickname'].replace(reg, em);
			var hm = data[i]['remark'].replace(reg,em);
			//alert(data[i]['remark']);
			if(data[i]['remark'] == ''){
				h += html.replace(/\$NAME\$/g,data[i]['nickname']).replace(/\$NAME\$/, emName).replace('$REMARK$','');
			}else{
				h += html.replace(/\$NAME\$/g,data[i]['nickname']).replace(/\$NAME\$/, emName).replace('$REMARK$','('+hm+')');
			}
		}
			
		_this.updatePosstion();
		var p = D.$(config.position).getBoundingClientRect();
		D.$(config.position).innerHTML = 't';
		var bs = D.BS();
		var d = D.$(config.wrap).style;
		if(-[1,]){
			var Sys = {};
        		var ua = navigator.userAgent.toLowerCase(); 
			var s;
        		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
			//document.getBoxObjectFor ? Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1] :
			//window.MessageEvent && !document.getBoxObjectFor ? Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1] :0;
			if(Sys.chrome) {
				d.top = p.top + 16 + bs.top + 'px';
			}else if(Sys.firefox){
				d.top = p.top + 3 + bs.top + 'px';
			}else{ 
				d.top = p.top + 6 + bs.top + 'px';
			}
			d.left = p.left - 5 + 'px';
		}else{
			var obj = document.getElementById('autoUserTipsPosition');
			d.top = _this.gettop(obj) + 16;
			d.left = _this.getleft(obj);
		}
		//alert(D.$(config.position).left);
		//alert(_this.getleft(document.getElementById('autoUserTipsPosition')));
		D.$(config.listWrap).innerHTML = tipHTML + h;
		_this.show();
             /*
                var bs = D.BS();
                var d = D.$(config.wrap).style;
                var p = TT.info(elem);
                d.top = p.top + bs.top + 'px';
                d.left = p.left +bs.left + 446 + 'px';
                D.$(config.listWrap).innerHTML = tipHTML + h;
                _this.show();
		*/
		
	}

	_this.getleft = function(e){
		var offset=e.offsetLeft;
		if(e.offsetParent!=null) offset+=_this.getleft(e.offsetParent); 
		return offset; 

	}	

	_this.gettop = function(e){
		var offset=e.offsetTop; 
		if(e.offsetParent!=null) offset+=_this.gettop(e.offsetParent); 
		return offset; 
	}	

	_this.KeyDown = function(e){
		var e = e || window.event;
		var code = e.keyCode;
		if(code == 38 || code == 40 || code == 13){
			selectList.selectIndex(code);
			D.E(e).prevent();
		}
	}
	
	_this.updatePosstion = function(){
		var p = TT.info(elem);
		var bs = D.BS();
		var d = D.$(config.boxID).style;
		d.top = p.top + bs.top +'px';
		d.left = p.left + bs.left + 1 + 'px';
		d.width = '268px';//p.width+'px';
		d.height = p.height+'px';
		D.$(config.boxID).scrollTop = elem.scrollTop;
	}
	
	_this.show = function(){
		selectList.list = D.$(config.listWrap).getElementsByTagName('li');
		selectList.index = -1;
		selectList._this = _this;
		_this.cursorSelect(selectList.list);
		D.ER(elem, (D.opera ? 'keypress' : 'keydown'), _this.KeyDown);
		D.EA(elem, (D.opera ? 'keypress' : 'keydown'), _this.KeyDown, false);
		D.$(config.wrap).style.display = 'block';	
	}
	
	_this.cursorSelect = function(list){
		for(var i=1; i<list.length; i++){
			list[i].onmouseover = (function(i){
				return function(){selectList.setSelected(i)};
			})(i);
			list[i].onmousedown = _this.enter;
		}
	}
	
	_this.hide = function(){
		selectList.list = null;
		selectList.index = -1;
		selectList._this = null;
		D.ER(elem,  (D.opera ? 'keypress' : 'keydown'), _this.KeyDown);
		D.$(config.wrap).style.display = 'none';
	}
	
	_this.bind = function(){
		
		D.EA(elem, 'keyup', _this.keyupFn, false);
		D.EA(elem, 'click', _this.keyupFn, false);
		D.EA(elem, 'blur', function(){setTimeout(_this.hide, 100)}, false);//alert('h');
	}
	
	_this.enter = function(){
		TT.del(elem, key.length, key);
		TT.add(elem, selectList.list[selectList.index].getElementsByTagName('A')[0].title+' ');
		_this.hide();
		return false;
	}
	
	return _this;
	
}


window.userAutoTips = function(args){
		var a = AutoTips(args);
			a.start();
			a.bind();
	}
		
})()

