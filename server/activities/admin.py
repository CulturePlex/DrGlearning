# -*- coding: utf-8 -*-
from django.contrib import admin
from olwidget.admin import GeoModelAdmin

from activities.models import (Relational, Visual, Geospatial,
                               Temporal, Linguistic)


class ActivityAdmin(admin.ModelAdmin):
    list_filter = ['career']


class RelationalAdmin(ActivityAdmin):
    pass


class VisualAdmin(ActivityAdmin):
    pass


class GeospatialAdmin(ActivityAdmin, GeoModelAdmin):
    pass


class TemporalAdmin(ActivityAdmin):
    pass


class LinguisticAdmin(ActivityAdmin):
    pass


admin.site.register(Relational, RelationalAdmin)
admin.site.register(Visual, VisualAdmin)
admin.site.register(Geospatial, GeospatialAdmin)
admin.site.register(Temporal, TemporalAdmin)
admin.site.register(Linguistic, LinguisticAdmin)
