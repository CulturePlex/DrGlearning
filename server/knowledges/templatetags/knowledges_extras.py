# Tastypie templatetag snippet from:
# http://05bit.qmazi.com/post/68-handy-url-reversing-template-tag-for-tastypie/
from django.core.urlresolvers import reverse  
from django import template

from settings import EMULATOR_URL

register = template.Library()

@register.simple_tag  
def test_url(resource_name, pk):  
    """Return API URL for Tastypie Resource details.
    Usage::
        {% api_detail 'entry' entry.pk %}
    or::
        {% api_detail 'api2:entry' entry.pk %}  
    """  
    if ':' in resource_name:  
        api_name, resource_name = resource_name.split(':', 1)  
    else:  
        api_name = 'v1'  
    tastypie_url = reverse('api_dispatch_detail', kwargs={  
            'api_name': api_name,  
            'resource_name': resource_name,  
            'pk': pk  
        }) #+ '?format=json'
    return ("%s?course=%s" % (EMULATOR_URL, tastypie_url))


@register.filter(name='api_url')
def api_url(resource_name, pk):
    """Return API URL for Tastypie Resource details.
    Usage::
        {% api_detail 'entry' entry.pk %}
    or::
        {% api_detail 'api2:entry' entry.pk %}  
    """  
    if ':' in resource_name:  
        api_name, resource_name = resource_name.split(':', 1)  
    else:  
        api_name = 'v1'  
    return reverse('api_dispatch_detail', kwargs={  
            'api_name': api_name,  
            'resource_name': resource_name,  
            'pk': pk  
        }) #+ '?format=json'
    

