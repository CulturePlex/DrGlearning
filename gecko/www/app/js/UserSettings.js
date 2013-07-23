//User Settings Controller
var UserSettings = {
    //Array Variable to save the careers necessary to preinstall in user import process
	careersToPreinstall:[],
    //Index when preinstalling courses
	preinstallingIndex: 0,
	importedScores: null,
    //Temp variable to keep the course model in ebebed mode
	careerTemp: null,
    //Method to save seting in user setting view, if something has changed, save it!
    saveSettings : function () {
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
        var usernameField = $('#username').val();
        var emailField = $('#email').val();
        var changed = false;
        if (emailField !== email || usernameField !== display_name)
        {
            changed = true;
			Dao.userStore.save({key:'display_name',value:usernameField});
            //localStorage.display_name = usernameField;
			Dao.userStore.save({key:'email',value:emailField});
            //localStorage.email = emailField;
        }
        var locale = $('#locale').val();
		if (localStorage.locale !== locale) {
            /*if (locale === "ar")
            {
                localStorage.alignCls = 'rightalign';
            } else
            {
                localStorage.alignCls = 'leftalign';
            }*/
            localStorage.locale = locale;
			$('#dialogText').html(i18n.gettext("Language changed. You need to restart the app to see the changes."));
			Workflow.toMain = true;
			$.mobile.changePage("#dialog");
        }
		else
		{
			$('#dialogText').html(i18n.gettext("Settings changes saved"));
			Workflow.toMain = true;
			$.mobile.changePage("#dialog");
		}		
        if (changed)
        {
            this.updateUserSettings();
        }
    },
    //Method to set the user setting in settings view with the information kept in user store
    updateUserSettings: function () {
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
		var options;
		Dao.userStore.get('options',function(me)
		{
			options = (me !== null) ? me.value : undefined;
		});
        var HOST = GlobalSettings.getServerURL();
        jQuery.ajax({
            url: HOST + '/api/v1/player/?format=json',
            dataType : 'json',
            data: {
				callback: "a",
                code: uniqueid,
                token: token,
                email: email,
                display_name: display_name,
				options: JSON.stringify(options)
            },
            success: function (response) {
            }
        });
    },
    //Method to import an user to the system
	importUser : function (player_code) {
        //Showing panel information
        $.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Importing user data...')+'</p>' });
		var uniqueid;
        //Checking if player_code is passed to import in embebed mode or the system should get it from the input
		if(typeof player_code != "object")
		{
			uniqueid = player_code;
		}
		else
		{
			uniqueid = $("#inputSync").val();
		}
        var HOST = GlobalSettings.getServerURL();
        //Getting user information from server in order to be imported to the system
        $.ajax({
            url: HOST + '/api/v1/player/?format=jsonp',
            data: {
                code: uniqueid,
                import: true,
            },
			dataType:"jsonp",
            success: function (response, opts) {
                if (response.token == null)
                {
                    //Error
                    $('#dialogText').html(i18n.gettext("Unable to import. You Typed an incorrect code!"));
                    Workflow.toStarting = false;
		       
					Workflow.toSettings = true;
					$.mobile.changePage("#dialog");
					$.unblockUI();
                }
                else
                {
                    //User code correct! Deleting all previous information about user in the system
					Dao.careersStore.nuke();
					Dao.activitiesStore.nuke();
					Dao.userStore.save({key:'imported',value:true});
                    //localStorage.imported=true;
                    UserSettings.userDataReceived(response, opts);
                }
			    
            },
            error : function () {
                $('#dialogText').html(i18n.gettext("Unable to import. You Typed an incorrect code!"));
                Workflow.toStarting = false;
		       
                Dao.userStore.get('token',function(me)
		        {
			        token = (me !== null) ? me.value : '';
		        });
                if(token=='')
                {
				    Workflow.toStarting = true;
                }else{
				    Workflow.toMain = true;
                }
				$.mobile.changePage("#dialog");
			    $.unblockUI();
            }
       });
    },

    //Method created to manage user data received when importing 
	userDataReceived: function (response, opts) {
		Dao.userStore.save({key:'id',value:response.id});
		Dao.userStore.save({key:'uniqueid',value:response.code});
        //localStorage.uniqueid = response.code;
		Dao.userStore.save({key:'token',value:response.token});
        //localStorage.token = response.token;
		Dao.userStore.save({key:'display_name',value:response.display_name});
        //localStorage.display_name = response.display_name;
		Dao.userStore.save({key:'email',value:response.email});

		Dao.userStore.save({key:'options',value:response.options});
		UserSettings.collectCareers(response, opts);
        //localStorage.email = response.email;
		$("#username").val(response.display_name);
        $("#username").val(response.display_name);
        $("#email").val(response.email);
    },

    //Method created to collect the courses asociated with the user who is being imported
 	collectCareers: function (response, objects) {
		console.log(response);
        this.careersToPreinstall = response.options.careers;
		console.log(this.careersToPreinstall);
        this.preinstallingIndex = 0;
		console.log(response.objects);
		if(this.careersToPreinstall)
		{	
			if(!DrGlearning.embedImport)
			{
				this.preinstall();
			}
			else
			{
				console.log('ola');
				Loading.requestACareer(parseInt(DrGlearning.careerToEmbed,10));
			}
		}
		else
		{
			if(DrGlearning.embedImport)
			{
				Loading.requestACareer(parseInt(DrGlearning.careerToEmbed,10));
			}
			else
			{
                var name = '';
                Dao.userStore.get('display_name',function(me)
		        {
			        name = (me !== null) ? me.value : '';
		        });
                console.log(name);
                if(Workflow.starting)
                {
                  $('#dialogText').html(i18n.gettext("Account successfully imported, "+ name +" welcome to Dr. Glearning."));
                }
			    else
			    {
                  $('#dialogText').html(i18n.gettext("Account successfully imported!"));
                }
		        Workflow.toStarting = false;
		        Workflow.toMain = true;
                $.mobile.changePage("#dialog");				
		    	$.unblockUI();
	        	console.log("successfull import!");
			}
		}
    },
    //Deprecated method
	collectCareersFromScores: function (response, objects) {
        UserSettings.careersToPreinstall = [];
        for (var x in response.objects) {
            if (UserSettings.careersToPreinstall.indexOf(response.objects[x].career_id) === -1)
            {
                UserSettings.careersToPreinstall.push(response.objects[x].career_id);
            }
        }
        UserSettings.preinstallingIndex = 0;
        UserSettings.preinstall();
    },
    //Method to preinstall a course when importing, getting only the information, not the activities
	preinstall: function () {
      //Downloading career Data:
        if (parseInt(UserSettings.preinstallingIndex, 10) < parseInt(UserSettings.careersToPreinstall.length, 10))
        {
      		var HOST = GlobalSettings.getServerURL();
            $.ajax({
				dataType:"json",
                url: HOST + "/api/v1/career/" + UserSettings.careersToPreinstall[UserSettings.preinstallingIndex] + "/?format=json",
                success: function (response, opts) {
                    var career = response;
                    var careerModel;
                   
                    var activities = [];
                    for (var cont in career.activities) {
                        activities[cont] = career.activities[cont].full_activity_url;
                    }
					careerModel = {
						activities: activities,
                        id : parseInt(career.id, 10),
                        customId : parseInt(career.id, 10),
                        levels : career.levels,
                        negative_votes : career.negative_votes,
                        positive_votes : career.positive_votes,
                        name : career.name,
                        description : career.description,
                        creator : career.creator,
                        resource_uri : career.resource_uri,
                        knowledges : career.knowledges,
                        timestamp : career.timestamp,
                        installed : false,
                        started : false,
                        update : false,
						has_code: career.has_code,
                        size: career.size,
                        career_type: career.career_type,
                        contents: career.contents.resource_uri
                    };
                    Dao.careersStore.save({key:careerModel.id,value:careerModel});
                    UserSettings.retrieving = false;
					if(DrGlearning.embed && career.has_code)
					{
						console.log(career.has_code);
						UserSettings.careerTemp = careerModel;
						XD.postMessage({'action': 'getCourseCode','params':{'id':parseInt(career.id, 10)}}, DrGlearning.embedImport, parent);

					}
					else
					{
	                    Dao.preinstallCareer(careerModel);				
					}
                },
                failure: function () {
                	$.unblockUI();
					console.log('error while downloading career');
                    UserSettings.retrieving = false;
                }
            });
        } else 
        {
          
            
			if(DrGlearning.embedImport)
			{
				Loading.requestACareer(parseInt(DrGlearning.careerToEmbed,10));
				
			}
			else
			{
                var name = '';
                Dao.userStore.get('display_name',function(me)
		        {
			        name = (me !== null) ? me.value : '';
		        });
                if(Workflow.starting)
                {
                  $('#dialogText').html(i18n.gettext("Account successfully imported, "+ name +" welcome to Dr. Glearning."));
                }
			    else
			    {
                  $('#dialogText').html(i18n.gettext("Account successfully imported!"));
                }
	            Workflow.toStarting = false;
		        Workflow.toMain = true;
                $.mobile.changePage("#dialog");				
		    	$.unblockUI();
		        console.log("successfull import!");
			}
            
        }
    },
}
