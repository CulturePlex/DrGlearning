var Workflow = {
	prevLevelString:null,
	currentLevelString:null,
	/*
	 * Updating and Showing next activity when you success one.
	 */
	nextActivity: function (prevLevel) {
		var currentLevel = Workflow.getCurrenLevel(DrGlearning.careerId);
		console.log(DrGlearning.levelId);
		Dao.levelsStore.get(DrGlearning.levelId,function(level){
			console.log(level);
			Workflow.prevLevelString = level.value.name;
		});
		if (currentLevel !== -1) {
			Dao.levelsStore.get(currentLevel,function(level){
				Workflow.currentLevelString = level.value.name;
			});
		} else
		{
		    Workflow.currentLevelString = 'Error';
		}
		var currentActivity = Workflow.getCurrenActivity(DrGlearning.careerId, parseInt(prevLevel, 10));
		if (currentActivity.value.successful === false) {
		    Workflow.updateActivity(currentActivity);
		}
		else {
		    if (parseInt(currentLevel, 10) === parseInt(prevLevel, 10)) {
   				$('#dialogText').html("You have completed the %s level! It was the last level, you have finished this course!");
			    $.mobile.changePage("#dialog");
		    }
		    else {
		        Workflow.updateCareer(DrGlearning.careerId);
		        if (currentLevel !== -1) {
   					$('#dialogText').html("You have completed the %s level! The next one is %s");
				    $.mobile.changePage("#dialog");
		        }
		        else {
  					$('#dialogText').html("You have completed the %s level! It was the last level, you have finished this course!");
				    $.mobile.changePage("#dialog");
		        }
		    }
		}

	},
    getCurrenLevel: function (careerId, level) {
        var levels;
		Dao.careersStore.get(careerId, function(career){
			levels = career.value.levels;
		});
		console.log(levels);
        for (var i = 0; i <= levels.length; i++) {
            var activities = [];
			Dao.activitiesStore.each(function (record,index){
				console.log(record);
                if (parseInt(record.value.careerId, 10) === parseInt(careerId, 10) && record.value.level_type === '' + level) {
					activities.push(record);
				}
            }); 
            for (var j = 0; j < activities.length; j++) {
                if (!activities[j].value.successful) {
                    return levels[i]; 
                }
            }
        }
        return -1;
    },
    getCurrenActivity: function (carrerID, level) {
		var activity;
		Dao.activitiesStore.each(function (record,index){
			console.log(record.value.level_type);
			console.log(level);
            if (record.value.level_type == level && !record.value.successful) {
                activity = record; 
            }
        });
//      return activities.items[0];
		return activity;
    },
	updateActivity: function(newActivity){
		console.log(newActivity);
        DrGlearning.activityId = newActivity.value.id;
            if(newActivity.value.activity_type === "quiz")
            {
                $.mobile.changePage("#quiz");
            }
            if(newActivity.value.activity_type === "temporal")
            {
                $.mobile.changePage("#temporal");
            }
            if(newActivity.value.activity_type === "visual")
            {
                $.mobile.changePage("#visual");
            }
            if(newActivity.value.activity_type === "linguistic")
            {
                $.mobile.changePage("#linguistic");
            }
            if(newActivity.value.activity_type === "geospatial")
            {
                $.mobile.changePage("#geospatial");
            }
		    if(newActivity.value.activity_type === "relational")
            {
                $.mobile.changePage("#relational");
            }
	}
}
