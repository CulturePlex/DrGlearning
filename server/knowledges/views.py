try:
    import simplejson
except ImportError:
    from django.utils import simplejson

from django.shortcuts import (HttpResponse, HttpResponseRedirect,
                            render_to_response)
from django.template import RequestContext
from django.utils.http import urlquote

from activities.models import Activity
from knowledges.forms import CareerImportForm
from knowledges.models import Career


def export_career(request, career_id):
    career = Career.objects.get(id=career_id)
    exported_career = simplejson.dumps(career.export())
    response = HttpResponse(exported_career, mimetype='application/json')
    response['Content-Disposition'] = \
            'attachment; filename=%s.json' % urlquote(career.name)
    return response

def import_career(request, career_id):
    if request.method == "POST":
        form = CareerImportForm(request.POST, request.FILES)
        if form.is_valid():
            file_data = request.FILES['activities_file'].read()
            activities = simplejson.loads(file_data)
            career = Career.objects.get(id=career_id)
            for a in activities:
                Activity.create_from_dict(career, a)
            return HttpResponseRedirect('/admin/knowledges/career/%s/' % career_id)
    else:
        form = CareerImportForm()
    return render_to_response('import_activities.html', {
        'form': form,
        'career_id': career_id
        }, context_instance=RequestContext(request))
