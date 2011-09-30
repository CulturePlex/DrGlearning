# -*- coding: utf-8 -*-

from django import forms
from django.utils.translation import gettext as _

from userena.utils import get_profile_model

from userena.forms import EditProfileForm as UserenaEditProfileForm


class EditProfileForm(UserenaEditProfileForm):

    class Meta:
        model = get_profile_model()
#        exclude = ['user']
        fields = ('location', 'website' )
#        exclude =('gender','website','location','birth_date','about_me','institution', 'company', 'lab', 'user', 'account')



