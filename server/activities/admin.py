# -*- coding: utf-8 -*-
import tempfile

from django.contrib import admin
from django.core.files import File
from olwidget.admin import GeoModelAdmin

from activities.models import (Relational, Visual, Geospatial,
                               Temporal, Linguistic)


class ActivityAdmin(admin.ModelAdmin):
    list_filter = ['career']
    save_as = True

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

    class Media:
        js = ('http://www.google.com/jsapi', 'js/geospatialAdmin.js')


class TemporalAdmin(ActivityAdmin):
    pass


class LinguisticAdmin(ActivityAdmin):
    pass


admin.site.register(Relational, RelationalAdmin)
admin.site.register(Visual, VisualAdmin)
admin.site.register(Geospatial, GeospatialAdmin)
admin.site.register(Temporal, TemporalAdmin)
admin.site.register(Linguistic, LinguisticAdmin)
