function setAjax(type,request,page,runcode){
	$.ajax({
		url:page,
     		type:type,
     		data:'r=' + Math.random() + '&' + request,
     		success:function(res){
                        clearWaitInfo();
			eval(runcode);
                }
	});
}

function clearWaitInfo(){
	var newd=$("#waitInfo");
	if(newd && newd != 'undefined') $("#waitInfo").remove();
	/*
   	if(newd.parentNode != null && newd.parentNode != 'undefined'){
		alert(newd.parentNode);
		newd.parentNode.removeChild(newd);
   	}*/
} 

function en(){
	var ori = $("#ori").val();
	var tip = $("#tip").val();
	var pass = $("#pass").val();
	var cus = $("#cus").val();
	if(!tip){
        $('#tip_msg').html('请选择提示！');
        return;
    }
	if(tip == '自定义' && !cus){
		$('#tip_msg').html('请输入自定义提示！');
        return;
	}
	if(!pass){
        $('#tip_msg').html('请输入答案！');
        return;
    }
	$('#tip_msg').html('');
	hideNewLayer(1);
	if(!ori){
                $('#msg').html('请输入要加密的内容！');
                return;
        }
	$('#msg').html('');
	$('#tip_msg').html('<img src="/static/images/load.gif" id="waitInfo" />');
	/*$("#ori").attr('disabled',true);
	$("#tip").attr('disabled',true);
	$("#pass").attr('disabled',true);*/
        var user = findUser(ori);
	//alert(user);
	setAjax('POST','ulen='+user.length, 'en.php', 'showCipherText(res,"'+user+'")');
}

function showCipherText(v, u){
	if(v) {
		/*var ori = $("#ori").val();
		var user = findUser(ori);*/
		//alert(u);
		$('#show').html(v+' '+u);
	}
}

function postUrl(n){
	var url = $('#u'+n).val();
	if(!url){
		$('#v_tip'+n).html('请输入视频播放页地址！');
		return false;
	}
	setAjax('POST','url='+url+'&n='+n, 'url.php', 'showPic(res,'+n+')');
}

function showPic(v, d){
	var r = v.split('^^');
	var status = r[0];
	if(status == 1){
		v = r[1];
		if(d == 1) {
			ptm = v;
			ptit = r[2];
			$('#ptit').html(ptit).show();
                        $('#pclose').show();
			$('.jnnp').hide();
                        $('#upic').hide();
		}else if(d == 2) {
			var swf = r[2];
			var t = r[3];
			vtm = v;
			vdo = swf;
			vtit = t;
			$('#vtit').html(t).show();
			$('#vclose').show();
			$('.jnn').hide();
			$('#vimg').hide();
		}
		//$('#showimg').show();
		$('#showimg').attr('src', v);
	}else{
		$('#v_tip'+d).html('你输入的链接地址无法识别！');
	}
}

function delV(){
	$('#vimg').show();
	$('#vtit').html('').hide();
	$('#vclose').hide();
	vtm = vdeo = vtit = 0;
}

function delP(){
	$('#upic').show();
        $('#ptit').html('').hide();
	$('#pclose').hide();
        ptm = ptit = 0;
}

function sub(){
	var cipher = $('#show').html();
	if(!cipher) {
		$('#msg').html('请加密之后再发布！');
		//	alert('发送的内容不能为空');
		return;
	}
	$('#msg').html('正在发送 <img src="/static/images/load.gif" id="waitInfo">');
	setAjax('POST','ptit='+ptit+'&vtit='+vtit+'&ori='+$('#ori').val()+'&cipher='+cipher+'&tip='+$('#tip').val()+'&pass='+$('#pass').val()+'&ptm='+ptm+'&vtm='+vtm+'&vdo='+vdo+'&cus='+$('#cus').val(),'sub.php','showSubResult(res)');
}

function repost(){
	if($('#comment').attr('checked')) var c = 1;
	else var c = 0;
	var content = $('#content').val();
	if(!content) {
                $('#repost_msg').html('内容不能为空！');
                return;
        }
	$('#repost_msg').html('正在发送 <img src="/static/images/load.gif" id="waitInfo">');
	setAjax('POST','wb='+$('#wb').val()+'&com='+c+'&content='+content,'repost.php','showRepostResult(res)');
}

function showRepostResult(v){
	var r = eval("("+v+")");
        if(r.status == 1){
		hideNewLayer(3);
                showNewLayer(5);
        }else{
		if(r.tip.indexOf(':') != -1) {
			var arr = r.tip.split(':');
			$('#repost_msg').html(arr[1]);
		}else{
                	$('#repost_msg').html(r.tip);
		}
        }
}

function showSubResult(v){
	var r = eval("("+v+")");
	if(r.status == 1){
		$('#msg').html('');
		showNewLayer(5);
	}else{
		$('#msg').html(r.tip);
	}
}

function decode(){
	var answer = $('#answer').val();
	if(!answer){
		$('#tip_msg').html('请输入提示问题的答案！');
		return;
	}
	setAjax('POST', 'answer='+answer+'&id='+$('#id').val(), 'check.php', 'showCheckResult(res)');
}

function showCheckResult(v){
	var r = eval("("+v+")");
	if(r.error_msg){
		$('#tip_msg').html(r.error_msg);
	}else{
		hideNewLayer(1);
		var ori = r.mw;
		var delast = '';
		if(r.p && r.p != 0) {
			$('#p').attr('src',r.p);
			delast = '(本段密语附图片或视频，点击下方查看)';
			var burl = r.p.replace('small','big');
                        $('#enlargepic').attr('href',burl);
		}
		if(r.vp && r.vp != 0) {
			$('#vp').attr('src',r.vp);
			delast = '(本段密语附图片或视频，点击下方查看)';
		}
		if(r.vdo && r.vdo != 0) {
			$('#swf').val(r.vdo);
			/*$('#various4').attr('href',r.vdo);*/
		}
		if(r.vtit && r.vtit != 0 ) {
			$('#vtit').html('<img src="/static/images/v.jpg" class="deimg"><span class="detit">'+r.vtit+'</span>');
			$('.left, .right, #vtit').show();
		}
		if(r.ptit && r.ptit != 0 ) {
			$('#ptit').html('<img src="/static/images/pic.png" class="deimg"><span class="detit">'+r.ptit+'</span>');
			$('.left, .right, #ptit').show();
		}
		$('#ori').html(ori+delast);
	}
}

function showLayer(){
        $('#bg').show();
        $('#tips').show();
        $('#tips1').show();
}

function hideLayer(){
        $('#bg').hide();
        $('#tips').hide();
        $('#tips1').hide();
}

function showNewLayer(n){
	if(n != 2) $('.shade').show();
	$('.uczt'+n).show();
	$('#bgimg'+n).show();
}

function hideNewLayer(n){
	$('.shade').hide();
        $('.uczt'+n).hide();
	$('#bgimg'+n).hide();
	if(n == 5) document.location.href='encrypt.php';
}

function focusMe(v){
	$('#msg').html('请稍等 <img src="/static/images/load.gif" id="waitInfo">');
	setAjax('POST', 'f='+v, 'follow.php', 'showFocusResult(res)');
}

function showFocusResult(v){
	$('#msg').html('');
	var r = eval("("+v+")");
	var num = 0;
	for(var id in r){
		for(var res in r[id]){
			if(r[id][res]) {
				$('#v_'+id).removeClass('jggz').addClass('jggz2').html('<img src="/static/images/jgdui.jpg">已关注');
				num++;
			}
		}
	}
	if(num>1) $('.jgb').hide();
}

function enlarge(n){
	if(n == 1) {
		var p = $('#p').attr('src');
		p = p.replace('small','big');
		var html = '<img src="'+p+'" />';
		$('#float').html(html);
		$('#pic').hide();
	}else if(n == 2){
		var s = $('#swf').val();
		var html = '<embed width="440" height="356" wmode="transparent" type="application/x-shockwave-flash" src="'+s+'" quality="hight" allowfullscreen="true" flashvars="playMovie=true&amp;auto=1&amp;adss=0&amp;autoPlay=true&amp;isAutoPlay=true&embedid=-&showAd=0&amp;autoPlay=1&amp;as=0" pluginspage="http://get.adobe.com/cn/flashplayer/" style="visibility: visible;" allowscriptaccess="always">';
		$('#vbox-content').html(html);
		$('#vpic').hide();
	}
	showNewLayer(2);
}

function gbcount(message) {
	var max = 140;
	if (message.value.length == max) {
		$("#remain").html('0');
		$("#msg_comment").html("");
	}else if(message.value.length > max){
		message.value = message.value.substring(0,max);
		$("#msg_comment").html("留言不能超过 140 个字!");
		setTimeout(function(){$("#msg_comment").html("");}, 3*1000);
		//var over = message.value.length - max;
		$("#remain").html('0');
	}else{
		var remain = max - message.value.length;
		$("#remain").html(remain);
		$("#msg_comment").html("");
	}
} 

function addFans(){
	setAjax('POST', '', 'fans.php', 'showFansResult(res)');	
}

function showFansResult(v){
	if(v){
		$('#addfans').html(v).show();
	}
}

function atUser(){
        var con = "请输入你的好友账号";
        $$("ori").value += "@"+con+"";
        var l = $$("ori").value.length;
        if($$("ori").createTextRange){//IE浏览器
                var range = $$("ori").createTextRange();
                range.moveEnd("character",-l);         
		//range.moveStart("character",-l);              
		range.moveEnd("character",l);
		range.moveStart("character", l-con.length);
                range.select();
        }else{
                $$("ori").setSelectionRange(l-con.length,l);
                $$("ori").focus();
        } 
} 

function $$(id){
        return document.getElementById(id); 
}

function findUser(s){
        var sarray=s.split(' ');
        var n = sarray.length;
        var str='';
        var nstr = '';
        for(var i=0; i<n; i++){
                var p = sarray[i].indexOf('@')+1;
                if(p){
                        var name = sarray[i].substr(p); 
                        str += name + ' ';
                        if(nstr.length+name.length<80) nstr += '@'+name+' ';
			else break;
                }
        }
	return nstr;
}
