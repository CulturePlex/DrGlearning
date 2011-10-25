from tastypie import fields
from tastypie.resources import ModelResource


from activities.models import Activity, Level, Relational

class ActivityResource(ModelResource):

    class Meta:
        queryset = Activity.objects.all()

    def dehydrate(self, bundle):
        if hasattr(bundle.obj, "relational"):
            child_obj = bundle.obj.relational
        elif hasattr(bundle.obj, "temporal"):
            child_obj = bundle.obj.afterbefore
        elif hasattr(bundle.obj, "visual"):
            child_obj = bundle.obj.visualmemory
        elif hasattr(bundle.obj, "linguistic"):
            child_obj = bundle.obj.hangmanpuzzle
        elif hasattr(bundle.obj, "geospatial"):
            child_obj = bundle.obj.geospatialareas
        else:
            return bundle
        fields = child_obj._meta.local_fields
        for f in fields:
            field_name = f.name
            bundle.data[field_name] = getattr(child_obj, field_name)
        return bundle


class LevelResource(ModelResource):
    activity = fields.ForeignKey(ActivityResource, 'activity')

    class Meta:
        queryset = Level.objects.all()
