try:
    import simplejson
except ImportError:
    from django.utils import simplejson

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import transaction
from django.shortcuts import (HttpResponse, HttpResponseRedirect,
                              render_to_response)
from django.template import RequestContext
from django.utils.http import urlquote
from django.utils.translation import ugettext as _

from activities.models import Activity
from knowledges.forms import CareerImportForm
from knowledges.models import Career
from players.utils import get_scores


def export_career(request, career_id):
    career = Career.objects.get(id=career_id)
    exported_career = simplejson.dumps(career.export())
    response = HttpResponse(exported_career, mimetype='application/json')
    response['Content-Disposition'] = 'attachment; filename=%s.json' \
                                      % urlquote(career.name)
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
            return HttpResponseRedirect('/admin/knowledges/career/%s/'
                                        % career_id)
    else:
        form = CareerImportForm()
    return render_to_response('import_activities.html', {
        'form': form,
        'career_id': career_id
    }, context_instance=RequestContext(request))


@transaction.autocommit
def scores_view(request, career_id):
    career = Career.objects.get(id=career_id)
    scores_per_page = 25
    page = int(request.GET.get('p', 1))
    q = request.GET.get("q", u"")
    hide_null_emails = int(request.GET.get("hide_null_emails", 1))
    if q:
        q_search = q
    elif hide_null_emails == 0:
        q_search = u""
    else:
        q_search = u"@"
    scores, players = get_scores(
        career,
        order_by=("display_name", "email"),
        slice=slice((page - 1) * scores_per_page, page * scores_per_page),
        email__icontains=q_search)
    paginator = Paginator(players, scores_per_page)  # Show 25 scores per page
    try:
        pages = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        pages = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        pages = paginator.page(paginator.num_pages)
    return render_to_response('knowledges/career_scores.html', {
        'title': _(u"Scores"),
        'current_app': "knowledges",
        'app_label': "knowledges",
        'model_name': career._meta.verbose_name_plural,
        'career': career,
        'object': career,
        'object_id': career.id,
        'scores': scores,
        'players': players,
        'pages': pages,
        'q': q,
        'hide_null_emails': hide_null_emails,
    }, context_instance=RequestContext(request))
