
Ext.define('DrGlearning.controller.DaoController', {
    extend: 'Ext.app.Controller',
    stores: [
        'Careers','Activities','Users'
    ],
	
	init: function(){
		
	},
	
	onLaunch: function() {
		
	},
	getInstalled: function() {
		return this.getCareersStore().findExact('installed','true');
	},
    installCareer: function(id,callback,scope) {
    	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Downloading..."});
		myMask.show();
    	var career=this.getCareersStore().getById(id);
    	var activities=career.data.activities;
    	activities=activities.split(",");
    	console.log("activity "+activities);
		for (cont in activities){
			console.log(activities[cont]);
			Ext.data.JsonP.request({
				scope: this,
                url:'http://drglearning.testing.cultureplex.ca/'+activities[cont]+'?format=jsonp',
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
                		activityModel.data.image=activity.image;
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
                	this.getActivitiesStore().sync();
					this.getActivitiesStore().load();
					console.log(this.getActivitiesStore());
                }
            });
		}
		var career=this.getCareersStore().getById(id);
    	career.set('installed','true');
    	this.getCareersStore().load();
    	this.getCareersStore().sync();
    	myMask.hide();
    	callback(scope);

    },
    
    /* 
     * Return the max level
     */
	getLevels: function(careerId){
		var levels=new Array();
		var activities=this.getActivitiesStore().queryBy(function(record) {
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
		var activities=this.getActivitiesStore().queryBy(function(record) {
			return record.data.careerId==careerId && record.data.level_type==level;
		});
		return activities;
	},
	getknowledgesFields:function(){
		var knowledges=new Array();
		var career=this.getCareersStore();
		career.each(function(item) {
			//var temp=eval('('+item.data.knowledges+')');
			console.log(item.data.knowledges);
			var carrerKnowledges=item.data.knowledges;
			for(x in carrerKnowledges){
				var exist=false;
				for(y in knowledges){
					if(carrerKnowledges[x]==knowledges[y]){
						exist=true;
					}
				}
				if(!exist){
					knowledges.push(carrerKnowledges[x]);
				}
			}
			
		},this);
		return knowledges;
	},
	getCarresByKnowledge:function(Knowledge){
		var carrers=this.getCarrersStore().queryBy(function(record) {
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
		var activitiesStore=this.getActivitiesStore();
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
	},
	updateScore:function(activityID,score){
		if(navigator.network.connection.type!=Connection.NONE){
			var usersStore = this.getUsersStore();
			var user=usersStore.first();
			var HOST = "http://drglearning.testing.cultureplex.ca";
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
		}
	},
	/*
	 * Return level id
	 */
	getCurrenLevel:function(carrerID){
		console.log('la carrera es:'+carrerID);
		var levels=this.getLevels(carrerID);
		console.log('los niveles son:'+levels);
		for(var i=1;i<=levels.length;i++){
			var activities=this.getActivitiesByLevel(carrerID,levels[i]);
			for(var j=0;j<activities.items.length;j++){
				console.log(activities.items[j]);
				if(!activities.items[j].data.successful){
					console.log('hola');
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
		//console.log(carrerID);
		//console.log(level);
		var activities=this.getActivitiesByLevel(carrerID,level);
		
		for(var j=0;j<activities.items.length;j++){
			console.log(activities.items[j]);
			if(!activities.items[j].data.successful){
				return activities.items[j].data.id; 
			}
		}
		return activities.items[0].data.id;
	}

});