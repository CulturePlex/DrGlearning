var DrGlearning = {
    careerId: null,
    levelId: null,
    startApp: function(context){
        if(localStorage.uniqueid === undefined)
        {
          var digest;
          if (GlobalSettings.isDevice()) {
              digest = Loading.SHA1(window.device.uuid + " " + new Date().getTime());
          } else {
              digest = Loading.SHA1("test" + " " + new Date().getTime());
          }
          console.log("Creating User");
          localStorage.uniqueid = digest; 
        }
        if (localStorage.uniqueid !== undefined && localStorage.token === undefined) {
            console.log('registering user');
            jQuery.ajax({
                url: GlobalSettings.getServerURL() + "/api/v1/player/?format=jsonp" ,
                dataType : 'jsonp',
                data: {
                    "code": localStorage.uniqueid
                },
                success: function (response) {
                    console.log(response);
                    localStorage.token = response.token;
                    console.log("User successfully registered");
                }
            });
        }
        //Setting up data
        $('#username').val(localStorage.display_name);
        $('#email').val(localStorage.email);
        
        //Setting up pageinits
        $( '#addCourses' ).live( 'pagebeforeshow',function(event){
            DrGlearning.refreshAddCareers();
        });
        
        $( '#main' ).live( 'pagebeforeshow',function(event){
           DrGlearning.refreshMain();
        });
        
        $( '#career' ).live( 'pagebeforeshow',function(event){
            Loading.getCareer(DrGlearning.careerId);
        });
        
        $( '#level' ).live( 'pagebeforeshow',function(event){
            DrGlearning.refreshLevel();
        });
        
        $( '#quiz' ).live( 'pagebeforeshow',function(event){
            Quiz.refresh();
        });
        
        $( '#temporal' ).live( 'pagebeforeshow',function(event){
            Temporal.refresh();
        });
        //Setting up buttons

        $(document).on('click', '#accesscareer',function(e) {
            DrGlearning.setCareerId($(this));
            $.mobile.changePage("#career");
            return false;
        });
        
        $(document).on('click', '#accesslevel',function(e) {
            DrGlearning.setLevelId($(this));
            $.mobile.changePage("#level");
            return false;
        });
        
        $(document).on('click', '#accessactivity',function(e) {
            DrGlearning.setActivityId($(this));
            if(DrGlearning.activityType === "quiz")
            {
                $.mobile.changePage("#quiz");
            }
            if(DrGlearning.activityType === "temporal")
            {
                $.mobile.changePage("#temporal");
            }
            return false;
        });
        
        $('#backfromsettings').click(function(){
          UserSettings.saveSettings();
        });
        
        $(document).on('click', '#careertoinstall',function(e) {
            Dao.installCareer($(this));
            return false;
        });
        //Initializing levelsStore
        Dao.initLevels();
        
        //Refreshing installed careers
        DrGlearning.refreshMain();
        
        //Setting up Activities
        Quiz.setup();
        
    },
    refreshMain: function(){
        $(window).scroll(function(){
        });
        $('#careerslist').empty();
        Dao.careersStore.all(function(arrCareers){
          var empty = true;
		      for(var i = 0; i<arrCareers.length;i++)
		      {
		        if(arrCareers[i].value.installed === true)
		        {
		          empty = false;
			        var listdiv = document.createElement('li');
            	listdiv.setAttribute('id','listdiv');
            	listdiv.innerHTML = '<a id="accesscareer" href="#" data-href="'+
            	    arrCareers[i].key+
            	    '"><h1>'+
            	    arrCareers[i].value.name+
            	    '</h1></a>';
			        $('#careerslist').append(listdiv);
			      }
		      }
		      if(empty)
		      {
              $('#careerslist').append(
                '<li><a href="#addCourses"><h1>'+
                'No careers installed'+
                '</h1><p>'+
                '</p></a></li>');
		      }
		      $('#careerslist').listview("refresh");
	      });
	  },
    refreshAddCareers: function(){
        $(window).scroll(function(){
          if  ($(window).scrollTop() == $(document).height() - $(window).height() && $.mobile.activePage.attr("id") == "addCourses"){
		          Loading.careersRequest("","All");
          }
        });
        $('#addcareerslist').empty();
        Dao.careersStore.all(function(arrCareers){
          var empty = true;
		      for(var i = 0; i<arrCareers.length;i++)
		      {
		        if(arrCareers[i].value.installed === false)
		        {
		          empty = false;
			        var listdiv = document.createElement('li');
            	listdiv.setAttribute('id','listdiv');
            	listdiv.innerHTML = '<a id="careertoinstall" href="#" data-href="'+
            	    arrCareers[i].key+
            	    '"><h1>'+
            	    arrCareers[i].value.name+
            	    '</h1></a>';
			        $('#addcareerslist').append(listdiv);
			      }
		      }
		      if(empty)
		      {
              $('#addcareerslist').append(
                '<li><a href="#"><h1>'+
                'Loading Careers...'+
                '</h1><p>'+
                '</p></a></li>');
		          Loading.careersRequest("","All");
		      }
		      $('#addcareerslist').listview("refresh");
	      });
	  },
    setCareerId: function(element){
        DrGlearning.careerId = element.attr("data-href");
    },
    refreshCareer: function(){
        Dao.careersStore.get(DrGlearning.careerId,function(career){ 
            $('#levelslist').empty();
            Dao.levelsStore.all(function(arrLevels){
                var empty = true;
		            for(var i = 0; i<arrLevels.length;i++)
		            {
		              if(career.value.levels.indexOf(parseInt(arrLevels[i].key,10)) > -1)
		              {
		                empty = false;
			              var listdiv = document.createElement('li');
                  	listdiv.setAttribute('id','listdiv');
                  	listdiv.innerHTML = '<a id="accesslevel" href="#" data-level="'+
                  	    arrLevels[i].key+
                  	    '" data-career="'+
                  	    career.key+
                  	    '"><h1>'+
                  	    arrLevels[i].value.nameBeauty+
                  	    '</h1></a>';
			              $('#levelslist').append(listdiv);
			            }
		            }
		            if(empty)
		            {
                    $('#levelslist').append(
                      '<li><a href="#"><h1>'+
                      'No Levels in this career...'+
                      '</h1><p>'+
                      '</p></a></li>');
		            }
		            $('#levelslist').listview("refresh");
	          });
	      });
	  },
    setLevelId: function(element){
        DrGlearning.levelId = element.attr("data-level");
    },
    refreshLevel: function(){
        $('#activitieslist').empty();
        Dao.levelsStore.get(DrGlearning.levelId,function(level){ 
            $('#levelDescription').html(level.value.description);
            Dao.activitiesStore.all(function(arrActivities){
                var empty = true;
		            for(var i = 0; i<arrActivities.length;i++)
		            {
		              if(arrActivities[i].value.careerId == DrGlearning.careerId && arrActivities[i].value.level_type == level.key)
		              {
		                empty = false;
			              var listdiv = document.createElement('li');
                  	listdiv.setAttribute('id','listdiv');
                  	listdiv.innerHTML = '<a id="accessactivity" href="#" data-activity="'+
                  	    arrActivities[i].key+
                  	    '"><h1>'+
                  	    arrActivities[i].value.name+
                  	    '</h1></a>';
			              $('#activitieslist').append(listdiv);
			            }
		            }
		            if(empty)
		            {
                    $('#levelslist').append(
                      '<li><a href="#"><h1>'+
                      'No Activities in this level...'+
                      '</h1><p>'+
                      '</p></a></li>');
		            }
		            $('#activitieslist').listview("refresh");
	          });
	      });
	  },
    setActivityId: function(element){
        DrGlearning.activityId = element.attr("data-activity");
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            DrGlearning.activityType = activity.value.activity_type;
        });
    },
}
