from tastypie import fields
from tastypie.resources import ModelResource

from activities.models import Activity, Level, Relational
from knowledges.models import Career


class LevelResource(ModelResource):

    class Meta:
        queryset = Level.objects.all()

    def dehydrate(self, bundle):
        bundle.data["activity_id"] = bundle.obj.activity.id
        bundle.data["career_id"] = bundle.obj.career.id
        return bundle

class ActivityResource(ModelResource):
    levels = fields.ManyToManyField(LevelResource, 'level_set')

    class Meta:
        queryset = Activity.objects.all()

    def dehydrate(self, bundle):
        # Set specific activity information
        if hasattr(bundle.obj, "relational"):
            child_obj = bundle.obj.relational
            bundle.data["activity_type"] = "relational"
        elif hasattr(bundle.obj, "temporal"):
            child_obj = bundle.obj.temporal
            bundle.data["activity_type"] = "temporal"
        elif hasattr(bundle.obj, "visual"):
            child_obj = bundle.obj.visual
            bundle.data["activity_type"] = "visual"
        elif hasattr(bundle.obj, "linguistic"):
            child_obj = bundle.obj.linguistic
            bundle.data["activity_type"] = "linguistic"
        elif hasattr(bundle.obj, "geospatial"):
            child_obj = bundle.obj.geospatial
            bundle.data["activity_type"] = "geospatial"
        else:
            bundle.data["activity_type"] = "unknown"
            return bundle
        fields = child_obj._meta.local_fields
        for f in fields:
            field_name = f.name
            bundle.data[field_name] = getattr(child_obj, field_name)
        return bundle
