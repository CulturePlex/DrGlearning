# -*- coding: utf-8 -*-
import tempfile

from django.contrib import admin
from django.core.files import File
from django.http import HttpResponse

from guardian.admin import GuardedModelAdmin
from olwidget.admin import GeoModelAdmin

from activities.models import (Relational, Visual, Geospatial,
                               Temporal, Linguistic, Quiz)
from knowledges.models import Career

class ActivityAdmin(GuardedModelAdmin):

    user_can_access_owned_objects_only = True

    list_filter = ['career']
    exclude = ('user',)
    save_as = True

    def response_change(self, request, obj, *args, **kwargs):  
        if request.REQUEST.has_key('_popup'):  
             return HttpResponse('''
                <script type="text/javascript">
                    opener.closePopup(window);
                </script>''')  
        else:  
            return super(ActivityAdmin, self).response_change(request, obj, *args, **kwargs)  

    def response_add(self, request, obj, *args, **kwargs):  
        if request.REQUEST.has_key('_popup'):  
             return HttpResponse('''
                <script type="text/javascript">
                    opener.closePopup(window);
                </script>''')  
        else:  
            return super(ActivityAdmin, self).response_add(request, obj, *args, **kwargs)  

    def render_change_form(self, request, context, add=False, change=False, form_url='', obj=None):
        """
        Sets the is_popup parameter in the context to avoid the Django
        default behaviour of hiding most of the control when editing
        through a popu
        """
        context['is_popup'] = False
        return super(ActivityAdmin, self).render_change_form(request, context, add, change, form_url, obj)
        
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'career':
            if request.user.is_superuser:
                kwargs['queryset'] = Career.objects.all()
            else:
                kwargs['queryset'] = Career.objects.filter(user=request.user)
            return db_field.formfield(**kwargs)
        return super(ActivityAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)


    class Media:
        js = ('js/careerAutoselector.js',)


class RelationalAdmin(ActivityAdmin):

    class Media:
        css = {
            "all": ("css/relationalAdmin.css", "css/chosen.css")
        }
        js = ('js/processing-1.3.6.min.js', 'js/relationalAdmin.js',
              'js/jquery-1.7.1.min.js', 'js/chosen.jquery.min.js')


class VisualAdmin(ActivityAdmin):

    def save_model(self, request, obj, form, change):
        if request.POST and request.POST.get('obfuscated_64'):
            file_type, file_data = request.POST['obfuscated_64'].split('base64,')
            filename = tempfile.mktemp()
            tmpfile = open(filename, 'wb')
            tmpfile.write(file_data.decode('base64'))
            tmpfile.close()
            f = open(filename)
            obj.obfuscated_image.save('pixelated.png', File(f), True)
        obj.save()

    class Media:
        js = ('js/visualAdminAnswers.js', 'js/visualAdminImages.js')


class GeospatialAdmin(ActivityAdmin, GeoModelAdmin):

    options = {
        'layers': ['osm.mapnik', 'google.streets', 've.road']
    }

    class Media:
        js = ('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
                'http://maps.google.com/maps/api/js?sensor=false',
                'js/geospatialAdmin.js')


class TemporalAdmin(ActivityAdmin):
    pass


class LinguisticAdmin(ActivityAdmin):
    pass


admin.site.register(Relational, RelationalAdmin)
admin.site.register(Visual, VisualAdmin)
admin.site.register(Quiz, VisualAdmin)
admin.site.register(Geospatial, GeospatialAdmin)
admin.site.register(Temporal, TemporalAdmin)
admin.site.register(Linguistic, LinguisticAdmin)
