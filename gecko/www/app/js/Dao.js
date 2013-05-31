var Dao = {
	careersToUpdate: null,
	numberCareersToUpdate: null,
	userStore : new Lawnchair({adapter:'dom',name:'user'}, function(e) {
    }),
    careersStore : new Lawnchair({adapter:'dom',name:'careers'}, function(e) {
    }),
	checkCode: function (element,code) {
        if(typeof element != "object")
        {
            var temp = $("<div data-href='"+element+"'></div>");
            element = temp;
        }
        var HOST = GlobalSettings.getServerURL();
        jQuery.ajax({
            url: HOST + "/api/v1/career/"+element.attr("data-href")+"/?format=json",
            dataType : 'json',
			data: {code: Loading.SHA1(code),callback: 'a'},
            success: function (response, opts) {
				$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Installing Course...')+'</p>' });	
				//DrGlearning.careerId=element.attr("data-href");
				if(DrGlearning.embed)
				{
					Loading.getCareer(UserSettings.careerTemp.key,code);
				}
				else
				{
	                Dao.installCareer(element,code);
				}
            },
            failure: function () {
				$.unblockUI();
				Workflow.toMain = true;
				$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
			    $('#dialogText').html(i18n.gettext("Course was not installed because private code was invalid"));
            },
			error: function () {
				$.unblockUI();
				Workflow.toMain = true;
				$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
			    $('#dialogText').html(i18n.gettext("Course was not installed because private code was invalid"));
            },
        });
    },
    installCareer: function (element,code) {
        var careerTemp;
        Dao.careersStore.get(element.attr("data-href"),function(career){ 
            careerTemp = career;
        });
        careerTemp.value.career_code = code;
        Dao.careersStore.save({key:element.attr("data-href"),value:careerTemp.value});
        Loading.getCareer(element.attr("data-href"),code);
    },
    levelsStore : new Lawnchair({adapter:'dom',name:'levels'}, function(e) {
    }),
    initLevels: function () {
        var dataLevels = [
        {
            "customId": 1,
            "name": "Illetratum",
            "nameBeauty": i18n.gettext("Illetratum"),
            "description": i18n.gettext("Don't know anything about this? Learn your basics here!")
        },
        {
            "customId": 2,
            "name": "Primary",
            "nameBeauty": i18n.gettext("Primary"),
            "description": i18n.gettext("Now you have an idea. But there’s so much more to learn!")
        },
        {
            "customId": 3,
            "name": "Secondary",
            "nameBeauty": i18n.gettext("Secondary"),
            "description": i18n.gettext("Keep going!")
        },
        {
            "customId": 4,
            "name": "HighSchool",
            "nameBeauty": i18n.gettext("High School"),
            "description": i18n.gettext("For every thing you know there is another one you don’t!")
        },
        {
            "customId": 5,
            "name": "College",
            "nameBeauty": i18n.gettext("College"),
            "description": i18n.gettext("You’ve done your courses. Now is the time to prove it!")
        },
        {
            "customId": 6,
            "name": "Master",
            "nameBeauty": i18n.gettext("Master"),
            "description": i18n.gettext("I’m starting to think you might be good after all")
        },
        {
            "customId": 7,
            "name": "PhD",
            "nameBeauty": i18n.gettext("PhD"),
            "description": i18n.gettext("If you’re still here you must really love this")
        },
        {
            "customId": 8,
            "name": "PostDoc",
            "nameBeauty": i18n.gettext("Post-Doc"),
            "description": i18n.gettext("Think you're an expert? Can you become a professor now?")
        },
        {
            "customId": 9,
            "name": "Professor",
            "nameBeauty": i18n.gettext("Professor"),
            "description": i18n.gettext("Want to try to teach me a lesson?")
        },
        {
            "customId": 10,
            "name": "Emeritus",
            "nameBeauty": i18n.gettext("Emeritus"),
            "description": i18n.gettext("Nobody knows more about this than you? We'll see…")
        }];
        for(var i = 0; i<dataLevels.length;i++)
	      {
            Dao.levelsStore.save({key:dataLevels[i].customId,value:dataLevels[i]});
        }
    },
    activitiesStore : new Lawnchair({adapter:'dom',name:'activities'}, function(e) {
    }),
    knowledgesStore : new Lawnchair({adapter:'dom',name:'knowledges'}, function(e) {
    }),
    knowledgesRequest: function () {
        var HOST = GlobalSettings.getServerURL();
        jQuery.ajax({
            url: HOST + "/api/v1/knowledge/?format=json",
            dataType : 'json',
			data: {
					"callback": "a",
                },
            success: function (response, opts) {
                var knowledges = response.objects;
                Dao.knowledgesStore.nuke(); 
                $("#select-knowledges").empty();
                $("#select-knowledges").append('<option value="All">All</option>');
                for (var cont in knowledges) {
                    var knowledge = knowledges[cont];
                    Dao.knowledgesStore.save({key:knowledge.id,value:knowledge});
                    $("#select-knowledges").append('<option value="'+knowledge.name+'">'+knowledge.name+'</option>');
                }
            },
            failure: function () {
            }
        });
    },
	activityPlayed: function (activityID, successful, score)
	{
    	Dao.updateScore(activityID, score, successful, new Date().getTime());
	},
	uninstall: function (careerId)
	{
		Dao.careersStore.get(careerId, function (career){
			career.value.installed = false;
			Dao.careersStore.save({key:careerId,value:career.value});
		});
        Dao.userStore.get('options',function(me) {
			temp = me;
		});
        if(!temp)
		{
			temp = {value:{}};
		}
			
		if(!temp.value.careers)
		{
			temp.value.careers = [];
		}
        var index = temp.value.careers.indexOf(careerId);
        temp.value.careers.splice(index, 1);
		Dao.userStore.save({key:'options',value:temp.value});
		UserSettings.updateUserSettings();		
    },
	updateScore: function (activityID, score, successful, timestamp) {
		var uniqueid;
		Dao.userStore.get('uniqueid',function(me)
		{
			uniqueid = (me !== null) ? me.value : '';
		});
		var token;
		Dao.userStore.get('token',function(me)
		{
			token = (me !== null) ? me.value : '';
		});
        var careerID;
        Dao.activitiesStore.get(activityID, function(me)
		{
			careerID = (me !== null) ? me.value.careerId : '';
		});
        var career_code;
        Dao.activitiesStore.get(activityID, function(me)
		{
			careerID = (me !== null) ? me.value.careerId : '';
		});
        var HOST = GlobalSettings.getServerURL();
        var parameters = {
			callback: "a",
	        player_code: uniqueid,
	        activity_id: activityID,
	        score: parseFloat(score),
	        is_passed: successful,
	        timestamp: timestamp / 1000,
	        token: token 
		};
        var career_code = "";
        careerID = parseInt(careerID,10);
        Dao.careersStore.get(parseInt(careerID,10), function(me)
		{
			career_code = me.value.career_code;
		});
        if(career_code!=undefined)
        {
            parameters.career_code = Loading.SHA1(career_code);
        }
        $.ajax({
		    url: HOST + '/api/v1/score/',
		    data: parameters,
			dataType: "json",
            statusCode: {
                409: function() {
                  Workflow.toLevel = true;
				  $.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
				  $('#dialogText').html(i18n.gettext("This course is not currently available. Your scores have not been sent."));
                },
                403: function() {
                  DrGlearning.careerSelect = careerID;
				  Workflow.toDialogPrivate = true;
				  $.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
				  $('#dialogText').html(i18n.gettext("This course is now private. You can't send your scores without enter the course code."));
                  $("#dialogPrivateName").html(i18n.gettext("Private Course"));
    			  $("#dialogPrivateDescription").html(i18n.gettext("Type here the private code for this course"));
		  		  $("#inputPrivate").val('');
				  $("#inputPrivate").prop('disabled', false);
                },
                200: function() {
		            Dao.activitiesStore.get(activityID.toString(),function(activity){ 
		                if (successful) {
		                    if (activity.value.successful) {
		                        if (activity.value.score < parseInt(score, 10)) {
		                            activity.value.score = parseInt(score, 10);
		                        }
		                    } else {
		                        activity.value.score = parseInt(score, 10);
		                    }
		                    activity.value.successful = true;
		                } else {
		                    if (!activity.value.successful) {
		                        if (activity.value.score < parseInt(score, 10)) {
		                            activity.value.score = parseInt(score, 10);
		                        }
		                    }
		                }
		                activity.value.played = true;
		                Dao.activitiesStore.save({key:activityID,value:activity.value});
                    });
                },
              }
		});
    },
	preinstallCareer: function (career) {
        Dao.careerPreinstalling = career;
        var activities = career.activities;
        var activitiesInstalled = 0;
        var cont;
		var id;
		Dao.userStore.get('id',function(me)
		{
			id = (me !== null) ? me.value : '';
		});
        for (cont in activities) {
            if (activities[cont])
            {
                var activitiesToInstall = [];
                var size = 0;
	      		var HOST = GlobalSettings.getServerURL();
                $.ajax({
                    dataType: "json",
                    url: HOST + activities[cont] + '?format=json',
                    data: {
                        deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                        deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                    },
					data: {
					"callback": "a",
                    "player__id": id
	                },
                    success: function (response, opts) {
                        var activity = response;
                        var career = Dao.careerPreinstalling;
                        var activityModel = {
                            id : activity.id,
                            name : activity.name.trim(),
                            careerId : career.id,
                            activity_type : activity.activity_type.trim(),
                            language_code : activity.language_code.trim(),
                            level_type : activity.level_type,
                            level_order : activity.level_order,
                            level_required : activity.level_required,
                            query : activity.query.trim(),
                            timestamp : activity.timestamp.trim(),
                            resource_uri : activity.resource_uri.trim(),
                            reward: activity.reward.trim(),
                            penalty: activity.penalty.trim(),
                            score: (activity.best_score !== null) ? activity.best_score : 0,
                            played: (activity.best_score !== null) ? true : false,
                            successful: (activity.is_passed === true) ? true : false,
                            helpviewed: false
                        };
                        if (activityModel.activity_type == 'linguistic') {
                            //activityModel.setImage('image', activity.image, this);
                            $.extend(activityModel,{ image_url : activity.image_url.trim()});
                            $.extend(activityModel,{ locked_text : activity.locked_text.trim()});
                            $.extend(activityModel,{ answer : activity.answer.trim()});
                        }
                        if (activityModel.activity_type == 'visual') {
                            //activityModel.setImage('image', activity.image, this);
                            //activityModel.setImage('obImage', activity.obfuscated_image, this);
                            $.extend(activityModel,{ image_url : activity.image_url.trim()});
                            $.extend(activityModel,{ obfuscated_image_url : activity.obfuscated_image_url.trim()});
                            //activityModel.data.image=activity.image;
                            $.extend(activityModel,{ answers : activity.answers});
                            $.extend(activityModel,{ correct_answer : activity.correct_answer.trim()});
                            //activityModel.set('obfuscated_image', activity.obfuscated_image);
                            $.extend(activityModel,{ obfuscated_image_url : activity.obfuscated_image_url.trim()});
                            $.extend(activityModel,{ time : activity.time.trim()});
                        }
                        if (activityModel.activity_type == 'quiz') {
                            //activityModel.setImage('image', activity.image, this);
                            $.extend(activityModel,{ image_url : activity.image_url });
                            //activityModel.data.image=activity.image;
                            $.extend(activityModel,{ answers : activity.answers });
                            $.extend(activityModel,{ correct_answer : activity.correct_answer.trim()});
                            //activityModel.set('obfuscated_image',activity.obfuscated_image);
                            if (activity.time) {
                                $.extend(activityModel,{time : activity.time.trim()});
                            }
                        }
                        if (activityModel.activity_type == 'relational') {
                            $.extend(activityModel,{ graph_nodes : activity.graph_nodes});
                            for (var x in activity.graph_edges) {
                                if (activity.graph_edges[x].inverse === undefined) {
                                    activity.graph_edges[x].inverse = "";
                                }
                            }
                            $.extend(activityModel,{ graph_edges : activity.graph_edges});
                            $.extend(activityModel,{ constraints : activity.constraints});
                            $.extend(activityModel,{ path_limit : activity.path_limit});
                        }
                        if (activityModel.activity_type == 'temporal') {
                            //activityModel.setImage('image', activity.image, this);
                            $.extend(activityModel,{ image_url : activity.image_url.trim()});
                            $.extend(activityModel,{ image_datetime : activity.image_datetime.trim()});
                            $.extend(activityModel,{ query_datetime : activity.query_datetime.trim()});
                        }
                        if (activityModel.activity_type == 'geospatial') {
                            $.extend(activityModel,{ area : activity.area.trim()});
                            $.extend(activityModel,{ point : activity.points.trim()});
                            $.extend(activityModel,{ radius : activity.radius});
                        }
                        activitiesToInstall.push(activityModel);
                        activitiesInstalled = activitiesInstalled + 1;
                        if (activities.length == activitiesInstalled) {
                            for (var cont in activitiesToInstall) {
                                if (activitiesToInstall[cont])
                                {
                                    Dao.activitiesStore.save({key:activitiesToInstall[cont].id,value:activitiesToInstall[cont]});
                                }
                            }
                            career.installed = true;
							Dao.careersStore.save({key:career.id,value:career});
                            DrGlearning.refreshMain();						
                            UserSettings.preinstallingIndex++;
                            UserSettings.preinstall();
                        }
                    },
                    failure : function () {
						$.unblockUI();
                    }
                });
            }
        }
     
    },
	manageInMessage: function (message) {
		if(message.data.action === "postPlayerCode")
		{
			UserSettings.importUser(message.data.params.playerCode);
		}
		if(message.data.action === "postCourseCode")
		{
			Dao.checkCode($('<div data-href="' +message.data.params.id  + '">'),message.data.params.courseCode);
		}
	},
	checkForAllCareerUpdate: function (career,updateAllFlag)
    {
		$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Checking for updates...')+'</p>' });
		var HOST = GlobalSettings.getServerURL();
		Dao.careersToUpdate = [];
		var numOfCourses = 0;
		var numOfCoursesChecked = 0;
		Dao.careersStore.each(function(record, index) { 
			if(record.value.installed)
			{
				numOfCourses ++;
			}
		});
		if(numOfCourses==0)
		{
			$.unblockUI();
		}
		Dao.careersStore.each(function(record, index) { 
			if(record.value.installed)
			{
				$.ajax({
					dataType: "json",
					url: HOST + "/api/v1/career/" + record.key + "/?format=json",
					success: function (response, opts) {
						numOfCoursesChecked++;
						if (record.value.timestamp < response.timestamp) {
							Dao.careersToUpdate.push(record);
						}
						if(numOfCourses == numOfCoursesChecked)
						{
							if(Dao.careersToUpdate.length == 0)
							{
								$.unblockUI();
								Workflow.toMain = true;
								$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
								$('#dialogText').html(i18n.gettext("There is no courses to update."));
							}
							else
							{
								for(var i=0;i<Dao.careersToUpdate.length;i++)
								{
									Dao.numberCareersToUpdate = Dao.careersToUpdate.length;
									Dao.updateCareer(Dao.careersToUpdate[i].key,true);

								}
							}
						}								
					},
					error: function () {
						$.unblockUI();
						Workflow.toMain = true;
						$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
						$('#dialogText').html(i18n.gettext("Sorry, was a problem trying to update courses. Try again later"));
					}
				});
			}
	    });

	
	},
	checkForCareerUpdate: function (career)
    {
       $.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Checking for updates...')+'</p>' });
        var HOST = GlobalSettings.getServerURL();
        $.ajax({
            dataType: "json",
            url: HOST + "/api/v1/career/" + career.key + "/?format=json",
            success: function (response, opts) {
				//La carrera notiene almacenado el timestamp!!
                if (career.value.timestamp < response.timestamp) {
					Dao.updateCareer(career.key,false)
                }
				else
				{
					$.unblockUI();
					Workflow.toCareer = true;
					$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
				    $('#dialogText').html(i18n.gettext("No updates available for this course"));
                }				
            },
            error: function () {
                $.unblockUI();
				Workflow.toCareer = true;
				$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
			    $('#dialogText').html(i18n.gettext("Sorry, this course is not available now. Try again later"));
            }
        });
    },
    updateCareer: function (careerID,updateAll) {
           console.log('hola');
            var careersStore = Dao.careersStore;
            var activityStore = Dao.activitiesStore;
            Dao.careersStore.get(careerID,function(me)
			{
				career = me;
			});
            var HOST = GlobalSettings.getServerURL();
            //Career request
  			$.ajax({
            	dataType: "json",
                url: HOST + '/api/v1/career/' + careerID+'/',
                scope: this,
                success: function (response, opts) {
                    var newCareer = response;
                    //if(careersStore.findExact("id",career.id)==-1){
                    career.value.name = newCareer.name;
                    career.value.description = newCareer.description;
                    career.value.creator = newCareer.creator;
                    career.value.knowledges = newCareer.knowledges;
                    career.value.timestamp = newCareer.timestamp;
                    var activities = [];
                    for (var cont =  0; cont < newCareer.activities.length; cont++) {
                        activities[cont] = newCareer.activities[cont].full_activity_url;
                    }
                    career.value.activities = activities;
                    //activities=activities.split(",");
					var activitiesOld = [];
                    Dao.activitiesStore.each(function (record,index) {
						if(record.value.careerId == careerID)
						{
							activitiesOld.push(record);
						}			
                        //return parseInt(record.data.careerId, 10) === parseInt(careerID, 10);
                    });
                    var HOST = GlobalSettings.getServerURL();
                    var activitiesID = [];
					var actToRecieve = activities.length;
                    console.log(activities);
                    for (cont = 0; cont < activities.length; cont++) {
                       $.ajax({
            				dataType: "json",
                            scope: this,
                            url: HOST + '/' + activities[cont],
                            params: {
                                deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                                deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                            },
                            success: function (response, opts) {
                                var activity = response;
                                activitiesID.push(activity.id);
                                var activityModel;
								var activityTemp;
								Dao.activitiesStore.get(activity.id,function(me)
								{
									activityTemp = me;
								});				
                                if (activityTemp !== null) {
                                    activityModel = activityTemp;
                                    activityModel.value.name = activity.name.trim();
                                    activityModel.value.activity_type = activity.activity_type.trim();
                                    activityModel.value.language_code = activity.language_code.trim();
                                    activityModel.value.level_type = activity.level_type;
                                    activityModel.value.level_order = activity.level_order;
                                    activityModel.value.level_required = activity.level_required;
                                    activityModel.value.query = activity.query.trim();
                                    activityModel.value.timestamp = activity.timestamp;
                                    activityModel.value.resource_uri = activity.resource_uri.trim();
                                    activityModel.value.reward = activity.reward.trim();
                                    activityModel.value.penalty = activity.penalty.trim();
                                } else {
                                    activityModel = new DrGlearning.model.Activity({
                                        id : activity.id,
                                        name : activity.name.trim(),
                                        careerId : careerID,
                                        activity_type : activity.activity_type.trim(),
                                        language_code : activity.language_code.trim(),
                                        level_type : activity.level_type,
                                        level_order : activity.level_order,
                                        level_required : activity.level_required,
                                        query : activity.query.trim(),
                                        timestamp : activity.timestamp,
                                        resource_uri : activity.resource_uri.trim(),
                                        reward: activity.reward.trim(),
                                        penalty: activity.penalty.trim(),
                                        score: 0,
                                        played: false,
                                        successful: false,
                                        helpviewed: false
                                    });
                                }
                                if (activityModel.value.activity_type === 'linguistic') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.value.image_url = activity.image_url.trim();
                                    activityModel.value.locked_text = activity.locked_text.trim();
                                    activityModel.value.answer = activity.answer.trim();
                                }
                                if (activityModel.value.activity_type === 'visual') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.value.image_url = activity.image_url.trim();
                                    //activityModel.value.image=activity.image;
                                    activityModel.value.answers = activity.answers;
                                    activityModel.value.correct_answer = activity.correct_answer.trim();
                                    //activityModel.set('obfuscated_image', activity.obfuscated_image);
                                    activityModel.value.obfuscated_image_url = activity.obfuscated_image_url.trim();
                                    activityModel.value.time = activity.time;
                                }
                                if (activityModel.value.activity_type === 'quiz') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.value.image_url = activity.image_url;
                                    //activityModel.value.image=activity.image;
                                    activityModel.value.answers = activity.answers;
                                    activityModel.value.correct_answer = activity.correct_answer.trim();
                                    //activityModel.set('obfuscated_image',activity.obfuscated_image);
                                    activityModel.value.time = activity.time;
                                }
                                if (activityModel.value.activity_type === 'relational') {
                                    activityModel.value.graph_nodes = activity.graph_nodes;
                                    activityModel.value.graph_edges = activity.graph_edges;
                                    activityModel.value.constraints = activity.constraints;
                                }
                                if (activityModel.value.activity_type === 'temporal') {
                                   // activityModel.setImage('image', activity.image, this);
                                    activityModel.value.image_url = activity.image_url.trim();
                                    activityModel.value.image_datetime = activity.image_datetime.trim();
                                    activityModel.value.query_datetime = activity.query_datetime.trim();
                                }
                                if (activityModel.value.activity_type === 'geospatial') {
                                    activityModel.value.area = activity.area.trim();
                                    activityModel.value.point = activity.points.trim();
                                    activityModel.value.radius = activity.radius;
                                }
                                Dao.activitiesStore.save({key:activity.id,value:activityModel.value});
                                var exist = false;
                                for (var cont in activitiesOld.keys) {
                                    if (activitiesOld.keys[cont])
                                    {
                                        exist = false;
                                        for (var cont2 in activitiesID) {
                                            if (parseInt(activitiesOld.keys[cont], 10) === parseInt(activitiesID[cont2], 10)) {
                                                exist = true;
                                                break;
                                            }
                                        }
                                        if (!exist) {
                                            activitiesOld.getByKey(activitiesOld.keys[cont]).erase();
                                        }
                                    }
                                }
                                
                                career.value.update = false;
                                Dao.careersStore.save({key:career.key,value:career.value});
								actToRecieve--;
                         		if(actToRecieve == 0)
								{
									if(updateAll)
									{
										Dao.numberCareersToUpdate--;
										if(Dao.numberCareersToUpdate == 0)
										{
											$.unblockUI();
											Workflow.toMain = true;
											$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
											$('#dialogText').html(Dao.careersToUpdate.length + i18n.gettext(" courses updated."));
										}
									}else
									{
										Workflow.toMain = true;
										$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
										$('#dialogText').html(i18n.gettext("Course successfully updated."));
										$.unblockUI();		
									}
								}
                            }, 
                            failure: function () 
                            {
                                $.unblockUI();
								Workflow.toCareer = true;
								$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
								$('#dialogText').html(i18n.gettext("Error while checkinf for updates, try again later"));
                            }
                        });
                    }
                }
            });
    },
}

