try:
    import simplejson
except ImportError:
    from django.utils import simplejson

from django.shortcuts import HttpResponse
from django.utils.http import urlquote

from knowledges.models import Career

def export_career(request, career_id):
    career = Career.objects.get(id=career_id)
    exported_career = simplejson.dumps(career.export())
    response = HttpResponse(exported_career, mimetype='application/json')
    response['Content-Disposition'] = \
            'attachment; filename=%s.json' % urlquote(career.name)
    return response
