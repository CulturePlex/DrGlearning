from tastypie import fields
from tastypie.resources import ModelResource

from knowledges.models import Knowledge, Career
from activities.api import ActivityResource


class KnowledgeResource(ModelResource):
    class Meta:
        queryset = Knowledge.objects.all()


class CareerResource(ModelResource):
    knowledges = fields.ManyToManyField(KnowledgeResource, 'knowledge_field')
    activities = fields.ManyToManyField(ActivityResource, 'activities')

    class Meta:
        queryset = Career.objects.all()

    def dehydrate(self, bundle):
        bundle.data["creator"] = bundle.obj.user.get_full_name() or \
                                                    bundle.obj.user.username
        return bundle
