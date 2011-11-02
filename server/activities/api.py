import base64

from django.db.models.fields.files import ImageField

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


class ActivityUpdateResource(ModelResource):
    activity = fields

    class Meta:
        queryset = Activity.objects.all()
        fields = ['timestamp']

    def dehydrate(self, bundle):
        #import ipdb;ipdb.set_trace()
        activity_url = bundle.data["resource_uri"].replace("activityupdate",
                                                            "activity")
        bundle.data["full_activity_url"] = activity_url
        return bundle


class ActivityResource(ModelResource):
    levels = fields.ManyToManyField(LevelResource, 'level_set',full=True)

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
            # If image convert to base64
            if isinstance(f, ImageField):
                image_path = getattr(child_obj, field_name).path
                ext = image_path.split('.')[-1]
                image_data = open(image_path,"rb").read()
                bundle.data[field_name] = "data:image/%s;base64,%s" % (ext,
                                            base64.encodestring(image_data))
            else:
                bundle.data[field_name] = getattr(child_obj, field_name)
        return bundle
