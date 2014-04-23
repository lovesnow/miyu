#! /usr/bin/env python
# -*- coding: utf-8 -*-

# Copyright (C) 2011 ~ 2014 Deepin, Inc.
#               2011 ~ 2014 lovesnow
# 
# Author:     lovesnow <houshao55@gmail.com>
# Maintainer: lovesnow <houshao55@gmail.com>
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.



from django.db import models

class Secret(models.Model):
    
    content = models.TextField(verbose_name="加密前的文字")
    secret = models.TextField(verbose_name="加密后的文字")
    topic  = models.CharField(verbose_name="提示问题", max_length=255)
    answer = models.CharField(verbose_name="问题答案", max_length=255)
    created = models.DateTimeField(verbose_name="创建时间", auto_now_add=True)
    
    class Meta:
        verbose_name = "密语"
        verbose_name_plural = "密语"
        ordering = ["-created"]
