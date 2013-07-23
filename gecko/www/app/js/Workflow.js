//Workflow Controller
var Workflow = {
    //Variables to keep the current and previous levels in order to know which message and actions reach when successing an activity 
	prevLevelString:null,
	currentLevelString:null,
    //Variables to know which view to show after click de OK button in workflow dialog
	toCareer:false,
	toLevel:false,
	toMain:false,
	toSettings:false,
	toActivity:false,
	toStarting:false,
    toDialogPrivate:false,
    //Variable to know if we are just showing a message because we are starting the app
    starting:false,
    //Variable to know if we are showing the dialog because we are uninstalling a course
	uninstalling:false,
	//Method Updating and Showing next activity when you success one.
	nextActivity: function (prevLevel) {
		var currentLevel = Workflow.getCurrenLevel(DrGlearning.careerId,prevLevel);
		Dao.levelsStore.get(DrGlearning.levelId,function(level){
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
		if (currentActivity != -1) {
		    Workflow.updateActivity(currentActivity);
		}
		else {
            //If current level is equal to previous level , user has success all levels!
		    if (parseInt(currentLevel, 10) === parseInt(prevLevel, 10)) {
   				$('#dialogText').html("You have completed the "+prevLevel+" level! It was the last level, you have finished this course!");
				Workflow.toMain = true;
			    $.mobile.changePage("#dialog");
		    }
		    else {
                //If current level is equal to previous level , user has success this level!
		        if (currentLevel !== -1) {
   					$('#dialogText').html("You have completed the %s level! The next one is %s");
					Workflow.toCareer = true;
				    $.mobile.changePage("#dialog");
		        }
		        else {
   					$('#dialogText').html("You have completed the level "+prevLevel+"!");
					Workflow.toCareer = true;
				    $.mobile.changePage("#dialog");
		        }
		    }
		}

	},
    //Method to know which is the current level in a course
    getCurrenLevel: function (careerId, level) {
        var levels;
		Dao.careersStore.get(careerId, function(career){
			levels = career.value.levels;
		});
        for (var i = 0; i <= levels.length; i++) {
            var activities = [];
			Dao.activitiesStore.each(function (record,index){
                if (parseInt(record.value.careerId, 10) === parseInt(careerId, 10) && record.value.level_type === parseInt(level, 10)) {
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
    //Method to know which is the current activity given a course and a level
    getCurrenActivity: function (carrerID, level) {
		var activity = -1;
		var temp = true;
		Dao.activitiesStore.each(function (record,index){
            if (record.value.careerId == '' + carrerID &&record.value.level_type == level && !record.value.successful && temp) {
                activity = record;
				temp = false; 
            }
        });
		return activity;
    },
    //Method to refresh activity view
	updateActivity: function(newActivity){
        DrGlearning.activityId = newActivity.value.id;
            if(newActivity.value.activity_type === "quiz")
            {
                $.mobile.changePage("#quiz");
				Quiz.refresh();
            }
            if(newActivity.value.activity_type === "temporal")
            {
                $.mobile.changePage("#temporal");
				Temporal.refresh();
            }
            if(newActivity.value.activity_type === "visual")
            {
                $.mobile.changePage("#visual");
				Visual.refresh();
            }
            if(newActivity.value.activity_type === "linguistic")
            {
                $.mobile.changePage("#linguistic");
				Linguistic.refresh();
            }
            if(newActivity.value.activity_type === "geospatial")
            {
                $.mobile.changePage("#geospatial");
				Geospatial.refresh();
            }
		    if(newActivity.value.activity_type === "relational")
            {
                $.mobile.changePage("#relational");
				Relational.refresh();
            }
	},
    //Method to know if a level is completed given a course
	levelIsCompleted: function(levelId,careerId)
	{
		var is=true;
		Dao.activitiesStore.each(function (record,index) {
			if(record.value.level_type == levelId.value.customId && record.value.careerId == careerId && record.value.successful == false)
			{

				is=false;
			}
		});

		return is;
	},
    //Method to get the icons html code for levels in main view, if the level is not successed system shows semi-transparent image
	getLevelIcons: function(careerId)
	{
		var html="";
		Dao.careersStore.get(careerId,function (career) {
			for(var i=0;i<career.value.levels.length;i++)
			{
				Dao.levelsStore.get(career.value.levels[i], function(level){
					if(Workflow.levelIsCompleted(level,careerId))
					{
						html += "<img src='resources/images/level_icons/"+level.value.name.toLowerCase()+".png' height = '30'>";
					}
					else
					{
						html += "<img src='resources/images/level_icons/"+level.value.name.toLowerCase()+"B.png' height = '30'>";
					}
				});
			}
		});
		return html;
	}
}
