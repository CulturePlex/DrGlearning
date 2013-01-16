# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Max

from knowledges.models import Career
from players.models import Player, HighScore


class Command(BaseCommand):

    args = "career_id"
    help = "\tShow a report witt scores for the career `career_id`."
    can_import_settings = True

    def handle(self, *args, **options):
        if not args:
            raise CommandError("All the parameters must be provided.")
        career_id = args[0]
        career = Career.objects.get(id=career_id)
        self.stdout.write("=" * len(career.name) + "\n")
        self.stdout.write(career.name)
        self.stdout.write("\n" + "=" * len(career.name) + "\n")
        activity_count = career.activity_set.count() * 100
        params = {
            "highscore__activity__career__id": career_id,
        }
        players = Player.objects.filter(**params).distinct()
        for player in players:
            self.stdout.write(player.get_name() + u"\n")
            count = 0
            for activity in career.activity_set.all():
                scores = HighScore.objects.filter(activity=activity,
                                                  player=player)
                max_score = scores.aggregate(max=Max("score")).get("max", 0.0)
                if not max_score:
                    max_score = 0.0
                self.stdout.write(u"\t{0}:\t{1}\n".format(activity.name,
                                                        max_score))
                count += max_score
            avg = avg = 100 * (count / activity_count)
            message = u"\tAVERAGE:\t{0} ({1}/{2})\n".format(avg, count,
                                                          activity_count)
            self.stdout.write(u"\t--------\n")
            self.stdout.write(message)
            self.stdout.write(u"\n\t--------\n\n")
