/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:false, bitwise:true, strict:false,
    undef:false, curly:true, browser:true, indent:4, maxerr:50, loopfunc:true, funcscope:true
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace DrGlearning
*/

Ext.define('Ext.data.Cors', {
  extend : 'Ext.data.Connection',
  alternateClassName : ['Ext.Cors'],
  singleton : true,
  config: {
  autoAbort: false,
  useDefaultXhrHeader: false
  }
  }); 

function getAsUriParameters(data) {
   var url = '';
   for (var prop in data) {
      url += encodeURIComponent(prop) + '=' + 
          encodeURIComponent(data[prop]) + '&';
   }
   return url.substring(0, url.length - 1)
}


try {
    (function () {
    // Exceptions Catcher Begins
        Ext.define('DrGlearning.controller.DaoController', {
            extend: 'Ext.app.Controller',
            careerPreinstalling: null,
            init: function () {
				this.loadingController = this.getApplication().getController('LoadingController');
                this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
                this.careersListController = this.getApplication().getController('CareersListController');
                this.careerController = this.getApplication().getController('CareerController');
                this.levelController = this.getApplication().getController('LevelController');
                this.careersStore = Ext.getStore('Careers');
            },

            getInstalled: function () {
                return this.careersStore.findExact('installed', true);
            },
			checkIfCode: function (id, callback, scope) {
				var career = this.careersStore.getById(id);
				if(career.data.has_code == true)
				{
					var okButton = Ext.create('Ext.Button', {
		                scope : this,
		                text : i18n.gettext('OK')
		            });
		            var cancelButton = Ext.create('Ext.Button', {
		                scope : this,
		                text : i18n.gettext('Cancel')
		            });
		            var show = new Ext.MessageBox().show({
		                id : 'info',
		                title : i18n.gettext('Private Course'),
		                items : [ {
		                    xtype : 'textareafield',
		                    labelAlign : 'top',
		                    label : i18n.gettext('Write the course code here') + ":",
		                    clearIcon : false,
		                    value : '',
		                    id : 'value'
		                } ],
		                buttons : [ cancelButton, okButton ],
		                icon : Ext.Msg.INFO
		            });
		            okButton.setHandler(function () {
		                show.hide();
						this.checkCode(id,callback,scope,show.down('#value').getValue());
                    });	
		            cancelButton.setHandler(function () {
		                show.hide();
		                this.destroy(show);
		            });
				}
				else
				{
					this.installCareer(id, callback, scope);
				}
			},
			checkCode: function (id, callback, scope,code) {
                var that = this;
                var HOST = this.globalSettingsController.getServerURL();
				Ext.data.JsonP.request({
                    url: HOST + "/api/v1/career/"+id+"/?format=jsonp",
                    scope   : scope,
                    params: {code: this.loadingController.SHA1(code)},
					success: function (response, opts) {
						that.installCareer(id,callback,scope,code);
					},
					failure : function () {
                        Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('Invalid code for this course'), Ext.emptyFn);
                    }
				});
			},
            installCareer: function (id, callback, scope, code,testing) {
				var parameters;
				var usersStore = Ext.getStore('Users');				
				var user = usersStore.getAt(0);
				parameters = {
                    deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                    deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200,
					player__id: user.data.serverid
                }
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Installing course') + "…",
                    indicator: true
                });
                console.log(id);
                var career = this.careersStore.getById(id);
                console.log(career);
                if (parseInt(localStorage.actualSize, 10) + parseInt(career.data.size, 10) > parseInt(localStorage.maxSize, 10)) {
                    Ext.Viewport.setMasked(false);
                    Ext.Msg.alert(i18n.gettext('Something happened'), i18n.gettext('Unable to install this course, delete some installed courses'), Ext.emptyFn);
                    return;
                }
                var activities = career.data.activities;
                
                var activitiesInstalled = 0;
                var cont;
                for (cont in activities) {
                    if (activities[cont])
                    {
                        var activitiesToInstall = [];
                        var size = 0;
                        var HOST = this.globalSettingsController.getServerURL();
                        Ext.data.JsonP.request({
                            scope: this,
                            url: HOST + activities[cont] + '?format=jsonp',
                            params: parameters,
                            success: function (response, opts) {
                                var activity = response;
                                var activityModel = new DrGlearning.model.Activity({
                                    id : activity.id,
                                    name : activity.name.trim(),
                                    careerId : id,
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
                                    score: (activity.best_score !== null) ? activity.best_score : 0,
                          			played: (activity.best_score !== null) ? true : false,
                         			successful: (activity.is_passed === true) ? true : false,
                                    helpviewed: false
                                });
                                if (activityModel.data.activity_type == 'linguistic') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.data.image_url = activity.image_url.trim();
                                    activityModel.data.locked_text = activity.locked_text.trim();
                                    activityModel.data.answer = activity.answer.trim();
                                }
                                if (activityModel.data.activity_type == 'visual') {
                                    //activityModel.setImage('image', activity.image, this);
                                    //activityModel.setImage('obImage', activity.obfuscated_image, this);
                                    activityModel.data.image_url = activity.image_url.trim();
                                    activityModel.data.obfuscated_image_url = activity.obfuscated_image_url.trim();
                                    //activityModel.data.image=activity.image;
                                    activityModel.data.answers = activity.answers;
                                    activityModel.data.correct_answer = activity.correct_answer.trim();
                                    //activityModel.set('obfuscated_image', activity.obfuscated_image);
                                    activityModel.data.obfuscated_image_url = activity.obfuscated_image_url.trim();
                                    activityModel.data.time = activity.time.trim();
                                }
                                if (activityModel.data.activity_type == 'quiz') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.data.image_url = activity.image_url;
                                    //activityModel.data.image=activity.image;
                                    activityModel.data.answers = activity.answers;
                                    activityModel.data.correct_answer = activity.correct_answer.trim();
                                    //activityModel.set('obfuscated_image',activity.obfuscated_image);
                                    if (activity.time) {
                                        activityModel.data.time = activity.time.trim();
                                    }
                                }
                                if (activityModel.data.activity_type == 'relational') {
                                    activityModel.data.graph_nodes = activity.graph_nodes;
                                    for (var x in activity.graph_edges) {
                                        if (activity.graph_edges[x].inverse === undefined) {
                                            activity.graph_edges[x].inverse = "";
                                        }
                                    }
                                    activityModel.data.graph_edges = activity.graph_edges;
                                    activityModel.data.constraints = activity.constraints;
                                    activityModel.data.path_limit = activity.path_limit;
                                }
                                if (activityModel.data.activity_type == 'temporal') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.data.image_url = activity.image_url.trim();
                                    activityModel.data.image_datetime = activity.image_datetime.trim();
                                    activityModel.data.query_datetime = activity.query_datetime.trim();
                                }
                                if (activityModel.data.activity_type == 'geospatial') {
                                    activityModel.data.area = activity.area.trim();
                                    activityModel.data.point = activity.points.trim();
                                    activityModel.data.radius = activity.radius;
                                }
                                activitiesToInstall.push(activityModel);
                                activitiesInstalled = activitiesInstalled + 1;
                                if (activities.length == activitiesInstalled) {
                                    for (var cont in activitiesToInstall) {
                                        if (activitiesToInstall[cont])
                                        {
                                            activitiesToInstall[cont].save();
                                        }
                                    }
                                    var career = this.careersStore.getById(id);
                                    var temp = true;  
                                    console.log(testing);  
                                    if(testing=="testing")
                                    {   
                                        temp = false;
                                        
                                    } 
            
                                    career.set('installed', temp);
                                    if(code != undefined)
                                    {
                                        career.set('code', code);
                                        career.set('has_code', true);
                                    }    
				                    var usersStore = Ext.getStore('Users');				
									var user = usersStore.getAt(0);

									user.data.options.careers.push(id);
									usersStore.sync();
									this.getApplication().getController('DaoController').updateUserSettings();
                                    career.save();
                                    this.careersStore.sync();
                                    this.careersStore.load();
                                    career.set('id', id);
                                    localStorage.actualSize = parseInt(localStorage.actualSize, 10) + career.data.size;
                                    Ext.getStore('Activities').sync();
                                    Ext.getStore('Activities').load();
                                    callback(scope);
                                }
                            },
                            failure : function () {
                                Ext.Viewport.setMasked(false);
                                Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('Try again later'), Ext.emptyFn);
                            }
                        });
                    }
                }
                if(career.data.contents)
                {
                    Ext.data.JsonP.request({
                        scope: this,
                        url: HOST + career.data.contents + '?format=jsonp',
                        params: {
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        },
                        success: function (response, opts) {

                            for (var uri in response)
                            {
                                if (response[uri])
                                {
                                    career.set(uri, response[uri]);
                                }
                            }
                        },
                        failure: function () {
                        }
                    });
                }
            },
            
            preinstallCareer: function (career) {
                this.careerPreinstalling = career;
                if (parseInt(localStorage.actualSize, 10) + parseInt(career.data.size, 10) > parseInt(localStorage.maxSize, 10)) {
                    Ext.Msg.alert(i18n.gettext('Something happened'), i18n.gettext('Unable to install this course, delete some installed courses'), Ext.emptyFn);
                    return;
                }
                var activities = career.data.activities;
                
                var activitiesInstalled = 0;
                var cont;
				var usersStore = Ext.getStore('Users');				
				var user = usersStore.getAt(0);
                for (cont in activities) {
                    if (activities[cont])
                    {
                        var activitiesToInstall = [];
                        var size = 0;
                        var HOST = this.globalSettingsController.getServerURL();
                        Ext.data.JsonP.request({
                            scope: this,
                            url: HOST + activities[cont] + '?format=jsonp',
                            params: {
                                deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                                deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200,
								player__id: user.data.serverid
                            },
                            success: function (response, opts) {  
                                var activity = response;
                                var career = this.getApplication().getController('DaoController').careerPreinstalling;
                                var activityModel = new DrGlearning.model.Activity({
                                    id : activity.id,
                                    name : activity.name.trim(),
                                    careerId : career.data.id,
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
                                    helpviewed: false,
									best_score: activity.best_score,
									is_passed: activity.is_passed,
                                });
                                if (activityModel.data.activity_type == 'linguistic') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.data.image_url = activity.image_url.trim();
                                    activityModel.data.locked_text = activity.locked_text.trim();
                                    activityModel.data.answer = activity.answer.trim();
                                }
                                if (activityModel.data.activity_type == 'visual') {
                                    //activityModel.setImage('image', activity.image, this);
                                    //activityModel.setImage('obImage', activity.obfuscated_image, this);
                                    activityModel.data.image_url = activity.image_url.trim();
                                    activityModel.data.obfuscated_image_url = activity.obfuscated_image_url.trim();
                                    //activityModel.data.image=activity.image;
                                    activityModel.data.answers = activity.answers;
                                    activityModel.data.correct_answer = activity.correct_answer.trim();
                                    //activityModel.set('obfuscated_image', activity.obfuscated_image);
                                    activityModel.data.obfuscated_image_url = activity.obfuscated_image_url.trim();
                                    activityModel.data.time = activity.time.trim();
                                }
                                if (activityModel.data.activity_type == 'quiz') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.data.image_url = activity.image_url;
                                    //activityModel.data.image=activity.image;
                                    activityModel.data.answers = activity.answers;
                                    activityModel.data.correct_answer = activity.correct_answer.trim();
                                    //activityModel.set('obfuscated_image',activity.obfuscated_image);
                                    if (activity.time) {
                                        activityModel.data.time = activity.time.trim();
                                    }
                                }
                                if (activityModel.data.activity_type == 'relational') {
                                    activityModel.data.graph_nodes = activity.graph_nodes;
                                    for (var x in activity.graph_edges) {
                                        if (activity.graph_edges[x].inverse === undefined) {
                                            activity.graph_edges[x].inverse = "";
                                        }
                                    }
                                    activityModel.data.graph_edges = activity.graph_edges;
                                    activityModel.data.constraints = activity.constraints;
                                    activityModel.data.path_limit = activity.path_limit;
                                }
                                if (activityModel.data.activity_type == 'temporal') {
                                    //activityModel.setImage('image', activity.image, this);
                                    activityModel.data.image_url = activity.image_url.trim();
                                    activityModel.data.image_datetime = activity.image_datetime.trim();
                                    activityModel.data.query_datetime = activity.query_datetime.trim();
                                }
                                if (activityModel.data.activity_type == 'geospatial') {
                                    activityModel.data.area = activity.area.trim();
                                    activityModel.data.point = activity.points.trim();
                                    activityModel.data.radius = activity.radius;
                                }
                                activitiesToInstall.push(activityModel);
                                activitiesInstalled = activitiesInstalled + 1;
                                if (activities.length == activitiesInstalled) {
                                    for (var cont in activitiesToInstall) {
                                        if (activitiesToInstall[cont])
                                        {
                                            activitiesToInstall[cont].save();
											//this.getApplication().getController('DaoController').activityPlayed(activitiesToInstall[cont].data.id, activitiesToInstall[cont].data.is_passed, activitiesToInstall[cont].best_score, true);
                                        }
                                    }
                                    career.set('installed', true);
                                    career.save();
                                    this.careersStore.sync();
                                    this.careersStore.load();
                                    localStorage.actualSize = parseInt(localStorage.actualSize, 10) + career.data.size;
                                    Ext.getStore('Activities').sync();
                                    Ext.getStore('Activities').load();
                                    this.getApplication().getController('UserSettingsController').preinstallingIndex++;
                                    this.getApplication().getController('UserSettingsController').preinstall();
                                }
                            },
                            failure : function () {
                                Ext.Viewport.setMasked(false);
                                Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('Try again later'), Ext.emptyFn);
                            }
                        });
                    }
                }
                Ext.data.JsonP.request({
                    scope: this,
                    url: HOST + career.data.contents + '?format=jsonp',
                    params: {
                        deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                        deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                    },
                    success: function (response, opts) {
                        for (var uri in response)
                        {
                            if (response[uri])
                            {
                                career.set(uri, response[uri]);
                            }
                        }
                    },
                    failure: function () {
                    }
                });
                
            },
            
            /* 
             * Return the max level
             */
            getLevels: function (careerId) {
                var levels = [];
                var activities = Ext.getStore('Activities').queryBy(function (record) {
                    return parseInt(record.data.careerId, 10) === parseInt(careerId, 10);
                });
                activities.each(function (item) {
                    var exist = false;
                    for (var x = 0; x < levels.length ; x++) {
                        if (levels[x] === item.data.level_type) {
                            exist = true;
                        }
                    }
                    if (!exist) {
                        levels.push(item.data.level_type);
                    }
                    //if(levels[item.data.level_type]==undefined){
                    //    levels.push(item.data.level_type);
                    //}
                });
                levels.sort(function (a, b) {
                    return a - b;
                });
                return levels;
            },
            /*
             * Returns a MixedCollection 
             */
            getActivitiesByLevel: function (careerId, level) {
                var activities = Ext.getStore('Activities').queryBy(function (record) {
                    if (parseInt(record.data.careerId, 10) === parseInt(careerId, 10) && record.data.level_type === level) {
                        return true;
                    } else {
                        return false;
                    }
                });
                return activities;
            },
            getknowledgesFields: function () {
                var knowledges = [];
                var career = this.careersStore;
                career.clearFilter();
                career.each(function (item) {
                    var carrerKnowledges = item.data.knowledges;
                    for (var x = 0; x < carrerKnowledges.length; x++) {
                        var exist = false;
                        for (var y = 0; y < knowledges.ength ; y++) {
                            if (carrerKnowledges[x].name === knowledges[y]) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            knowledges.push(carrerKnowledges[x].name);
                        }
                    }
                }, this);
                return knowledges;
            },
            getCarresByKnowledge: function (Knowledge) {
                var carrers = this.careersStore.queryBy(function (record) {
                    var knowledges = record.data.knowledges;
                    for (var x = 0; x < knowledges.length ; x++) {
                        if (knowledges[x] === Knowledge) {
                            return true;
                        }
                    }
                    return false;
                });
                return carrers;
            },
            activityPlayed: function (activityID, successful, score, importing) {
                if(!importing)
                {
                  this.updateScore(activityID, score, successful, new Date().getTime());
                }
            },
            updateScore: function (activityID, score, successful, timestamp) {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Sending scores') + "…",
                    indicator: true,
                    html: "<img src='resources/images/ic_launcher.png'>"
                });
                var usersStore = Ext.getStore('Users');
                this.updateUserSettings();
                var user = usersStore.getAt(0);
                var HOST = this.globalSettingsController.getServerURL();
                var loadingController = this.loadingController;
                var flag;
                var that = this;
                var activitiesStore = Ext.getStore('Activities');
                var careersStore = Ext.getStore('Careers');
                var activity;
                var career;
                activitiesStore.each(function(rec){
                      if(rec.get('id') == activityID)
                      {
                        activity = rec;
                        return;
                      }
                });
                careersStore.each(function(rec){
                      if(rec.get('id') == activity.data.careerId)
                      {
                        career = rec;
                        return;
                      }
                    });
                var hashcode = 0;
                if(career.data.code!=null)
                {
                    var hashcode = loadingController.SHA1(career.data.code);
                }
                params= {
                    player_code: user.data.uniqueid,
                    activity_id: activityID,
                    score: parseFloat(score),
                    is_passed: successful,
                    timestamp: timestamp / 1000,
                    token: user.data.token,
                    career_code: hashcode,
                    callback:"a"
                };
                var encoded = getAsUriParameters(params);
                console.log(encoded);
                var that = this;    
                Ext.Cors.request({
                        url: HOST + '/api/v1/score/?format=jsonp&'+encoded,               
                        success: function (response,a) {
                            Ext.Viewport.setMasked(false);
                            var activitiesStore = Ext.getStore('Activities');
                            var activity;
                            activitiesStore.load();
                            activitiesStore.sync();
                            activitiesStore.each(function(rec){
                              if(rec.get('id') == activityID)
                              {
                                activity = rec;
                                return;
                              }
                            });
				            if(!activity)
				            {
                              activity = activitiesStore.getAt(activitiesStore.findExact('id', activityID));
				            }
                            if (successful) {
                                if (activity.data.successful) {
                                    if (activity.data.score < parseInt(score, 10)) {
                                        activity.data.score = parseInt(score, 10);
                                    }
                                } else {
                                    activity.data.score = parseInt(score, 10);
                                }
                                activity.data.successful = true;
                            } else {
                                if (!activity.data.successful) {
                                    if (activity.data.score < parseInt(score, 10)) {
                                        activity.data.score = parseInt(score, 10);
                                    }
                                }
                            }
                            activity.data.played = true;
                            activity.save();
                            if(successful)
                            {
                                that.getApplication().getController('LevelController').nextActivity(activity.data.level_type);
                            }else{                            
                                that.getApplication().getController('LevelController').tolevel();
                            }                            
                            //Make carrer started if needed
                            //var carrer = this.careersStore.getById(activity.data.careerId);
                            /*if (!carrer.data.started) {
                                carrer.data.started = true;
                                carrer.save();
                            }*/                                     
                        },                            
						failure: function (resp,a){
                            Ext.Viewport.setMasked(false);
							var responseText = JSON.parse(resp.responseText);
                            that.getApplication().getController('LevelController').tolevel();
				            if(parseInt(responseText.status_code,10)==409)
				            {
                               Ext.Msg.alert(i18n.gettext('Unable to send scores'), i18n.gettext('This course is not currently available. Your scores have not been sent.'), Ext.emptyFn);
				            };
				            if(parseInt(responseText.status_code,10)==403)
				            {
                                Ext.Msg.alert(i18n.gettext('Unable to send scores'), i18n.gettext("This course is now private. You can't send your scores without enter the course code."), 
                                function() {
                                    var okButton = Ext.create('Ext.Button', {
		                                scope : this,
		                                text : i18n.gettext('OK')
		                            });
		                            var cancelButton = Ext.create('Ext.Button', {
		                                scope : this,
		                                text : i18n.gettext('Cancel')
		                            });
		                            var show = new Ext.MessageBox().show({
		                                id : 'info',
		                                title : i18n.gettext('Private Course'),
		                                items : [ {
		                                    xtype : 'textareafield',
		                                    labelAlign : 'top',
		                                    label : i18n.gettext('Write the course code here') + ":",
		                                    clearIcon : false,
		                                    value : '',
		                                    id : 'value'
		                                } ],
		                                buttons : [ cancelButton, okButton ],
		                                icon : Ext.Msg.INFO
		                            });
		                            okButton.setHandler(function () {
		                                show.hide();
						                that.checkCode(activity.data.careerId,function(){Ext.Viewport.setMasked(false); that.updateScore(activityID, score, successful, timestamp) },this,show.down('#value').getValue());
                                    });	
		                            cancelButton.setHandler(function () {
		                                show.hide();
		                                this.destroy(show);
		                            });
                                });
                            }
                        
                        }
                });
                /*var offlineScoreStore = Ext.getStore('OfflineScores');
                var offlineScoreModel = new DrGlearning.model.OfflineScore({
                    activity_id : activityID,
                    score : score,
                    is_passed: successful,
                    timestamp: timestamp
                });
                offlineScoreModel.save();
                offlineScoreStore.sync();
                offlineScoreStore.load();*/
            },
            /*
             * Return level id
             */
            getCurrenLevel: function (carrerID) {
                var levels = this.getLevels(carrerID);
                for (var i = 0; i <= levels.length; i++) {
                    var activities = this.getActivitiesByLevel(carrerID, levels[i]);
                    for (var j = 0; j < activities.items.length; j++) {
                        if (!activities.items[j].data.successful) {
                            return levels[i]; 
                        }
                    }
                }
                return -1;
            },
            /*
             * Return activity id
             * 
             */
            getCurrenActivity: function (carrerID, level) {
                var activities = this.getActivitiesByLevel(carrerID, level);
				function sortfunction(a, b){
					var temp = 0;
					if(a.data.level_order > b.data.level_order)
					{
						temp = 1;
					}
					if(a.data.level_order < b.data.level_order)
					{
						temp = -1;
					}
					return temp;
				}
				activities.items.sort(sortfunction)
                for (var j = 0; j < activities.items.length; j++) {
                    if (!activities.items[j].data.successful) {
                        return activities.items[j]; 
                    }
                }
                return activities.items[0];
            },
            updateOfflineScores: function () {
                var usersStore = Ext.getStore('Users');
                this.updateUserSettings();
                /*var user = usersStore.getAt(0);
                var offlineScoreStore = Ext.getStore('OfflineScores');
                var HOST = this.globalSettingsController.getServerURL();
                var loadingController = this.loadingController;
                var flag;
                var that = this;
                var activitiesStore = Ext.getStore('Activities');
                var careersStore = Ext.getStore('Careers');
                var activity;
                var career;
                offlineScoreStore.each(function (item) {
                    activitiesStore.each(function(rec){
                      if(rec.get('id') == item.data.activity_id)
                      {
                        activity = rec;
                        return;
                      }
                    });
                    careersStore.each(function(rec){
                      if(rec.get('id') == activity.data.careerId)
                      {
                        career = rec;
                        return;
                      }
                    });
                    var hashcode = 0;
                   if(career.data.code!=null)
                   {
                        var hashcode = loadingController.SHA1(career.data.code);
                   }
                   params= {
                        player_code: user.data.uniqueid,
                        activity_id: item.data.activity_id,
                        score: parseFloat(item.data.score),
                        is_passed: item.data.is_passed,
                        timestamp: item.data.timestamp / 1000,
                        token: user.data.token,
                        career_code: hashcode,
                        callback:"a"
                   };
                   var encoded = getAsUriParameters(params);
                   console.log(encoded);    
                   Ext.Cors.request({
                        url: HOST + '/api/v1/score/?format=jsonp&'+encoded,               
                        success: function (response,a) {
                            offlineScoreStore.remove(item);
                        },                            
						failure: function (resp,a){
                            console.log(a);
                            console.log(resp);
							var responseText = JSON.parse(resp.responseText);
				            if(parseInt(responseText.status_code,10)==409)
				            {
                               Ext.Msg.alert(i18n.gettext('Unable to send scores'), i18n.gettext('This course is not currently available. Your scores have not been sent.'), Ext.emptyFn);
				            };
				            if(parseInt(responseText.status_code,10)==403)
				            {
                                Ext.Msg.alert(i18n.gettext('Unable to send scores'), i18n.gettext("This course is now private. You can't send your scores without enter the course code."), 
                                function() {
                                    var okButton = Ext.create('Ext.Button', {
		                                scope : this,
		                                text : i18n.gettext('OK')
		                            });
		                            var cancelButton = Ext.create('Ext.Button', {
		                                scope : this,
		                                text : i18n.gettext('Cancel')
		                            });
		                            var show = new Ext.MessageBox().show({
		                                id : 'info',
		                                title : i18n.gettext('Private Course'),
		                                items : [ {
		                                    xtype : 'textareafield',
		                                    labelAlign : 'top',
		                                    label : i18n.gettext('Write the course code here') + ":",
		                                    clearIcon : false,
		                                    value : '',
		                                    id : 'value'
		                                } ],
		                                buttons : [ cancelButton, okButton ],
		                                icon : Ext.Msg.INFO
		                            });
		                            okButton.setHandler(function () {
		                                show.hide();
						                that.checkCode(activity.data.careerId,function(){Ext.Viewport.setMasked(false);},this,show.down('#value').getValue());
                                    });	
		                            cancelButton.setHandler(function () {
		                                show.hide();
		                                this.destroy(show);
		                            });
                                });
                            }
                        },
                    });
                 });*/
            },
            updateUserSettings: function () {
                var usersStore = Ext.getStore('Users');
                var user = usersStore.getAt(0);
                var HOST = this.globalSettingsController.getServerURL();
                Ext.data.JsonP.request({
                    scope: this,
                    url: HOST + '/api/v1/player/?format=jsonp',
                    params: {
                        code: user.data.uniqueid,
                        token: user.data.token,
                        email: user.data.email,
                        display_name: user.data.display_name,
						options: JSON.stringify(user.data.options)
                    },
                    success: function (response) {
                    }
                });
                
            },
            //Tell us if a level is approved or not
            isApproved: function (careerID, level)
            {
                var approved = true;
                var activities = this.getActivitiesByLevel(careerID, level.customId);
                for (var j = 0; j < activities.items.length; j++) {
                    if (!activities.items[j].data.successful) {
                        approved = false; 
                    }
                }
                return approved;
            },
            checkForCareerUpdate: function (career)
            {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Checking for updates') + "…",
                    indicator: true
                });
                var HOST = this.globalSettingsController.getServerURL();
                Ext.data.JsonP.request({
                    url: HOST + "/api/v1/career/" + career.data.id + "/?format=jsonp",
                    scope: this,
                    success: function (response, opts) {
                        if (career.data.timestamp < response.timestamp) {
                            career.data.update = true;
                            career.data.timestamp = response.timestamp;
                            career.save();
                            this.careersStore.load();
                        }
                        this.careersListController.index();
                        Ext.Viewport.setMasked(false);
                        this.retrieving = false;
                    },
                    failure: function () {
                        Ext.Viewport.setMasked(false);
 						Ext.Msg.alert(i18n.gettext('Course not available'), i18n.gettext('Sorry this course is not available now. Try again later'), Ext.emptyFn);                    
}
                });
            },
            updateCareer: function (careerID, callback, scope) {
                if (this.globalSettingsController.hasNetwork()) {
                    var careersStore = this.careersStore;
                    var activityStore = Ext.getStore('Activities');
                    var career = careersStore.getById(careerID);
                    var HOST = this.globalSettingsController.getServerURL();
                    //Career request
                    Ext.data.JsonP.request({
                        url: HOST + '/api/v1/career/' + careerID + '/?format=jsonp',
                        scope: this,
                        success: function (response, opts) {
                            var newCareer = response;
                                //if(careersStore.findExact("id",career.id)==-1){
                            career.data.name = newCareer.name;
                            career.data.description = newCareer.description;
                            career.data.creator = newCareer.creator;
                            career.data.knowledges = newCareer.knowledges;
                            career.data.timestamp = newCareer.timestamp;
                            var activities = [];
                            for (var cont =  0; cont < newCareer.activities.length; cont++) {
                                activities[cont] = newCareer.activities[cont].full_activity_url;
                            }
                            career.data.activities = activities;
                            //activities=activities.split(",");
                            var activitiesOld = activityStore.queryBy(function (record) {
                                return parseInt(record.data.careerId, 10) === parseInt(careerID, 10);
                            });
                            var HOST = this.globalSettingsController.getServerURL();
                            var activitiesID = [];
							var actToRecieve = activities.length;
                            for (cont = 0; cont < activities.length; cont++) {
                                Ext.data.JsonP.request({
                                    scope: this,
                                    url: HOST + '/' + activities[cont] + '?format=jsonp',
                                    params: {
                                        deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                                        deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                                    },
                                    success: function (response, opts) {
                                        var activity = response;
                                        activitiesID.push(activity.id);
                                        var activityModel;
                                        if (activityStore.getById(activity.id) !== null) {
                                            activityModel = activityStore.getById(activity.id);
                                            activityModel.data.name = activity.name.trim();
                                            activityModel.data.activity_type = activity.activity_type.trim();
                                            activityModel.data.language_code = activity.language_code.trim();
                                            activityModel.data.level_type = activity.level_type;
                                            activityModel.data.level_order = activity.level_order;
                                            activityModel.data.level_required = activity.level_required;
                                            activityModel.data.query = activity.query.trim();
                                            activityModel.data.timestamp = activity.timestamp;
                                            activityModel.data.resource_uri = activity.resource_uri.trim();
                                            activityModel.data.reward = activity.reward.trim();
                                            activityModel.data.penalty = activity.penalty.trim();
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
                                        if (activityModel.data.activity_type === 'linguistic') {
                                            activityModel.setImage('image', activity.image, this);
                                            activityModel.data.image_url = activity.image_url.trim();
                                            activityModel.data.locked_text = activity.locked_text.trim();
                                            activityModel.data.answer = activity.answer.trim();
                                        }
                                        if (activityModel.data.activity_type === 'visual') {
                                            activityModel.setImage('image', activity.image, this);
                                            activityModel.data.image_url = activity.image_url.trim();
                                            //activityModel.data.image=activity.image;
                                            activityModel.data.answers = activity.answers;
                                            activityModel.data.correct_answer = activity.correct_answer.trim();
                                            activityModel.set('obfuscated_image', activity.obfuscated_image);
                                            activityModel.data.obfuscated_image_url = activity.obfuscated_image_url.trim();
                                            activityModel.data.time = activity.time;
                                        }
                                        if (activityModel.data.activity_type === 'quiz') {
                                            activityModel.setImage('image', activity.image, this);
                                            activityModel.data.image_url = activity.image_url;
                                            //activityModel.data.image=activity.image;
                                            activityModel.data.answers = activity.answers;
                                            activityModel.data.correct_answer = activity.correct_answer.trim();
                                            //activityModel.set('obfuscated_image',activity.obfuscated_image);
                                            activityModel.data.time = activity.time;
                                        }
                                        if (activityModel.data.activity_type === 'relational') {
                                            activityModel.data.graph_nodes = activity.graph_nodes;
                                            activityModel.data.graph_edges = activity.graph_edges;
                                            activityModel.data.constraints = activity.constraints;
                                        }
                                        if (activityModel.data.activity_type === 'temporal') {
                                            activityModel.setImage('image', activity.image, this);
                                            activityModel.data.image_url = activity.image_url.trim();
                                            activityModel.data.image_datetime = activity.image_datetime.trim();
                                            activityModel.data.query_datetime = activity.query_datetime.trim();
                                        }
                                        if (activityModel.data.activity_type === 'geospatial') {
                                            activityModel.data.area = activity.area.trim();
                                            activityModel.data.point = activity.points.trim();
                                            activityModel.data.radius = activity.radius;
                                        }
                                        activityModel.save();
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
                                        
                                        career.data.update = false;
                                        career.save();
                                        this.careersStore.sync();
                                        this.careersStore.load();
                                        Ext.getStore('Activities').sync();
                                        Ext.getStore('Activities').load();
										actToRecieve--;
										if(actToRecieve == 0)
										{
											
                                        	callback(scope);
										}
                                    }, 
                                    failure: function () 
                                    {
                                        //Ext.Viewport.setMasked(false);
                                        Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('Try again later'), Ext.emptyFn);
										callback(scope);
                                    }
                                });
                            }
                        }
                    });
                } 
                else 
                {
                    //Ext.Viewport.setMasked(false);
                    Ext.Msg.alert(i18n.gettext('Something happened'), i18n.gettext('Unable to update this course. Try again later'), Ext.emptyFn);
					callback(scope);
                    return;
                }
            },
			updateCareer2: function (careerID, callback, scope) {
                if (this.globalSettingsController.hasNetwork()) {
					var careersStore = this.careersStore;
                    var activityStore = Ext.getStore('Activities');
                    var career = careersStore.getById(careerID);
					career.data.update = false;
                    career.save();
                    var HOST = this.globalSettingsController.getServerURL();
					var response = {};
					response.options = {};
					response.options.careers = [careerID];
					this.getApplication().getController('UserSettingsController').updating=true;
					this.deleteCareer(careerID,true,response);
                    //this.getApplication().getController('UserSettingsController').preinstall();
					
                } 
                else 
                {
                    //Ext.Viewport.setMasked(false);
                    Ext.Msg.alert(i18n.gettext('Something happened'), i18n.gettext('Unable to update this course. Try again later'), Ext.emptyFn);
					callback(scope);
                    return;
                }
            },
            deleteCareer: function (careerID,updating,response) {
				var usersStore = Ext.getStore('Users');
				var user = usersStore.getAt(0);
//				user.data.options.careers.pop(careerID);				
				var idx = user.data.options.careers.indexOf(careerID); // Find the index
				if(idx!=-1) user.data.options.careers.splice(idx, 1);
				usersStore.sync();
                var careersStore = this.careersStore;
                var activityStore = Ext.getStore('Activities');
				var offlineScoreStore = Ext.getStore('OfflineScores');
                var career = careersStore.getById(careerID);
                career.data.installed = false;
                career.data.started = false;
                career.data.update = false;
                var activities = activityStore.queryBy(function (record) {
                    if (parseInt(record.data.careerId, 10) == parseInt(careerID, 10)) {
                        return true;
                    }
                });
                activities.each(function (item) {
                	
               		var scores = offlineScoreStore.queryBy(function (record) {
		                if (parseInt(record.data.activity_id, 10) == parseInt(item.data.id, 10)) {
		                    return true;
		                }
		            });
					scores.each(function (item2) {
						item2.erase();
					});
                    item.erase();
                });
                activityStore.sync();
                offlineScoreStore.sync();
                career.save();
                careersStore.sync();
                careersStore.load();
				this.updateUserSettings();
				if(updating)
				{
					this.getApplication().getController('UserSettingsController').collectCareers(response);
				}
            }
        });
    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
