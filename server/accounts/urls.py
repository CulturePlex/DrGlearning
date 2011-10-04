# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, include, url
from django.contrib.auth import views as auth_views

from userena import settings as userena_settings

from accounts.forms import EditProfileForm


urlpatterns = patterns('',

    # accounts
    url(r'^signin/$', "accounts.views.signin_redirect", name="signin"),
    url(r'^signup/$', "accounts.views.signup_redirect", name="signup"),
   
    url(r'^signout/$',
       auth_views.logout,
       {'next_page': userena_settings.USERENA_REDIRECT_ON_SIGNOUT,
        'template_name': 'userena/signout.html'},
       name='userena_signout'),


    url(r'^(?P<username>[\.\w]+)/edit/$', 
	"userena.views.profile_edit", 
	{'edit_profile_form':EditProfileForm, 
	'template_name':'accounts/profile_form.html'}, 
	name='userena_profile_edit'),
    url(r'^(?P<username>[\.\w]+)/$', 
	"userena.views.profile_detail", 
	{'template_name':'accounts/profile_detail.html'}, 
	name='userena_profile_detail'),

    # change password
    url(r'^(?P<username>[\.\w]+)/password/$', 
	"userena.views.password_change", 
	{'template_name':'accounts/password_form.html'}, 
	name='userena_password_change'),
    url(r'^(?P<username>[\.\w]+)/password/complete/$', 
	"userena.views.direct_to_user_template", 
	{'template_name': 'accounts/password_complete.html'}, 
	name='userena_password_change_complete'),

    # Change email and confirm it
    url(r'^(?P<username>[\.\w]+)/email/$',
       "userena.views.email_change",
	{'template_name': 'accounts/email_form.html'}, 
       name='userena_email_change'),

 #   url(r'^', include('userena.urls')),

)
