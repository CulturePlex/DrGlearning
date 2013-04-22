# -*- coding: utf-8 -*-
from django.db.models import Count, Max
from django.utils.datastructures import SortedDict

from players.models import Player, HighScore


def get_scores(career, slice=None, order_by=[], details=False, **params):
    career_id = career.id
    activity_count = career.activity_set.count() * 100
    params.update({
        "highscore__activity__career__id": career_id,
    })
    players = Player.objects.filter(**params).distinct()
    for order in order_by:
        players = players.order_by(order)
    if slice:
        sliced_players = players[slice]
    else:
        sliced_players = players
    scores = SortedDict()
    for player in sliced_players:
        count = 0
        attempts_count = 0
        activities = {}
        for activity in career.activity_set.all():
            hscores = HighScore.objects.filter(activity=activity,
                                               player=player)
            aggregated_hscores = hscores.aggregate(
                max=Max("score"),
                count=Count("score"),
            )
            max_score = aggregated_hscores.get("max", 0.0)
            count_score = aggregated_hscores.get("count", 0.0)
            if not max_score:
                max_score = 0.0
            count += max_score
            attempts = count_score
            attempts_count += attempts
            if details:
                activities[activity] = {"max_score": max_score,
                                        "attempts": attempts}
        avg = 100 * (count / activity_count)
        avg_attempts = 100 * (1.0 * attempts_count) / activity_count
        scores[player] = {
            "avg": avg,
            "activities": activities,
            "avg_attempts": avg_attempts,
        }
    return scores, players