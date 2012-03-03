from tastypie import fields
from tastypie.resources import ModelResource

from knowledges.models import Knowledge, Career
from activities.api import ActivityUpdateResource


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
            size += len(str(activity.data))
        size += len(str(bundle.data))
        bundle.data["size"] = size

        return bundle

    def alter_list_data_to_serialize(self, request, data):
        # Filter careers without activities
        careers_objects = data["objects"]
        filtered_careers = [c for c in careers_objects \
                if c.obj.activity_set.count() > 0]
        data["objects"] = filtered_careers
        return data
