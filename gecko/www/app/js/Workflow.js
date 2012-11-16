var Workflow = {
    careersStore : new Lawnchair({adapter:'dom',name:'careers'}, function(e) {
          console.log('Careers Storage Open');
    }),
    installCareer: function (element) {
        //Dao.careersStore.get({key:element.attr("data-href"), installed:true});
        Dao.careersStore.get(element.attr("data-href"),function(r){ 
            r.value.installed = true;
            Dao.careersStore.save({key:element.attr("data-href"), value: r.value});
        });
	      DrGlearning.refreshAddCareers();
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
            url: HOST + "/api/v1/knowledge/?format=jsonp",
            dataType : 'jsonp',
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
}

