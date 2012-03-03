from tastypie import fields
from tastypie.resources import ModelResource

from activities.models import Activity
from base.utils import dehydrate_fields
from knowledges.models import Career


class ActivityUpdateResource(ModelResource):
    activity = fields

    class Meta:
        queryset = Activity.objects.all()
        fields = ['timestamp']

    def dehydrate(self, bundle):
        activity_url = bundle.data["resource_uri"].replace("activityupdate",
                                                            "activity")
        bundle.data["full_activity_url"] = activity_url
        return bundle


class ActivityResource(ModelResource):

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
        return dehydrate_fields(bundle, child_obj)
