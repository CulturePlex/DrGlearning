
Ext.define('DrGlearning.controller.DaoController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.controller.GlobalSettingsController'],
    
	init: function(){
		
	},
	
	onLaunch: function() {
		
	},
	getInstalled: function() {
		return Ext.getStore('Carrers').findExact('installed','true');
	},
    installCareer: function(id,callback,scope) {
    	Ext.Viewport.setMasked({
    	    xtype: 'loadmask',
    	    message: 'Downloading...',
 	       indicator: true
    	});
    	
    	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Downloading..."});
		myMask.show();
    	var career=Ext.getStore('Careers').getById(id);
    	var activities=career.data.activities;
    	activities=activities.split(",");
    	//console.log("activity "+activities);
    	var activitiesInstalled=0;
		for (cont in activities){
			console.log(activities[cont]);
			var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
			Ext.data.JsonP.request({
				scope: this,
                url: HOST+'/'+activities[cont]+'?format=jsonp',
                params: {
                    deviceWidth: (window.screen.width != undefined) ? window.screen.width : 200,
                    deviceHeight: (window.screen.height != undefined) ? window.screen.height : 200
                },
                success:function(response, opts){
                	var activity=response;
                	var activityModel=new DrGlearning.model.Activity({
                		id : activity.id,
                		name : activity.name,
                		careerId : id,
                		activity_type : activity.activity_type,
                		language_code : activity.language_code,
                		level_type : activity.level_type,
                		level_order : activity.level_order,
                		level_required : activity.level_required,
                		query : activity.query,
                		timestamp : activity.timestamp,
                		resource_uri : activity.resource_uri,
                		reward: activity.reward,
                		score: 0,
                		played: false,
                		successful: false
                		
                	});
                	if(activityModel.data.activity_type=='linguistic'){
                		activityModel.data.image=activity.image;
                		activityModel.data.locked_text=activity.locked_text;
                		activityModel.data.answer=activity.answer;
                	}
                	if(activityModel.data.activity_type=='visual'){
                		activityModel.data.image=Base64Manager.storeImage(activity.image, activity);
                		//activityModel.data.image=activity.image;
                		activityModel.data.answers=activity.answers;
                		activityModel.data.correct_answer=activity.correct_answer;
                		activityModel.data.obfuscated_image=activity.obfuscated_image;
                		activityModel.data.time=activity.time;
                	}
                	if(activityModel.data.activity_type=='relational'){
                		activityModel.data.graph_nodes=activity.graph_nodes;
                		activityModel.data.graph_edges=activity.graph_edges;
                    activityModel.data.constraints=activity.constraints;
                	}
                	if(activityModel.data.activity_type=='temporal'){
                		activityModel.data.image=activity.image;
                		activityModel.data.image_datetime=activity.image_datetime;
                		activityModel.data.query_datetime=activity.query_datetime;
                	}
                	if(activityModel.data.activity_type=='geospatial'){
                		activityModel.data.area=activity.area;
                		activityModel.data.point=activity.points;
                		activityModel.data.radius=activity.radius;
                	}
                	activityModel.save();
                	Ext.getStore('Activities').sync();
                	Ext.getStore('Activities').load();
					activitiesInstalled=activitiesInstalled+1;
					if(activities.length==activitiesInstalled){
						Ext.Viewport.setMasked(false);
				    	callback(scope);
		    		}
                }
            });
		}
		var career=Ext.getStore('Careers').getById(id);
    	career.set('installed','true');
    	career.save();
    	Ext.getStore('Careers').sync();
    	
    },
    
    /* 
     * Return the max level
     */
	getLevels: function(careerId){
		var levels=new Array();
		var activities=Ext.getStore('Activities').queryBy(function(record) {
			return record.data.careerId==careerId;
		});
		activities.each(function(item) {
			var exist=false;
			for(x in levels){
				if(levels[x]==item.data.level_type){
					exist=true;
				}
			}
			if(!exist){
				levels.push(item.data.level_type);
			}
			//if(levels[item.data.level_type]==undefined){
			//	levels.push(item.data.level_type);
			//}
		});
		levels.sort(function(a, b) {
			return a - b;
		});
		return levels;
	},
	/*
	 * Returns a MixedCollection 
	 */
	getActivitiesByLevel: function(careerId,level){
		var activities=Ext.getStore('Activities').queryBy(function(record) {
			return record.data.careerId==careerId && record.data.level_type==level;
		});
		return activities;
	},
	getknowledgesFields:function(){
		var knowledges=new Array();
		var career=Ext.getStore('Careers');
		console.log(career);
		career.clearFilter();
		console.log("Careers finded: "+career.getCount());
		career.each(function(item) {
			//var temp=eval('('+item.data.knowledges+')');
			console.log(item.data.knowledges);
			var carrerKnowledges=item.data.knowledges;
			for(x in carrerKnowledges){
				var exist=false;
				for(y in knowledges){
					if(carrerKnowledges[x].name==knowledges[y]){
						exist=true;
					}
				}
				if(!exist){
					knowledges.push(carrerKnowledges[x].name);
				}
			}
		},this);
		console.log("Knowledges finded: "+knowledges.length);
		console.log(knowledges);
		return knowledges;
	},
	getCarresByKnowledge:function(Knowledge){
		var carrers=Ext.getStore('Carrers').queryBy(function(record) {
			var knowledges=record.data.knowledges.split(",");
			for(x in knowledges){
				if(knowledges[x]==Knowledge){
					return true;
				}
			}
			return false;
		});
		return carrers;
	},
	activityPlayed:function(activityID,successful,score){
		var carrersStore=Ext.getStore('Carrers');
		var activitiesStore=Ext.getStore('Activities');
		var activity=activitiesStore.getById(activityID);
		if(successful){
			if(activity.data.successful){
				if(activity.data.score<parseInt(score)){
					activity.data.score=parseInt(score);
					this.updateScore(activityID,score);
				}
			}else{
				activity.data.score=parseInt(score);
			}
			activity.data.successful=true;
		}else{
			if(!activity.data.successful){
				if(activity.data.score<parseInt(score)){
					activity.data.score=parseInt(score);
				}
			}
		}
		activity.data.played=true;
		activity.save();
		activitiesStore.load();
		activitiesStore.sync();
		//Make carrer started if needed
		var carrer=Ext.getStore('Careers').getById(activity.data.careerId);
		if(!carrer.data.started){
			carrer.data.started=true;
			carrer.save();
			carrersStore.load();
			carrersStore.sync();
		}
	},
	updateScore:function(activityID,score){
		var offlineScoreStore=Ext.getStore('OfflineScores');
		var usersStore = Ext.getStore('Users');
		var user=usersStore.first();
		var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
		if(navigator.network == undefined || navigator.network.connection.type!=Connection.NONE){
			Ext.data.JsonP.request({
				scope: this,
			    url: HOST+"/api/v1/highscore/?format=jsonp",
			    params: {
			    	player_code: user.data.uniqueid,
			    	activity_id: activityID,
			    	score: score
			    },
			    success: function(response){
			    	console.log("Score successfully updated");
				}
			});
			var offlineScoreOld=offlineScoreStore.queryBy(function(record) {
				if(record.data.activity_id==activityID){
					return true;
				}
			});
			offlineScoreOld.destroy();
			offlineScoreStore.sync();
			offlineScoreStore.load();
			updateOfflineScores();
		}else{
			var offlineScore=offlineScoreStore.queryBy(function(record) {
				if(record.data.activity_id==activityID){
					return true;
				}
			});
			var offlineScoreModel=new DrGlearning.model.OfflineScore({
				activity_id : activityID,
        		score : score
        	});
			if(offlineScore.getCount()!=0){
				offlineScoreModel.set('id',offlineScore.first().data.id);
			}
			offlineScoreModel.save();
			offlineScoreStore.sync();
			offlineScoreStore.load();
		}
	},
	/*
	 * Return level id
	 */
	getCurrenLevel:function(carrerID){
		console.log('la carrera es:'+carrerID);
		var levels=this.getLevels(carrerID);
		console.log('los niveles son:'+levels);
		for(var i=0;i<=levels.length;i++){
			var activities=this.getActivitiesByLevel(carrerID,levels[i]);
			for(var j=0;j<activities.items.length;j++){
				console.log(activities.items[j]);
				if(!activities.items[j].data.successful){
					console.log('devolviendo: '+levels[i]);
					return levels[i]; 
				}
			}
		}
		console.log('el primer nivelse suponeq es:'+levels[0]);
		return levels[0];
	},
	/*
	 * Return activity id
	 * 
	 */
	getCurrenActivity:function(carrerID,level){
		var activities=this.getActivitiesByLevel(carrerID,level);
		
		for(var j=0;j<activities.items.length;j++){
			console.log(activities.items[j]);
			if(!activities.items[j].data.successful){
				return activities.items[j]; 
			}
		}
		console.log(activities.items[0].data.id);
		return activities.items[0];
	},
	updateOfflineScores:function(){
		var offlineScoreStore=Ext.getStore('OfflineScores');
		var usersStore = Ext.getStore('Users');
		var user=usersStore.first();
		var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
		offlineScoreStore.each(function(item) {
			Ext.data.JsonP.request({
				scope: this,
			    url: HOST+'/api/v1/highscore/?format=jsonp',
			    params: {
			    	player_code: user.data.uniqueid,
			    	activity_id: item.data.activityID,
			    	score: item.data.score
			    },
			    success: function(response){
			    	console.log("Score successfully updated");
			    	item.destroy();
				}
			});
		},this);
		offlineScoreStore.sync();
		offlineScoreStore.load();	
	},
	updateCarrer:function(careerID){
		if(navigator.network == undefined || navigator.network.connection.type!=Connection.NONE){
			var careersStore=Ext.getStore('Carrers');
			var activityStore=Ext.getStore('Activities');
			var career=careersStore.getById(careerID);
			var HOST = this.getAaplication().getController('GlobalSettingsController').getServerURL();
            	//Career request
    			Ext.data.JsonP.request({
                    url: HOST+'/api/v1/career/'+careerID+'/?format=jsonp',
                    scope   : this,
                    success:function(response, opts){
                    	console.log("Updating career");
                    	var newCareer=response["objects"];
                    		//if(careersStore.findExact("id",career.id)==-1){
                    	career.data.name=newCareer.name;
                    	career.data.description=newCareer.description;
                    	career.data.creator=newCareer.creator;
                    	career.data.knowledges=newCareer.knowledges;
                    	career.data.name=newCareer.name;
                    	career.data.name=newCareer.name;
                   		var activities=new Array();
                    	for(cont in newCareer.activities){
                    		activities[cont]=career.activities[cont].full_activity_url;
                    	}
                    	career.data.activities=activities;
                    	activities=activities.split(",");
                    	var HOST = this.getAplication().getController('GlobalSettingsController').getServerURL();
                    	for (cont in activities){
                    		Ext.data.JsonP.request({
                				scope: this,
                                url: HOST+'/'+activities[cont]+'?format=jsonp',
                                params: {
                                    deviceWidth: (window.screen.width != undefined) ? window.screen.width : 200,
                                    deviceHeight: (window.screen.height != undefined) ? window.screen.height : 200
                                },
                                success:function(response, opts){
                                	var activity=response;
                                	if(activityStore.getById(activity.id)!=undefined){
                                		var activityModel=activityStore.getById(activity.id);
                                		activityModel.data.name=activity.name;
                                		activityModel.data.activity_type=activity.activity_type;
                                		activityModel.data.language_code=activity.language_code;
                                		activityModel.data.level_type=activity.level_type;
                                		activityModel.data.level_order=activity.level_order;
                                		activityModel.data.level_required=activity.level_required;
                                		activityModel.data.query=activity.query;
                                		activityModel.data.timestamp=activity.timestamp;
                                		activityModel.data.resource_uri=activity.resource_uri;
                                		activityModel.data.reward=activity.reward;
                                	}else{
                                		var activityModel=new DrGlearning.model.Activity({
                                    		id : activity.id,
                                    		name : activity.name,
                                    		careerId : careerID,
                                    		activity_type : activity.activity_type,
                                    		language_code : activity.language_code,
                                    		level_type : activity.level_type,
                                    		level_order : activity.level_order,
                                    		level_required : activity.level_required,
                                    		query : activity.query,
                                    		timestamp : activity.timestamp,
                                    		resource_uri : activity.resource_uri,
                                    		reward: activity.reward,
                                    		score: 0,
                                    		played: false,
                                    		successful: false
                                    		
                                    	});
                                	}
                                    	if(activityModel.data.activity_type=='linguistic'){
                                    		activityModel.data.image=activity.image;
                                    		activityModel.data.locked_text=activity.locked_text;
                                    		activityModel.data.answer=activity.answer;
                                    	}
                                    	if(activityModel.data.activity_type=='visual'){
                                    		activityModel.data.image=Base64Manager.storeImage(activity.image, activity);
                                    		//activityModel.data.image=activity.image;
                                    		activityModel.data.answers=activity.answers;
                                    		activityModel.data.correct_answer=activity.correct_answer;
                                    		activityModel.data.obfuscated_image=activity.obfuscated_image;
                                    		activityModel.data.time=activity.time;
                                    	}
                                    	if(activityModel.data.activity_type=='relational'){
                                    		activityModel.data.graph_nodes=activity.graph_nodes;
                                    		activityModel.data.graph_edges=activity.graph_edges;
                                        activityModel.data.constraints=activity.constraints;
                                    	}
                                    	if(activityModel.data.activity_type=='temporal'){
                                    		activityModel.data.image=activity.image;
                                    		activityModel.data.image_datetime=activity.image_datetime;
                                    		activityModel.data.query_datetime=activity.query_datetime;
                                    	}
                                    	if(activityModel.data.activity_type=='geospatial'){
                                    		activityModel.data.area=activity.area;
                                    		activityModel.data.point=activity.points;
                                    		activityModel.data.radius=activity.radius;
                                    	}
                                    	activityModel.save();
                                    	Ext.getStore('Activities').sync();
                                    	Ext.getStore('Activities').load();
                                }
                            });
                    	}
                    	career.data.update=false;
                    	career.save();
                    	careersStore.sync();
                    	careersStore.load();
                    }
                });
    			
      }else{
    	  // no internet connection
      }
	},
	deleteCarrer:function(careerID){
		var careersStore=Ext.getStore('Carrers');
		var activityStore=Ext.getStore('Activities');
		var career=careersStore.getById(careerID);
		career.data.installed = false;
		career.data.started = false;
		career.data.update = false;
		var activities=activityStore.queryBy(function(record) {
			if(record.data.careerId==careerID){
				return true;
			}
		});
		activities.each(function(item) {
			item.destroy();
		});
		activityStore().sync();
		activityStore().load();
		career.save();
		careersStore.sync();
		careersStore.load();
	}
});