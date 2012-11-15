var DrGlearning = {
    careerId: null,
    levelId: null,
    careerSelect: null,
    startApp: function(context){
    	// Setting up Jquery blockUI CSS
	$.blockUI.defaults.css = { 
            padding: 0,
            margin: 0,
            width: '30%',
            top: '40%',
            left: '35%',
	    color: 'white',
            textFont: "Times New Roman",
            textAlign: 'center',
            cursor: 'wait'
        };
        // Requesting Knowledge fields
        
        Dao.knowledgesRequest();
        DrGlearning.translateApp();
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
        
        $( '#visual' ).live( 'pagebeforeshow',function(event){
            Visual.refresh();
        });
        
        $( '#linguistic' ).live( 'pagebeforeshow',function(event){
            Linguistic.refresh();
        });
        
        $( '#geospatial' ).live( 'pagebeforeshow',function(event){
            Geospatial.refresh();
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
            if(DrGlearning.activityType === "visual")
            {
                $.mobile.changePage("#visual");
            }
            if(DrGlearning.activityType === "linguistic")
            {
                $.mobile.changePage("#linguistic");
            }
            if(DrGlearning.activityType === "geospatial")
            {
                $.mobile.changePage("#geospatial");
            }
            return false;
        });
        
        $('#backfromsettings').click(function(){
          UserSettings.saveSettings();
        });
        
        $(document).on('click', '#careertoinstall',function(e) {
            DrGlearning.careerSelect = $(this);
            console.log($(this));
            console.log('asdasdasd');
            Dao.careersStore.get($(this).attr("data-href"),function(r){ 
              var filesImgs = ["iletratum.png", "primary.png", "secondary.png", "highschool.png", "college.png", "master.png", "PhD.png", "post-doc.png", "professor.png", "emeritus.png"];
              $("#questionInstall").empty();
              $("#questionInstall").append("<h3>Install the course "+ r.value.name +"?</h3>");
              $("#descriptionInstall").empty();
              var html="";
              $("#descriptionInstall").append( r.value.description +"<p align='center'>");
              for (var cont = 0; cont < r.value.levels.length ; cont++) {
                    html = html + "<img src='resources/images/level_icons/" + filesImgs[r.value.levels[cont] - 1] + "' height='40' >";
                }
              $("#descriptionInstall").append( html +"</p>");
            });
            $(document).on('click', '#confirmInstall',function(e) {
                Dao.installCareer(DrGlearning.careerSelect);
            });
        });
        //Initializing levelsStore
        Dao.initLevels();
        
        //Refreshing installed careers
        DrGlearning.refreshMain();
        
        //Setting up Activities
        Quiz.setup();
        Temporal.setup();
        Visual.setup();
        Linguistic.setup();
        Geospatial.setup();
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
                i18n.gettext('No careers installed')+
                '</h1><p>'+
                '</p></a></li>');
		      }
		      $('#careerslist').listview("refresh");
	      });
	  },
    refreshAddCareers: function(){
        //Setting up knowledges field select
        $("#select-knowledges").bind( "change", function(event, ui) {
           Loading.careersRequest($( "#searchcourses" ).val(),$("#select-knowledges").val());
        });
        //Setting up search courses bar
        $( "#searchcourses" ).bind( "change", function(event, ui) {
           console.log($("#select-knowledges").val());
           Loading.careersRequest($(this).val(),$("#select-knowledges").val());
        });
        $(window).scroll(function(){
          if  ($(window).scrollTop() == $(document).height() - $(window).height() && $.mobile.activePage.attr("id") == "addCourses"){
		          Loading.careersRequest($("#searchcourses").val(),$("#select-knowledges").val());
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
            	listdiv.innerHTML = '<a id="careertoinstall" href="#dialogConfirmInstall" data-rel="dialog" data-href="'+
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
                i18n.gettext('Loading Careers...')+
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
                      i18n.gettext('No Levels in this career...')+
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
                      i18n.gettext('No Activities in this level...')+
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
    translateApp: function (){
    //Initializing Handlebars
    //Disabled because there is a conflict between jquery mobile init component and compiling the whole body...
    var pages = $("div[data-role=page]");
    $("div[data-role=page]").each(function(index) {
      if($(this).attr('id') != "main")
      {
        var source   = $(this).html();
        var template = Handlebars.compile(source);
        var context  =  {
            title: i18n.gettext("Dr. Glearning"), 
            NoCareersInstalled: i18n.gettext("No courses installed"),
            Settings: i18n.gettext("Settings"),
            AddCourse: i18n.gettext("Add course"),
            ImportUser: i18n.gettext("Import User"),
            ExportUser: i18n.gettext("Export User"),
            Answerthequestion: i18n.gettext("Answer the question:"),
            Are_you_sure_you_want_to_install_this_course: i18n.gettext("Are_you_sure_you_want_to_install_this_course?"),
            Answer: i18n.gettext("Answer"),
            Try: i18n.gettext("Try"),
            Solve: i18n.gettext("Solve"),
            Letters_Used: i18n.gettext("Letter_Used"),
            Username: i18n.gettext("Username"),
            Email: i18n.gettext("Email"),
            Confirm: i18n.gettext("Confirm"),
            Cancel: i18n.gettext("Cancel"),
            Skip: i18n.gettext("Skip"),
            OK: i18n.gettext("OK"),
            AddCourses: i18n.gettext("Add Courses"),
            };
        var html    = template(context);
        $(this).empty();
        $(this).append(html);
      }
    });
    var source   = $("footer:first").html();
    var template = Handlebars.compile(source);
    var context  =  {
        title: i18n.gettext("Dr. Glearning"), 
        NoCareersInstalled: i18n.gettext("No courses installed"),
        Settings: i18n.gettext("Settings"),
        AddCourse: i18n.gettext("Add course"),
        ImportUser: i18n.gettext("Import User"),
        ExportUser: i18n.gettext("Export User"),
        Answerthequestion: i18n.gettext("Answer the question:"),
        Are_you_sure_you_want_to_install_this_course: i18n.gettext("Are_you_sure_you_want_to_install_this_course?"),
        Answer: i18n.gettext("Answer"),
        Try: i18n.gettext("Try"),
        Solve: i18n.gettext("Solve"),
        Letters_Used: i18n.gettext("Letter_Used")
        };
    var html  = template(context);
    $("footer:first").empty();
    $("footer:first").append(html);
    }
}
