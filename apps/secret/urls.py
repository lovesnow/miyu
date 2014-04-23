#! /usr/bin/env python
# -*- coding: utf-8 -*-

from django.conf.urls import patterns, url

urlpatterns = patterns(
    'apps.secret.views',
    url(r'^$', 'secret_index', name="secret_index"),
    # url(r'^s/(?P<snippet_id>\d+)/$', 'snippet_detail', name="snippet_detail"),
)
