
var DrGlearning = {
    careerId: null,
    levelId: null,
    careerSelect: null,
	embed:false,
	embedImport:false,
	careerToEmbed:null,
	codeError: false,
	embedDrGlearning: function(div,career_id, height, width,imp)
	{
		var el = document.createElement("iframe");
		el.setAttribute('id', 'ifrm');
		el.setAttribute('height', height);
		el.setAttribute('width', width);
		var container = document.getElementById(div);
		container.appendChild(el);
		var url='index.html?embed=true&careerToEmbed='+career_id;
		if(imp)
		{
			url+='&import=true';
		}
		el.setAttribute('src', url);
	},
    startApp: function(context){
        console.log('holass');
		var embed = window.location.search.substring(window.location.search.indexOf('embed=') + 6);
		if (embed.indexOf('&') >= 0) {
			embed = embed.substring(0, embed.indexOf('&'));
		}
		DrGlearning.embed = embed;
		var careerToEmbed = window.location.search.substring(window.location.search.indexOf('careerToEmbed=') + 14);
		if (careerToEmbed.indexOf('&') >= 0) {
			careerToEmbed = careerToEmbed.substring(0, careerToEmbed.indexOf('&'));
		}
		DrGlearning.careerToEmbed = careerToEmbed;
		var embedImport = window.location.search.substring(window.location.search.indexOf('import=') + 7);
		if (embedImport.indexOf('&') >= 0) {
			embedImport = embedImport.substring(0, careerToEmbed.indexOf('&'));
		}
		DrGlearning.embedImport = embedImport;
		if(DrGlearning.embed)
		{
			$('#career').children('header').children('a').remove();
			$('#footercourse').remove();
		}

		// Setting up locales
		if(localStorage.locale == undefined)
		{
			localStorage.locale= "en";
		}
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
          Dao.userStore.save({key:'uniqueid',value:digest});
        }
		Dao.userStore.get('uniqueid',function(me)
		{
			uniqueid = (me !== null) ? me.value : '';
		});
		$(document).on('click', '#startingNewUser',function(e) {
            Loading.createUser(uniqueid);
            $('#dialogText').html(i18n.gettext("New user successfully created!"));
			//Workflow.toMain = true;
        });
        $('#startingImportUser').click(function(){
          $("#dialogSyncName").html(i18n.gettext("Import User"));
          $("#dialogSyncDescription").html(i18n.gettext("Paste your code here"));
  		  $("#inputSync").val('');
		  $("#inputSync").prop('disabled', false);
		  $('#syncOK').on('click', UserSettings.importUser);
        });
        if (uniqueid !== '' && token === '') {
            console.log('primera vez');
			$('#dialogStartingText').html(i18n.gettext("It's the first time you open Dr. Glearning in this device, do you have already a Dr. Glearning Account? import it!"));
            $.mobile.changePage("#dialogStarting");	
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
            //Quiz.refresh();
        });

        $( '#temporal' ).live( 'pagebeforeshow',function(event){
            //Temporal.refresh();
        });

        $( '#visual' ).live( 'pagebeforeshow',function(event){
            //Visual.refresh();
        });

        $( '#geospatial' ).live( 'pagebeforeshow',function(event){
            //Geospatial.refresh();
        });

        $( '#relational' ).live( 'pagebeforeshow',function(event){
            //Relational.refresh();
        });

		$( '#linguistic' ).live( 'pagebeforeshow',function(event){
            //Linguistic.refresh();
        });

		//Setting up Activities Info

		$(document).on('click', '#infoQuiz',function(e) {

			$('#dialogText').html(Quiz.activity.value.query +'<br><br>'+ i18n.gettext("Choose the right option"));
			Workflow.toActivity = true;
			Workflow.toQuiz = true;
        });
		$(document).on('click', '#infoVisual',function(e) {
			$('#dialogText').html(Visual.activity.value.query +'<br><br>'+ i18n.gettext("Look at the image and answer the question. The faster you answer, the better your score!"));
			Workflow.toActivity = true;
			Workflow.toVisual = true;
			Visual.isStoped = true;
        });
		$(document).on('click', '#infoTemporal',function(e) {
			$('#dialogText').html(Temporal.activity.value.query +'<br><br>'+ i18n.gettext("Look at the image and answer the question. The faster you answer, the better your score!"));
			Workflow.toActivity = true;
			Workflow.toTemporal = true;
        });
		$(document).on('click', '#infoGeospatial',function(e) {
			$('#dialogText').html(Geospatial.activity.value.query +'<br><br>'+ i18n.gettext("Find the correct location on the map"));
			Workflow.toActivity = true;
			Workflow.toGeospatial = true;
        });
		$(document).on('click', '#infoRelational',function(e) {
			$('#dialogText').html(Relational.activity.value.query +'<br><br>'+ i18n.gettext("Go from one item to another until you fulfill all the conditions"));
			Workflow.toActivity = true;
			Workflow.toRelational = true;
        });
		$(document).on('click', '#infoLinguistic',function(e) {
			$('#dialogText').html(Linguistic.activity.value.query +'<br><br>'+ i18n.gettext("Guess the hidden message. Unlock letters to get a hint; the image might help too!"));
			Workflow.toActivity = true;
			Workflow.toLinguistic = true;
        });
        //Setting up buttons
        $(document).on('click', '#accesscareer',function(e) {
			DrGlearning.setCareerId($(this));
            $.mobile.changePage("#career");
            return false;
        });
        $(document).on('click', '#dialogOK',function(e) {
    	    if(Workflow.toDialogPrivate)
		    {	
			    Workflow.toDialogPrivate = false;
			    $.mobile.changePage("#dialogPrivate");			
			    return false;
		    }
			if(Workflow.toStarting)
			{	
				Workflow.toStarting = false;
				$.mobile.changePage("#dialogStarting");			
				return false;
			}
			if(Workflow.toMain)
			{	
				Workflow.toMain = false;
				$.mobile.changePage("#main");			
				return false;
			}
			if(Workflow.toCareer)
			{	
				Workflow.toCareer = false;
				$.mobile.changePage("#career");			
				return false;
			}

			if(Workflow.toLevel)
			{	
				Workflow.toLevel = false;
				$.mobile.changePage("#level");			
				return false;
			}
			
			if(Workflow.toActivity)
			{
				Workflow.toActivity = false;
				if(Workflow.toQuiz)
				{
					Workflow.toQuiz = false;
					$.mobile.changePage("#quiz");
				}
				if(Workflow.toVisual)
				{
					Visual.isStoped = false;
					Workflow.toVisual = false;
					$.mobile.changePage("#visual");
				}
				if(Workflow.toGeospatial)
				{
					Workflow.toGeospatial = false;
					$.mobile.changePage("#geospatial");
				}
				if(Workflow.toLinguistic)
				{
					Workflow.toLinguistic = false;
					$.mobile.changePage("#linguistic");
				}
				if(Workflow.toRelational)
				{
					Workflow.toRelational = false;
					$.mobile.changePage("#relational");
        			Relational.refreshRel(Relational.option);
				}
				if(Workflow.toTemporal)
				{
					Workflow.toTemporal = false;
					$.mobile.changePage("#temporal");
				}
			}
			else
			{
				Workflow.nextActivity(DrGlearning.levelId);
			}
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
				Quiz.refresh();
            }
            if(DrGlearning.activityType === "temporal")
            {
                $.mobile.changePage("#temporal");
				Temporal.refresh();
            }
            if(DrGlearning.activityType === "visual")
            {
                $.mobile.changePage("#visual");
				Visual.refresh();
            }
            if(DrGlearning.activityType === "linguistic")
            {
                $.mobile.changePage("#linguistic");
	            Linguistic.refresh();
            }
            if(DrGlearning.activityType === "geospatial")
            {
                $.mobile.changePage("#geospatial");
				Geospatial.refresh();
            }
	        if(DrGlearning.activityType === "relational")
            {
                $.mobile.changePage("#relational");
				Relational.refresh();
            }
            return false;
        });
        $('#importUser').click(function(){
          console.log('asdasd');
          $.mobile.changePage("#dialogSync");
          $("#dialogSyncName").html(i18n.gettext("Import User"));
          $("#dialogSyncDescription").html(i18n.gettext("Paste your code here"));
  		  $("#inputSync").val('');
		  $("#inputSync").prop('disabled', false);
		  $('#syncOK').on('click', UserSettings.importUser);

        });
		$('#exportUser').click(function(){
          $("#dialogSyncName").html(i18n.gettext("Export User"));
          $("#dialogSyncDescription").html(i18n.gettext("Copy and paste this code in another device"));
		  Dao.userStore.get('uniqueid',function(me)
		  {
			  uniqueid = (me !== null) ? me.value : '';
          });
  		  $("#inputSync").val(uniqueid);
		  $("#inputSync").prop('disabled', true);
		  $('#syncOK').off('click', UserSettings.importUser);
        });
        $('#saveSettings').click(function(){
            UserSettings.saveSettings();
        });
        $('#dialogYes').click(function(){
            UserSettings.saveSettings();
        });
        $('#dialogNo').click(function(){
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
            $('#username').val(display_name); 
            $('#email').val(email); 
            $('#locale option[value='+localStorage.locale+']').attr('selected', 'selected'); 
            //$('#locale').val(localStorage.locale);
		    $.mobile.changePage("#main");
        });
        $('#backfromsettings').click(function(){
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
            var usernameField = $('#username').val();
            var emailField = $('#email').val();
            var changed = false;
            if (emailField !== email || usernameField !== display_name)
            {
                changed = true;
            }
            var locale = $('#locale').val();
		    if (localStorage.locale !== locale) {
                changed = true;
            }		
            if (changed)
            {
                $('#dialogYesNoText').html(i18n.gettext("You have unsaved changes, do you want to save it?"));
				Workflow.toMain = true;
				$.mobile.changePage("#dialogYesNo");
            }else
            {
				$.mobile.changePage("#main");
            }
        });
		$('#uninstall').click(function(){
          $('#questionInstall').html(i18n.gettext("Are you sure you want to uninstall this course?"));
		  Workflow.uninstalling = true;
        });
		$('#update').click(function(){
			Dao.careersStore.get(DrGlearning.careerId,function(me)
			{
				Dao.checkForCareerUpdate(me);
			});
        });
		$('#updateAll').click(function(){
        	Dao.checkForAllCareerUpdate();
        });

		$(document).on('click', '#confirmInstall',function(e) {
			if(Workflow.uninstalling)
			{
				Dao.uninstall(DrGlearning.careerId);
				$.mobile.changePage("#main");
			}
			else
			{
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
		if(DrGlearning.embed)
		{
			if(!DrGlearning.embedImport)
			{
				$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Getting Course...')+'</p>' });
				DrGlearning.careerId=parseInt(DrGlearning.careerToEmbed,10);
				Loading.requestACareer(parseInt(DrGlearning.careerToEmbed,10));
			}
			else
			{
				$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Getting Course...')+'</p>' });
				
				DrGlearning.careerId=parseInt(DrGlearning.careerToEmbed,10);
				XD.receiveMessage(function(message){
					Dao.manageInMessage(message);
				}, parent_url);
				var parent_url = DrGlearning.embedImport;
				//console.log(parent_url);
				//console.log(parent);
				XD.postMessage({'action': 'getPlayerCode'}, parent_url, parent);
			}
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
        Dao.careersStore.all(function(arrCareers){
          var empty = true;
		      for(var i = 0; i<arrCareers.length;i++)
		      {
		        if(arrCareers[i].value.installed === false)
		        {
					var starHtml = "";
					var padHtml = "";
					if(arrCareers[i].value.career_type == "exam")
					{
						starHtml = "<img class='levelicon' src='resources/images/trophy_icon.png' height='15'>";
					}
					if(arrCareers[i].value.has_code)
					{
						padHtml = "<img class='levelicon' src='resources/images/padlock.png' height='15'>";
					}
		            empty = false;
			        var listdiv = document.createElement('li');
		        	listdiv.setAttribute('id','listdiv');
		        	listdiv.innerHTML = '<a id="careertoinstall" href="#dialogConfirmInstall" data-rel="dialog" data-href="'+
            	    arrCareers[i].key+
            	    '"><h1>'+
            	    arrCareers[i].value.name+starHtml+padHtml
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
			$('#careerDescription').html(career.value.description);
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
			if(career.value.career_type == "exam")
			{
				if(DrGlearning.levelId > 1)
				{
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
        var activities=[];
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
			            activities.push(arrActivities[i]);
					  }
		            }
		            if(empty)
		            {
                    $('#levelslist').append(
                      '<li><a href="#"><h1>'+
                      i18n.gettext('No Activities in this level...')+
                      '</h1><p>'+
                      '</p></a></li>');
		            }else
                    {
                        //sorting activities by level_order!
                        function compare(a,b) {
                          if (a.value.level_order < b.value.level_order)
                             return -1;
                          if (a.value.level_order > b.value.level_order)
                            return 1;
                          return 0;
                        }

                        activities.sort(compare);
                        for(var i = 0; i<activities.length;i++)
		                {
                            var listdiv = document.createElement('li');
                      		listdiv.setAttribute('id','listdiv');
						    if(activities[i].value.successful)
						    {
		                  		listdiv.innerHTML = '<a id="accessactivity" href="#" data-activity="'+
		                  	    activities[i].key+
		                  	    '"><h1>'+
		                  	    activities[i].value.name+
		                  	    '</h1>'+
							    '✓ Your best score: '+
							     activities[i].value.score+
							    '</a>';
						    }
						    else
						    {
		                  		listdiv.innerHTML = '<a id="accessactivity" href="#" data-activity="'+
		                  	    activities[i].key+
		                  	    '"><h1>'+
		                  	    activities[i].value.name+
		                  	    '</h1></a>';
			                }
				            $('#activitieslist').append(listdiv);
                        }
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
            Options: i18n.gettext("Options"),
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
            Yes: i18n.gettext("Yes"),
            No: i18n.gettext("No"),
            OK: i18n.gettext("OK"),
            AddCourses: i18n.gettext("Add Courses"),
			Undo: i18n.gettext("Undo"),
			After: i18n.gettext("After"),
			Before: i18n.gettext("Before"),
			CheckForUpdates: i18n.gettext("Update course"),
			UninstallCourse: i18n.gettext("Uninstall course"),
			UpdateAll: i18n.gettext("Update All"),
			MoreOptions: i18n.gettext("More Options"),
			NewUser: i18n.gettext("New User")
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
