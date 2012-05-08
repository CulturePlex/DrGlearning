Ext.define('DrGlearning.controller.DaoController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.controller.GlobalSettingsController'],
    
	init: function(){
		
	},
	
	onLaunch: function() {
		
	},
	getInstalled: function() {
		return Ext.getStore('Carrers').findExact('installed',true);
	},
    installCareer: function(id,callback,scope) {
    	var career=Ext.getStore('Careers').getById(id);
    	if(parseInt(localStorage.actualSize)+parseInt(career.data.size)>parseInt(localStorage.maxSize)){
    		Ext.Viewport.setMasked(false);
			Ext.Msg.alert(i18n.gettext('Problem finded'), i18n.gettext('Unable to install this carrer, delete some installed careers.'), Ext.emptyFn);
			return;
		}
    	var activities=career.data.activities;
    	
		
    	var activitiesInstalled=0;
		for (cont in activities){
			var activitiesToInstall=new Array();
			var size=0;
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
                		name : activity.name.trim(),
                		careerId : id,
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
                		
                	});
                	if(activityModel.data.activity_type=='linguistic'){
                		activityModel.setImage('image',activity.image,this);
                		activityModel.data.image_url=activity.image_url.trim();
                		activityModel.data.locked_text=activity.locked_text.trim();
                		activityModel.data.answer=activity.answer.trim();
                	}
                	if(activityModel.data.activity_type=='visual'){
                		activityModel.setImage('image',activity.image,this);
                		activityModel.data.image_url=activity.image_url.trim();
                		//activityModel.data.image=activity.image;
                		activityModel.data.answers=activity.answers;
                		activityModel.data.correct_answer=activity.correct_answer.trim();
                		activityModel.set('obfuscated_image',activity.obfuscated_image);
                		activityModel.data.obfuscated_image_url=activity.obfuscated_image_url.trim();
                		activityModel.data.time=activity.time.trim();
                	}
					if(activityModel.data.activity_type=='quiz'){
						activityModel.setImage('image',activity.image,this);
                		activityModel.data.image_url=activity.image_url;
                		//activityModel.data.image=activity.image;
                		activityModel.data.answers=activity.answers;
                		activityModel.data.correct_answer=activity.correct_answer.trim();
                		//activityModel.set('obfuscated_image',activity.obfuscated_image);
                		if (activity.time) {
                		    activityModel.data.time=activity.time.trim();
                		}
                	}
                	if(activityModel.data.activity_type=='relational'){
						console.log(activity);
                		activityModel.data.graph_nodes=activity.graph_nodes;
                		activityModel.data.graph_edges=activity.graph_edges;
                		activityModel.data.constraints=activity.constraints;
						activityModel.data.path_limit=activity.path_limit;
                	}
                	if(activityModel.data.activity_type=='temporal'){
                		activityModel.setImage('image',activity.image,this);
                		activityModel.data.image_url=activity.image_url.trim();
                		activityModel.data.image_datetime=activity.image_datetime.trim();
                		activityModel.data.query_datetime=activity.query_datetime.trim();
                	}
                	if(activityModel.data.activity_type=='geospatial'){
                		activityModel.data.area=activity.area.trim();
                		activityModel.data.point=activity.points.trim();
                		activityModel.data.radius=activity.radius;
                	}
                	activitiesToInstall.push(activityModel);
                	activitiesInstalled=activitiesInstalled+1;
					if(activities.length==activitiesInstalled){
						for(cont in activitiesToInstall){
                			activitiesToInstall[cont].save();
                		}
                		var career=Ext.getStore('Careers').getById(id);
                	    career.set('installed',true);
                	    career.save();
                	    localStorage.actualSize=parseInt(localStorage.actualSize)+career.data.size;
                		Ext.getStore('Activities').sync();
                		Ext.getStore('Activities').load();
                		Ext.Viewport.setMasked(false);
						callback(scope);
		    		}
                },failure:function(){
                	Ext.Viewport.setMasked(false);
                	Ext.Msg.alert('Unable to install', 'Try again later.', Ext.emptyFn);
                }
            });
		}
    	
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
		console.log("ORDEN");
		console.log(level);
		console.log(careerId);
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
			//console.log(item.data.knowledges);
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
			var knowledges=record.data.knowledges;
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
		//console.log('Peticion de jugada!!!!!');
		var carrersStore=Ext.getStore('Careers');
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
		//Make carrer started if needed
		var carrer=Ext.getStore('Careers').getById(activity.data.careerId);
		//console.log('Necesita actualizar la carrera?');
		//console.log(carrer.data.started);
		if(!carrer.data.started){
			console.log('Marcando como empezada!! '+activity.data.careerId);
			carrer.data.started=true;
			carrer.save();
		}
	},
	updateScore:function(activityID,score){
		var offlineScoreStore=Ext.getStore('OfflineScores');
		var usersStore = Ext.getStore('Users');
		var user=usersStore.getAt(0);
		var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
		if(this.getApplication().getController('GlobalSettingsController').hasNetwork()){
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
					record.erase();
				}
			});
			this.updateOfflineScores();
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
		return -1;
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
		var user=usersStore.getAt(0);
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
			    	item.erase();
				}
			});
		},this);	
	},
	//Tell us if a level is approved or not
	isApproved:function(careerID,level)
	{
		console.log(careerID);
		console.log(level);
		var approved=true;
		var activities=this.getActivitiesByLevel(careerID,level.customId);
		console.log(activities);
		for(var j=0;j<activities.items.length;j++){
			
			console.log(activities.items[j]);
			if(!activities.items[j].data.successful){
				approved=false; 
			}
		}
		return approved;
	},
	updateCareer:function(careerID,callback,scope){
		console.log("Updating career "+careerID);
		if(this.getApplication().getController('GlobalSettingsController').hasNetwork()){
			var careersStore=Ext.getStore('Careers');
			var activityStore=Ext.getStore('Activities');
			var career=careersStore.getById(careerID);
			var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
            	//Career request
    			Ext.data.JsonP.request({
                    url: HOST+'/api/v1/career/'+careerID+'/?format=jsonp',
                    scope   : this,
                    success:function(response, opts){
                    	console.log("Updating career");
                    	var newCareer=response;
                    		//if(careersStore.findExact("id",career.id)==-1){
                    	career.data.name=newCareer.name;
                    	career.data.description=newCareer.description;
                    	career.data.creator=newCareer.creator;
                    	career.data.knowledges=newCareer.knowledges;
                    	career.data.timestamp=newCareer.timestamp;
                   		var activities=new Array();
                   		for(cont in newCareer.activities){
                    		activities[cont]=newCareer.activities[cont].full_activity_url;
                    	}
                    	career.data.activities=activities;
                    	//activities=activities.split(",");
                		var activitiesOld=activityStore.queryBy(function(record) {
                			return record.data.careerId==careerID;
                		});
                		var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
                    	var activitiesID=new Array();
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
                                	activitiesID.push(activity.id);
                                	if(activityStore.getById(activity.id)!=undefined){
                                		var activityModel=activityStore.getById(activity.id);
                                		activityModel.data.name=activity.name.trim();
                                		activityModel.data.activity_type=activity.activity_type.trim();
                                		activityModel.data.language_code=activity.language_code.trim();
                                		activityModel.data.level_type=activity.level_type;
                                		activityModel.data.level_order=activity.level_order;
                                		activityModel.data.level_required=activity.level_required;
                                		activityModel.data.query=activity.query.trim();
                                		activityModel.data.timestamp=activity.timestamp.trim();
                                		activityModel.data.resource_uri=activity.resource_uri.trim();
                                		activityModel.data.reward=activity.reward.trim();
                                		activityModel.data.penalty=activity.penalty.trim();
                                	}else{
                                		var activityModel=new DrGlearning.model.Activity({
                                    		id : activity.id,
                                    		name : activity.name.trim(),
                                    		careerId : careerID,
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
                                    	});
                                	}
                                    	if(activityModel.data.activity_type=='linguistic'){
                                    		activityModel.setImage('image',activity.image,this);
                                    		activityModel.data.image_url=activity.image_url.trim();
                                    		activityModel.data.locked_text=activity.locked_text.trim();
                                    		activityModel.data.answer=activity.answer.trim();
                                    	}
                                    	if(activityModel.data.activity_type=='visual'){
                                    		activityModel.setImage('image',activity.image,this);
                                    		activityModel.data.image_url=activity.image_url.trim();
                                    		//activityModel.data.image=activity.image;
                                    		activityModel.data.answers=activity.answers;
                                    		activityModel.data.correct_answer=activity.correct_answer.trim();
                                    		activityModel.set('obfuscated_image',activity.obfuscated_image);
                                    		activityModel.data.obfuscated_image_url=activity.obfuscated_image_url.trim();
                                    		activityModel.data.time=activity.time.trim();
                                    	}
										if(activityModel.data.activity_type=='quiz'){
											activityModel.setImage('image',activity.image,this);
					                		activityModel.data.image_url=activity.image_url;
					                		//activityModel.data.image=activity.image;
					                		activityModel.data.answers=activity.answers;
					                		activityModel.data.correct_answer=activity.correct_answer.trim();
					                		//activityModel.set('obfuscated_image',activity.obfuscated_image);
					                		activityModel.data.time=activity.time.trim();
                                    	}
                                    	if(activityModel.data.activity_type=='relational'){
                                    		activityModel.data.graph_nodes=activity.graph_nodes;
                                    		activityModel.data.graph_edges=activity.graph_edges;
                                    		activityModel.data.constraints=activity.constraints;
                                    	}
                                    	if(activityModel.data.activity_type=='temporal'){
                                    		activityModel.setImage('image',activity.image,this);
                                    		activityModel.data.image_url=activity.image_url.trim();
                                    		activityModel.data.image_datetime=activity.image_datetime.trim();
                                    		activityModel.data.query_datetime=activity.query_datetime.trim();
                                    	}
                                    	if(activityModel.data.activity_type=='geospatial'){
                                    		activityModel.data.area=activity.area.trim();
                                    		activityModel.data.point=activity.points.trim();
                                    		activityModel.data.radius=activity.radius;
                                    	}
                                    	activityModel.save();
                                },failure:function(){
                                	Ext.Viewport.setMasked(false);
                                	Ext.Msg.alert('Unable to install', 'Try again later.', Ext.emptyFn);
                                }
                    		});
                    	}
                		var exist=false;
                		for(cont in activitiesOld.keys){
                			exist=false;
                			for(cont2 in activitiesID){
                				if(activitiesOld.keys[cont] == activitiesID[cont2]){
                					exist=true;
                					break;
                				}
                			}
                			if(!exist){
                				activitiesOld.getByKey(activitiesOld.keys[cont]).erase();
                			}
                			
                		}
                		career.data.update=false;
                    	career.save();
                    	careersStore.sync();
                    	careersStore.load();
                    	Ext.Viewport.setMasked(false);
                    	callback(scope);
                    }
                });
    			
      }else{
    	  	Ext.Viewport.setMasked(false);
    	  	Ext.Msg.alert(i18n.gettext('Problem finded'), 'Unable to update this career. Try again later', Ext.emptyFn);
			return;
      }
	},
	deleteCareer:function(careerID){
		var careersStore=Ext.getStore('Careers');
		var activityStore=Ext.getStore('Activities');
		console.log(careerID);
		var career=careersStore.getById(careerID);
		career.data.installed = false;
		career.data.started =false;
		career.data.update = false;
		var activities=activityStore.queryBy(function(record) {
			if(record.data.careerId==careerID){
				return true;
			}
		});
		activities.each(function(item) {
			item.erase();
		});
		activityStore.sync();
		//activityStore.load();
		career.save();
		careersStore.sync();
		careersStore.load();
	}
});
