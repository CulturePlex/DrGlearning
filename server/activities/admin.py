# -*- coding: utf-8 -*-
import os
import tempfile

from django.conf import settings
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

    def change_view(self, request, object_id, extra_content=None):
        if '_saveasnew' in request.POST:
            old_visual = Visual.objects.get(id=object_id)
            request.FILES['image'] = getattr(old_visual, 'image')
            request.FILES['obfuscated_image'] = getattr(old_visual, 'obfuscated_image')
        return super(VisualAdmin, self).change_view(request, object_id, extra_content)

    def save_model(self, request, obj, form, change):
        if request.POST and request.POST.get('obfuscated_64'):
            file_type, file_data = request.POST['obfuscated_64'].split('base64,')
            filename = tempfile.mktemp()
            tmpfile = open(filename, 'wb')
            tmpfile.write(file_data.decode('base64'))
            tmpfile.close()
            f = open(filename)
            obj.obfuscated_image.save('pixelated.png', File(f), True)
            # Remove temporal file. What about working on memory?
            os.remove(filename)
        obj.save()

    class Media:
        js = ('js/visualAdminAnswers.js', 'js/visualAdminImages.js')


class GeospatialAdmin(ActivityAdmin, GeoModelAdmin):

    options = {
        'layers': ['google.streets', 'osm.mapnik', 've.road']
    }

    class Media:
        js = ('http://www.google.com/jsapi?key=%s' % settings.GOOGLE_API_KEY,
                'js/geospatialAdmin.js')


class TemporalAdmin(ActivityAdmin):
    pass


class LinguisticAdmin(ActivityAdmin):
    pass


class QuizAdmin(ActivityAdmin):
    exclude = ('time', 'image', 'obfuscated_image', 'user')

    def change_view(self, request, object_id, extra_content=None):
        if '_saveasnew' in request.POST:
            old_quiz = Quiz.objects.get(id=object_id)
            request.FILES['image'] = getattr(old_quiz, 'image')
            request.FILES['obfuscated_image'] = getattr(old_quiz, 'obfuscated_image')
        return super(QuizAdmin, self).change_view(request, object_id, extra_content)

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


admin.site.register(Relational, RelationalAdmin)
admin.site.register(Visual, VisualAdmin)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Geospatial, GeospatialAdmin)
admin.site.register(Temporal, TemporalAdmin)
admin.site.register(Linguistic, LinguisticAdmin)
