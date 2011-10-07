# -*- coding: utf-8 -*-
from django.contrib import admin

from activities.models import (Relational, VisualMemory, GeospatialAreas,
                               AfterBefore, HangmanPuzzle)


admin.site.register(Relational)
admin.site.register(VisualMemory)
admin.site.register(GeospatialAreas)
admin.site.register(AfterBefore)
admin.site.register(HangmanPuzzle)
