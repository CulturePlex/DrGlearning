
var DrGlearning = {
    careerId: null,
    levelId: null,
    careerSelect: null,
	embebed:false,
	careerToEmbeb:null,
	embebDrGlearning: function(div,career_id)
	{
		var el = document.createElement("iframe");
		el.setAttribute('id', 'ifrm');
		el.setAttribute('height', 400);
		$('#'+div).append(el);
		el.setAttribute('src', 'index.html?embebed=true&careerToEmbeb='+career_id);
	},
    startApp: function(context){
		var embebed = window.location.search.substring(window.location.search.indexOf('embebed=') + 8);
		if (embebed.indexOf('&') >= 0) {
			embebed = embebed.substring(0, embebed.indexOf('&'));
		}
		DrGlearning.embebed = embebed;
		var careerToEmbeb = window.location.search.substring(window.location.search.indexOf('careerToEmbeb=') + 14);
		if (careerToEmbeb.indexOf('&') >= 0) {
			careerToEmbeb = careerToEmbeb.substring(0, careerToEmbeb.indexOf('&'));
		}
		DrGlearning.embebed = embebed;
		if(DrGlearning.embebed)
		{
			$('#career').children('header').children('a').remove();
			console.log($('#footercourse'));
			$('#footercourse').remove();
		}
		DrGlearning.careerToEmbeb = careerToEmbeb;
		// Setting up Jquery blockUI CSS
		$.blockUI.defaults.css = { 
	        padding: 0,
	        margin: 0,
	        width: '30%',
	        top: '40%',
	        left: '35%',
			color: 'white',
	        textAlign: 'center',
			fontFamily: "Helvetica, Arial, sans-serif",
	        cursor: 'wait'
	    };
        // Requesting Knowledge fields
        
        Dao.knowledgesRequest();
        DrGlearning.translateApp();
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
		var display_name;
		Dao.userStore.get('display_name',function(me)
		{
			display_name = (me !== null) ? me.value : undefined;
		});
		var email;
		Dao.userStore.get('email',function(me)
		{
			email = (me !== null) ? me.value : undefined;
		});
        if(uniqueid === '')
        {
          var digest;
          if (GlobalSettings.isDevice()) {
              digest = Loading.SHA1(window.device.uuid + " " + new Date().getTime());
          } else {
              digest = Loading.SHA1("test" + " " + new Date().getTime());
          }
          console.log("Creating User");
          Dao.userStore.save({key:'uniqueid',value:digest});
          //localStorage.uniqueid = digest; 
        }
		Dao.userStore.get('uniqueid',function(me)
		{
			uniqueid = (me !== null) ? me.value : '';
		});
        if (uniqueid !== '' && token === '') {
            console.log('registering user');
            jQuery.ajax({
                url: GlobalSettings.getServerURL() + "/api/v1/player/?format=json" ,
                dataType : 'json',
                data: {
					"callback": "a",
                    "code": uniqueid
                },
                success: function (response) {
                    console.log(response);
					Dao.userStore.save({key:'token',value:response.token});
                    //localStorage.token = response.token;
                    console.log("User successfully registered");
                }
            });
        }

        //Setting up data
        $('#username').val(display_name);
        $('#email').val(email);
        
        //Setting up pageinits
        $( '#addCourses' ).live( 'pagebeforeshow',function(event){
            DrGlearning.refreshAddCareers();
        });
        
        $( '#main' ).live( 'pagebeforeshow',function(event){
           DrGlearning.refreshMain();
           
        });
        
        $( '#career' ).live( 'pagebeforeshow',function(event){
            //Loading.getCareer(DrGlearning.careerId);
			DrGlearning.refreshCareer();
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
        
        $( '#geospatial' ).live( 'pagebeforeshow',function(event){
            Geospatial.refresh();
        });

        $( '#relational' ).live( 'pagebeforeshow',function(event){
            Relational.refresh();
        });
		
		$( '#linguistic' ).live( 'pagebeforeshow',function(event){
            Linguistic.refresh();
        });
        
        //Setting up buttons
        
        $(document).on('click', '#accesscareer',function(e) {
			DrGlearning.setCareerId($(this));
            $.mobile.changePage("#career");
            return false;
        });

        $(document).on('click', '#dialogOK',function(e) {
            Workflow.nextActivity(DrGlearning.levelId);       
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
	            Linguistic.refresh();
            }
            if(DrGlearning.activityType === "geospatial")
            {
                $.mobile.changePage("#geospatial");
            }
	    if(DrGlearning.activityType === "relational")
            {
                $.mobile.changePage("#relational");
				Relational.refresh();
            }
            return false;
        });
        $('#importUser').click(function(){
          $("#dialogSyncName").html(i18n.gettext("Import User"));
          $("#dialogSyncDescription").html(i18n.gettext("Paste your code here"));
  		  $("#inputSync").val('');
		  $("#inputSync").prop('disabled', false);
		  $('#syncOK').on('click', UserSettings.importUser);

        });
		$('#exportUser').click(function(){
          $("#dialogSyncName").html(i18n.gettext("Export User"));
          $("#dialogSyncDescription").html(i18n.gettext("Copy and paste this code in another device"));
  		  $("#inputSync").val(uniqueid);
		  $("#inputSync").prop('disabled', true);
		  $('#syncOK').off('click', UserSettings.importUser);
        });
        $('#backfromsettings').click(function(){
          UserSettings.saveSettings();
        });
		$('#uninstall').click(function(){
          $('#questionInstall').html(i18n.gettext("Are you sure you want to uninstall this course?"));
		  Workflow.uninstalling = true;
        });   
		   
		$(document).on('click', '#confirmInstall',function(e) {
			if(Workflow.uninstalling)
			{
				console.log('jaja');
				Dao.uninstall(DrGlearning.careerId);
				$.mobile.changePage("#main");
			}
			else
			{
				console.log(DrGlearning.careerSelect.attr("data-href"));
				var has_code;
				Dao.careersStore.get(DrGlearning.careerSelect.attr("data-href"),function(r){ 
					has_code = r.value.has_code;
				});
				if (has_code)
				{
				  $("#dialogPrivateName").html(i18n.gettext("Private Course"));
				  $("#dialogPrivateDescription").html(i18n.gettext("Type here the private code for this course"));
		  		  $("#inputPrivate").val('');
				  $("#inputPrivate").prop('disabled', false);
				  //$('#privateOK').on('click', UserSettings.importUser);
				  $.mobile.changePage("#dialogPrivate");
				}
				else
				{
					$.mobile.changePage("#main");
					$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Installing Course...')+'</p>' });
		       		Dao.installCareer(DrGlearning.careerSelect);
				}
			}
        });
		$(document).on('click', '#privateOK',function(e) {
			Dao.checkCode(DrGlearning.careerSelect,$("#inputPrivate").val());
        });
        $(document).on('click', '#careertoinstall',function(e) {
            Workflow.uninstalling = false;
            DrGlearning.careerSelect = $(this);
            DrGlearning.setCareerId($(this));
            Dao.careersStore.get($(this).attr("data-href"),function(r){ 
              var filesImgs = ["illetratum.png", "primary.png", "secondary.png", "highschool.png", "college.png", "master.png", "phd.png", "postdoc.png", "professor.png", "emeritus.png"];
              $("#questionInstall").empty();
              $("#questionInstall").append("<h3>Install the course "+ r.value.name +"?</h3>");
              $("#descriptionInstall").empty();
              $("#descriptionInstall").append(r.value.description);
              var html="";

              for (var cont = 0; cont < r.value.levels.length ; cont++) {
                    html = html + "<img src='resources/images/level_icons/" + filesImgs[r.value.levels[cont] - 1] + "' height='40' >";
                }
              $("#levelsToInstall").empty();
              $("#levelsToInstall").append( html);
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
        Relational.setup();
		if(DrGlearning.embebed)
		{
			$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Getting Course...')+'</p>' });
			console.log(DrGlearning.careerToEmbeb);
			DrGlearning.careerId=parseInt(DrGlearning.careerToEmbeb,10);
			Loading.getCareer(parseInt(DrGlearning.careerToEmbeb,10));
		}
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
				    var iconsHtml = Workflow.getLevelIcons(arrCareers[i].key);
		            empty = false;
			        var listdiv = document.createElement('li');
		        	listdiv.setAttribute('id','listdiv');
		        	listdiv.innerHTML = '<a id="accesscareer" href="#" data-href="'+
            	    arrCareers[i].key+
            	    '"><h1>'+
            	    arrCareers[i].value.name+
            	    '</h1><div>'+iconsHtml+'</div></a>';
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
		Loading.careersRequest($( "#searchcourses" ).val(),$("#select-knowledges").val());
        $("#select-knowledges").bind( "change", function(event, ui) {
           Loading.careersRequest($( "#searchcourses" ).val(),$("#select-knowledges").val());
        });
        //Setting up search courses bar
        $( "#searchcourses" ).bind( "change", function(event, ui) {
           Loading.careersRequest($(this).val(),$("#select-knowledges").val());
        });
        $(window).scroll(function(){
          if  ($(window).scrollTop() == $(document).height() - $(window).height() && $.mobile.activePage.attr("id") == "addCourses"){
		          Loading.careersRequest($("#searchcourses").val(),$("#select-knowledges").val());
          }
        });
        $('#addcareerslist').empty();
		console.log(Dao.careersStore);
        Dao.careersStore.all(function(arrCareers){
          var empty = true;	
		      for(var i = 0; i<arrCareers.length;i++)
		      {	
		        if(arrCareers[i].value.installed === false)
		        {
					var starHtml = "";
					if(arrCareers[i].value.career_type == "exam")
					{
						starHtml = "<img class='levelicon' src='resources/images/trophy_icon.png' height='15'>";
					}
		            empty = false;
			        var listdiv = document.createElement('li');
		        	listdiv.setAttribute('id','listdiv');
		        	listdiv.innerHTML = '<a id="careertoinstall" href="#dialogConfirmInstall" data-rel="dialog" data-href="'+
            	    arrCareers[i].key+
            	    '"><h1>'+
            	    arrCareers[i].value.name+starHtml+
            	    '</h1></a>';
			        $('#addcareerslist').append(listdiv);
			      }
		      }
		      if(empty)
		      {
              $('#addcareerslist').append(
                '<li><a href="#"><h1>'+
                i18n.gettext('No careers to install...')+
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
			$('#careerTitle').html(career.value.name);
            $('#levelslist').empty();
            Dao.levelsStore.all(function(arrLevels){
                var empty = true;
		            for(var i = 0; i<arrLevels.length;i++)
		            {
		              if(career.value.levels.indexOf(parseInt(arrLevels[i].key,10)) > -1)
		              {
						var tick="";
						var locker="";
						if(Workflow.levelIsCompleted(arrLevels[i],DrGlearning.careerId))
						{
							tick=" ✓";
						}
						if(i>0)
						{
							if(career.value.career_type== "exam" && !Workflow.levelIsCompleted(arrLevels[i-1],DrGlearning.careerId))
							{
								locker=" <img class='levelicon' src='resources/images/padlock.png' height='25'>";
							}
						}
		                empty = false;
			            var listdiv = document.createElement('li');
				      	listdiv.setAttribute('id','listdiv');
				       	listdiv.innerHTML = '<a id="accesslevel" href="#" data-level="'+
                  	    arrLevels[i].key+
                  	    '" data-career="'+
                  	    career.key+
                  	    '"><h1>'+
                  	    arrLevels[i].value.nameBeauty+tick+locker+
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
		Dao.careersStore.get(DrGlearning.careerId,function (career){
			console.log(DrGlearning.levelId);
			if(career.value.career_type == "exam")
			{
				if(DrGlearning.levelId > 1)
				{
					console.log(DrGlearning.levelId);
		        	Dao.levelsStore.get(DrGlearning.levelId-1,function(level){
						$('#levelTitle').html(level.value.name); 
						if(!Workflow.levelIsCompleted(level,DrGlearning.careerId))
						{
				  	        $('#dialogText').html(i18n.gettext("You can't play this level until you have completed every previous one"));
							Workflow.toCareer = true;
							$.mobile.changePage("#dialog");
							return false;
						}
					});
				}
			}		
		});
        $('#activitieslist').empty();
        Dao.levelsStore.get(DrGlearning.levelId,function(level){ 
    		$('#levelTitle').html(level.value.name); 
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
						if(arrActivities[i].value.successful)
						{
		              		listdiv.innerHTML = '<a id="accessactivity" href="#" data-activity="'+
		              	    arrActivities[i].key+
		              	    '"><h1>'+
		              	    arrActivities[i].value.name+
		              	    '</h1>'+
							'✓ Score:'+
							 arrActivities[i].value.score+
							'</a>';							
						}
						else
						{
		              		listdiv.innerHTML = '<a id="accessactivity" href="#" data-activity="'+
		              	    arrActivities[i].key+
		              	    '"><h1>'+
		              	    arrActivities[i].value.name+
		              	    '</h1></a>';
			            }
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
			Undo: i18n.gettext("Undo"),
			After: i18n.gettext("After"),
			Before: i18n.gettext("Before"),
			UninstallCourse: i18n.gettext("Uninstall Course")
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
        Letters_Used: i18n.gettext("Letter_Used"),
        };
    var html  = template(context);
    $("footer:first").empty();
    $("footer:first").append(html);
    }
};
