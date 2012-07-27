# -*- coding: utf-8 -*-
from django.conf.urls.defaults import *

urlpatterns = patterns('mining.views',

    # index
    url(r'^$', 'mining', name="mining"),

)
