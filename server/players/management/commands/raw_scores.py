# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand, CommandError

from activities.models import Activity, Career
from players.models import HighScore


class Command(BaseCommand):
    args = "career_id"
    help = "\tShow raw dump of attempts per activity for the " \
           "career `career_id`."
    can_import_settings = True

    def handle(self, *args, **options):
        if not args:
            raise CommandError("All the parameters must be provided.")
        career_id = args[0]
        career = Career.objects.get(id=career_id)
        heads = u"'course_id','course_name'," \
                u"'activity_id','activity_name','activity_type'," \
                u"'activity_level','score',"\
                u"'score_activity_date','score_activity_time'," \
                u"'score_activity_is_passed'," \
                u"'player_id','player_email','player_name'"
        self.stdout.write(u"{}\n".format(heads).encode("utf8"))
        high_scores = HighScore.objects.filter(activity__career_id=career_id)
        high_scores = high_scores.select_related()
        for hs in high_scores:
            for activity_type in hs.activity.activity_subtypes:
                try:
                    getattr(hs.activity, activity_type)
                    break
                except Activity.DoesNotExist:
                    continue
            row = [
                career.id,
                career.name.replace(u"'", u"''"),
                hs.activity.id,
                hs.activity.name.replace(u"'", u"''"),
                activity_type,
                hs.activity.level_type,
                hs.score,
                hs.timestamp.date(),
                hs.timestamp.time().strftime("%H:%M:%S"),
                int(hs.is_passed),
                hs.player.id,
                hs.player.email.replace(u"'", u"''"),
                hs.player.display_name.replace(u"'", u"''"),
            ]
            line = u"{},'{}',{},'{}','{}',{},{},'{}','{}',{},{},'{}','{}'"
            self.stdout.write(u"{}\n".format(line.format(*row)).encode("utf8"))
