# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('knowledges.views', 
    url(r'^career/(?P<career_id>\d+)/export/$', 'export_career',
        name='career_export'),
)
