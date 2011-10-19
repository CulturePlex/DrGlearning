from tastypie import fields
from tastypie.resources import ModelResource

from knowledges.models import Knowledge, Career
from activities.api import LevelResource


class KnowledgeResource(ModelResource):
    class Meta:
        queryset = Knowledge.objects.all()


class CareerResource(ModelResource):
    knowledges = fields.ManyToManyField(KnowledgeResource, 'knowledge_field')
    levels = fields.ManyToManyField(LevelResource, 'level_set')

    class Meta:
        queryset = Career.objects.all()
