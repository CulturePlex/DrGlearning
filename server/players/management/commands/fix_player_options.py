# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand

from knowledges.models import Career
from players.models import Player


class Command(BaseCommand):

    help = "\tFill up `options` JSON dictionaries with the proper " \
           "careers installed per player."
    can_import_settings = True

    def handle(self, *args, **options):
        self.stdout.write("Gettting careers for players\n")
        for player in Player.objects.all():
            try:
                self.stdout.write("\tPlayer: {0}, ".format(player.get_name()))
            except UnicodeEncodeError:
                self.stdout.write("\tPlayer: {0}, ".format(player.id))
            options = player.options
            try:
                "careers" in options
            except:
                options = {}
            careers = Career.objects.filter(activity__highscore__player=player)
            distinct_careers_ids = [c["id"]
                                    for c in careers.distinct().values("id")]
            options["careers"] = distinct_careers_ids
            self.stdout.write("{} careers\n".format(len(distinct_careers_ids)))
            player.options = options
            player.save()
        self.stdout.write("Done\n")
