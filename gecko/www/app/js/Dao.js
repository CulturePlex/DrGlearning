var Dao = {
	userStore : new Lawnchair({adapter:'dom',name:'user'}, function(e) {
          console.log('User Storage Open');
    }),
    careersStore : new Lawnchair({adapter:'dom',name:'careers'}, function(e) {
          console.log('Careers Storage Open');
    }),
    installCareer: function (element,code) {
        //Dao.careersStore.get({key:element.attr("data-href"), installed:true});
        Dao.careersStore.get(element.attr("data-href"),function(r){
			Loading.getCareer(element.attr("data-href"),code);
            //r.value.installed = true;
            //Dao.careersStore.save({key:element.attr("data-href"), value: r.value});
        });
	      //DrGlearning.refreshAddCareers();
    },
    levelsStore : new Lawnchair({adapter:'dom',name:'levels'}, function(e) {
          console.log('Levels Storage Open');
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
          console.log('Activities Storage Open');
    }),
    knowledgesStore : new Lawnchair({adapter:'dom',name:'knowledges'}, function(e) {
          console.log('Knowledges Storage Open');
    }),
    knowledgesRequest: function () {
        console.log('retrieving knowledges');
        //localStorage.knowledgeFields = [];
        var HOST = GlobalSettings.getServerURL();
        jQuery.ajax({
            url: HOST + "/api/v1/knowledge/?format=json",
            dataType : 'json',
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
        console.log('Peticion de jugada!!!!!');
        console.log('id:');
        console.log(activityID);
        console.log(score);

		Dao.activitiesStore.get(activityID.toString(),function(activity){ 
			console.log('entrando');
			console.log(activity);
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
		    activity.value.score = parseInt(score, 10);
		    activity.value.played = true;
		    Dao.activitiesStore.save({key:activityID,value:activity.value});
			Dao.updateScore(activityID, score, successful, new Date().getTime());
		});
        //Make carrer started if needed
        /*var carrer = this.careersStore.getById(activity.data.careerId);
        if (!carrer.data.started) {
            carrer.data.started = true;
            carrer.save();
        }*/
	},
	uninstall: function (careerId)
	{
		Dao.careersStore.get(careerId, function (career){
			career.value.installed = false;
			Dao.careersStore.save({key:careerId,value:career.value});
		});		
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
        var HOST = GlobalSettings.getServerURL();
        $.ajax({
		    url: HOST + '/api/v1/score/?format=json',
		    data: {
		        player_code: uniqueid,
		        activity_id: activityID,
		        score: parseFloat(score),
		        is_passed: successful,
		        timestamp: timestamp / 1000,
		        token: token
		    },
			dataType: 'json',
		    success: function (response) {
				console.log('puntuacion enviada');
		    }
		});
    },
	preinstallCareer: function (career) {
        console.log('preinstalling career ');
        console.log(career);
        Dao.careerPreinstalling = career;
        var activities = career.activities;
        console.log(activities);
        var activitiesInstalled = 0;
        var cont;
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
                            score: 0,
                            played: false,
                            successful: false,
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
							console.log(career);
							Dao.careersStore.save({key:career.id,value:career});
                            DrGlearning.refreshMain();						
                            UserSettings.preinstallingIndex++;
							console.log('llamando otra vez a preinstall')
							console.log('llamando otra vez a preinstall')
                            UserSettings.preinstall();
                        }
                    },
                    failure : function () {
						$.unblockUI();
                        console.log('Unable to install, error while installing activities');
                    }
                });
            }
        }
        /*$.ajax({
            dataType:"jsonp",
            url: HOST + career.data.contents + '?format=jsonp',
            data: {
                deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
            },
            success: function (response, opts) {
                console.log(response);
                for (var uri in response)
                {
                    if (response[uri])
                    {
                        console.log(response[uri]);
                        career.set(uri, response[uri]);
                    }
                }
            },
            failure: function () {
                console.log('fallo');
            }
        });
        */
    },
}

