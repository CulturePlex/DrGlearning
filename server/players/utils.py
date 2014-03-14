# -*- coding: utf-8 -*-
from django.db.models import Count, Max
from django.utils.datastructures import SortedDict

from knowledges.models import Career
from players.models import Player, HighScore


def get_scores(career, level_type=None, slice=None, order_by=[], details=False,
               **params):
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
    if not level_type:
        activity_params = {}
    else:
        activity_params = {
            "level_type": level_type,
        }
    scores = SortedDict()
    for player in sliced_players:
        count = 0
        attempts_count = 0
        activities = {}
        for activity in career.activity_set.filter(**activity_params):
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


def get_top_players(career, level_type=None, first_n=5,
                    exclude_empty_names=True):
    try:
        career.id
    except AttributeError:
        career = Career.objects.get(id=career)
    filter_params = {
        "highscore__activity__career": career,
    }
    exclude_params = {}
    if exclude_empty_names:
        exclude_params.update({
            "highscore__player__display_name__iexact": "",
        })
    if level_type:
        filter_params.update({
            "highscore__activity__level_type": level_type,
        })
        num_activities = career.activity_set.filter(
            level_type=level_type
        ).count()
    else:
        num_activities = career.activity_set.count()
    # Get max score per activity and player
    subquery_sql, subquery_params = Player.objects.filter(
        **filter_params
    ).values(
        "highscore__activity__id"
    ).annotate(
        max_score=Max("highscore__score"),
        max_timestamp=Max("highscore__timestamp"),
    ).values(
        "id",
        "highscore__activity__level_type",
        "highscore__activity__id",
        "max_score",
        "max_timestamp",
    ).exclude(
        **exclude_params
    ).query.sql_with_params()
    # Get the sum of the max scores per activity, grouped by career or level
    query, query_params = Player.objects.extra(
        select={
            "sum_score": 'SUM("max_scores"."max_score") / %s',
            "last_timestamp": 'MAX("max_scores"."max_timestamp")',
            "count_score": 'COUNT("players_player"."id")'
        },
        select_params=[num_activities]
    ).query.sql_with_params()
    raw_query = """
    {}, ({}) as "max_scores"
    WHERE "max_scores"."id" = "players_player"."id"
    GROUP BY "max_scores"."id", "players_player"."id"
    ORDER BY "sum_score" DESC, "last_timestamp" DESC
    LIMIT %s
    """.format(query, subquery_sql)
    top_players = Player.objects.raw(
        raw_query=raw_query,
        params=query_params + subquery_params + (first_n, )
    )
    return tuple(top_players)
