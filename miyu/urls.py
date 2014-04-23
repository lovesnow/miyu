#! /usr/bin/env python
# -*- coding: utf-8 -*-


from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'miyu.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^miyu/', include('apps.secret.urls')),
)

if settings.DEBUG:
    # urlpatterns = patterns('',
    # url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
    #     {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    # url(r'', include('django.contrib.staticfiles.urls')),) + urlpatterns
    
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
