/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

Ext.define('DrGlearning.controller.DaoController', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
        this.careersStore = Ext.getStore('Careers');
    },

    getInstalled: function() {
        return this.careersStore.findExact('installed',true);
    },

    installCareer: function(id,callback,scope) {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Installing course...',
                indicator: true
        });
        var career=this.careersStore.getById(id);
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
            var HOST = this.globalSettingsController.getServerURL();
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
                        activityModel.setImage('obImage',activity.obfuscated_image,this);
                        activityModel.data.image_url=activity.image_url.trim();
                        activityModel.data.obfuscated_image_url=activity.obfuscated_image_url.trim();
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
                        activityModel.data.graph_nodes=activity.graph_nodes;
                        for (x in activity.graph_edges){
                            if(activity.graph_edges[x].inverse == undefined){
                                activity.graph_edges[x]['inverse']="";
                            }
                        }
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
                        var career=this.careersStore.getById(id);
                        career.set('installed',true);
                        career.save();
                        this.careersStore.sync();
                        this.careersStore.load();
                        career.set('id',id);
                        localStorage.actualSize=parseInt(localStorage.actualSize)+career.data.size;
                        Ext.getStore('Activities').sync();
                        Ext.getStore('Activities').load();
                        callback(scope);
                        Ext.Viewport.setMasked(false);
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
            //    levels.push(item.data.level_type);
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
            if(record.data.careerId==careerId && record.data.level_type==''+level){
                //console.log('Nivel ' +level);
                //console.log(record.data.level_type);
                return true;    
            }else{
                return false;
            }
        });
        //console.log("ORDEN");
        //console.log(level);
        //console.log(careerId);
        return activities;
    },
    getknowledgesFields:function(){
        var knowledges=new Array();
        var career=this.careersStore;
        career.clearFilter();
        career.each(function(item) {
            //var temp=eval('('+item.data.knowledges+')');
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
        return knowledges;
    },
    getCarresByKnowledge:function(Knowledge){
        var carrers=this.careersStore.queryBy(function(record) {
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
        console.log(new Date().getTime());
        this.updateScore(activityID,score,new Date().getTime());
        //console.log('Peticion de jugada!!!!!');
        var activitiesStore=Ext.getStore('Activities');
        var activity=activitiesStore.getById(activityID);
        if(successful){
            if(activity.data.successful){
                if(activity.data.score<parseInt(score)){
                    activity.data.score=parseInt(score);
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
        var carrer=this.careersStore.getById(activity.data.careerId);
        if(!carrer.data.started){
            carrer.data.started=true;
            carrer.save();
        }
    },
    updateScore:function(activityID,score,timestamp){
        var offlineScoreStore=Ext.getStore('OfflineScores');
        var usersStore = Ext.getStore('Users');
        var user=usersStore.getAt(0);
        var HOST = this.globalSettingsController.getServerURL();
        /*if(this.globalSettingsController.hasNetwork()){
            Ext.data.JsonP.request({
                scope: this,
                url: HOST+"/api/v1/highscore/?format=jsonp",
                params: {
                    player_code: user.data.uniqueid,
                    activity_id: activityID,
                    score: score,
                    timestamp: timestamp
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
        */
        
            /*var offlineScore=offlineScoreStore.queryBy(function(record) {
                if(record.data.activity_id==activityID){
                    return true;
                }
            });*/
            var offlineScoreModel=new DrGlearning.model.OfflineScore({
                activity_id : activityID,
                score : score,
                timestamp: timestamp
            });
            /*if(offlineScore.getCount()!=0){
                offlineScoreModel.set('id',offlineScore.first().data.id);
            }*/
            offlineScoreModel.save();
        //}
    },
    /*
     * Return level id
     */
    getCurrenLevel:function(carrerID){
        var levels=this.getLevels(carrerID);
        for(var i=0;i<=levels.length;i++){
            var activities=this.getActivitiesByLevel(carrerID,levels[i]);
            for(var j=0;j<activities.items.length;j++){
                if(!activities.items[j].data.successful){
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
    getCurrenActivity:function(carrerID,level){
        var activities=this.getActivitiesByLevel(carrerID,level);
        
        for(var j=0;j<activities.items.length;j++){
            if(!activities.items[j].data.successful){
                return activities.items[j]; 
            }
        }
        return activities.items[0];
    },
    updateOfflineScores:function(){
        console.log('sending scores...');
        var offlineScoreStore=Ext.getStore('OfflineScores');
        var usersStore = Ext.getStore('Users');
        var user=usersStore.getAt(0);
        var HOST = this.globalSettingsController.getServerURL();
        offlineScoreStore.each(function(item) {
            Ext.data.JsonP.request({
                scope: this,
                url: HOST+'/api/v1/score/?format=jsonp',
                params: {
                    player_code: user.data.uniqueid,
                    activity_id: item.data.activity_id,
                    score: parseFloat(item.data.score),
                    timestamp: item.data.timestamp,
                    token: user.data.token
                },
                success: function(response){
                    item.erase();
                    console.log("scores successfully sent");
                }
            });
        },this);
    },
    //Tell us if a level is approved or not
    isApproved:function(careerID,level)
    {
        var approved=true;
        var activities=this.getActivitiesByLevel(careerID,level.customId);
        for(var j=0;j<activities.items.length;j++){
            
            //console.log(activities.items[j]);
            if(!activities.items[j].data.successful){
                approved=false; 
            }
        }
        return approved;
    },
    updateCareer:function(careerID,callback,scope){
        console.log("Updating career "+careerID);
        if(this.globalSettingsController.hasNetwork()){
            var careersStore=this.careersStore;
            var activityStore=Ext.getStore('Activities');
            var career=careersStore.getById(careerID);
            var HOST = this.globalSettingsController.getServerURL();
                //Career request
                Ext.data.JsonP.request({
                    url: HOST+'/api/v1/career/'+careerID+'/?format=jsonp',
                    scope   : this,
                    success:function(response, opts){
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
                        var HOST = this.globalSettingsController.getServerURL();
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
                                            activityModel.data.time=activity.time;
                                        }
                                        if(activityModel.data.activity_type=='quiz'){
                                            activityModel.setImage('image',activity.image,this);
                                            activityModel.data.image_url=activity.image_url;
                                            //activityModel.data.image=activity.image;
                                            activityModel.data.answers=activity.answers;
                                            activityModel.data.correct_answer=activity.correct_answer.trim();
                                            //activityModel.set('obfuscated_image',activity.obfuscated_image);
                                            activityModel.data.time=activity.time;
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
        var careersStore=this.careersStore;
        var activityStore=Ext.getStore('Activities');
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
