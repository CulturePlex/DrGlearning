from tastypie.resources import ModelResource
from knowledges.models import Knowledge


class KnowledgeResource(ModelResource):
    class Meta:
        queryset = Knowledge.objects.all()
