from django.db.models.fields.files import ImageField

from tastypie import fields
from tastypie.resources import ModelResource

from activities.api import ActivityUpdateResource
from base.utils import dehydrate_fields
from knowledges.models import Knowledge, Career


class KnowledgeResource(ModelResource):
    class Meta:
        queryset = Knowledge.objects.all()


class CareerResource(ModelResource):
    knowledges = fields.ManyToManyField(KnowledgeResource,
                                        'knowledge_field',
                                        full=True)
    activities = fields.ManyToManyField(ActivityUpdateResource,
                                        'activity_set',
                                        full=True)

    class Meta:
        queryset = Career.objects.all()

    def dehydrate(self, bundle):
        # Career creator name
        bundle.data["creator"] = bundle.obj.user.get_full_name() or \
                                                    bundle.obj.user.username

        # Career size in bytes
        size = 0
        for activity in bundle.data["activities"]:
            size += activity.obj.size()
        fields = [f for f in bundle.obj._meta.fields if not isinstance(f, ImageField)]
        for field in fields:
            size += len(unicode(getattr(bundle.obj, field.name)))
        bundle.data["size"] = size

        return dehydrate_fields(bundle)

    def alter_list_data_to_serialize(self, request, data):
        # Filter careers without activities
        careers_objects = data["objects"]
        filtered_careers = [c for c in careers_objects \
                if c.obj.activity_set.count() > 0]
        data["objects"] = filtered_careers
        return data
