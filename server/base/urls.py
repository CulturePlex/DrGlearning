# -*- coding: utf-8 -*-
from django.conf.urls.defaults import *

urlpatterns = patterns('base.views',

    # index
    url(r'^$', 'index', name="index"),

    # dashboard
    url(r'^dashboard/$', 'dashboard', name="dashboard"),
    
    # Automatic courses
    
    url(r'^courses_generator/$', 'courses_generator', name="courses_generator"),
)
