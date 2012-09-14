# -*- coding: utf-8 -*-
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext


def mining(request):
    return render_to_response('mining.html',
                              {},
                              context_instance=RequestContext(request))
                              

