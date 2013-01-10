var UserSettings = {
	careersToPreinstall:[],
	preinstallingIndex: 0,
	importedScores: null,
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
        /*var locale = view.down('selectfield[id=locale]').getValue();
        if (localStorage.locale !== locale) {
            if (locale === "ar")
            {
                localStorage.alignCls = 'rightalign';
            } else
            {
                localStorage.alignCls = 'leftalign';
            }
            localStorage.locale = locale;
            Ext.Msg.alert(i18n.gettext('Language changed'), i18n.gettext('You need to restart the app to see the changes.'), function () {

            });
        }*/
        if (changed)
        {
            this.updateUserSettings();
        }
    },
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
        var HOST = GlobalSettings.getServerURL();
        jQuery.ajax({
            url: HOST + '/api/v1/player/?format=json',
            dataType : 'json',
            data: {
                code: uniqueid,
                token: token,
                email: email,
                display_name: display_name
            },
            success: function (response) {
                console.log('User data sent');
            }
        });
    },
	importUser : function () {
        $.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Importing user data...')+'</p>' });
        var uniqueid =  $("#inputSync").val();
        var HOST = GlobalSettings.getServerURL();
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
                    console.log("Ext.Msg.alert(i18n.gettext('Unable to Import'), i18n.gettext('You typed an incorrect code'), Ext.emptyFn);");
					$.unblockUI();
                }
                else
                {
					Dao.careersStore.nuke();
					Dao.activitiesStore.nuke();
					Dao.userStore.save({key:'imported',value:true});
                    //localStorage.imported=true;
                    UserSettings.userDataReceived(response, opts);
                }
			    
            },
            failure : function () {
                console.log("Ext.Msg.alert(i18n.gettext('Unable to Import'), i18n.gettext('You typed an incorrect code'), Ext.emptyFn);");
			    $.unblockUI();
            }
       });
    },
	userDataReceived: function (response, opts) {
        var HOST = GlobalSettings.getServerURL();
        $.ajax({
            dataType:"json",
            url: HOST + '/api/v1/score/?format=json',
            data: {
                player: response.id
            },
            success: function (response, opts) {
                UserSettings.collectCareersFromScores(response, opts);
            },
            failure : function () {
                $.unblockUI();
                console.log(i18n.gettext('Unable to Import'));
            }
        });
		Dao.userStore.save({key:'uniqueid',value:response.code});
        //localStorage.uniqueid = response.code;
		Dao.userStore.save({key:'token',value:response.token});
        //localStorage.token = response.token;
		Dao.userStore.save({key:'display_name',value:response.display_name});
        //localStorage.display_name = response.display_name;
		Dao.userStore.save({key:'email',value:response.email});
        //localStorage.email = response.email;
        $("#username").val(response.display_name);
        $("#email").val(response.email);
    },
	collectCareersFromScores: function (response, objects) {
        UserSettings.careersToPreinstall = [];
        for (var x in response.objects) {
            if (UserSettings.careersToPreinstall.indexOf(response.objects[x].career_id) === -1)
            {
                UserSettings.careersToPreinstall.push(response.objects[x].career_id);
            }
        }
        UserSettings.preinstallingIndex = 0;
        UserSettings.importedScores = response.objects;
        UserSettings.preinstall();
    },
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
                        size: career.size,
                        career_type: career.career_type,
                        contents: career.contents.resource_uri
                    };
                    Dao.careersStore.save({key:careerModel.id,value:careerModel});
                    UserSettings.retrieving = false;
                    Dao.preinstallCareer(careerModel);
                },
                failure: function () {
                	$.unblockUI();
					console.log('error while downloading career');
                    UserSettings.retrieving = false;
                }
            });
        } else 
        {
          
            for (var x in UserSettings.importedScores)
            {
                Dao.activityPlayed(UserSettings.importedScores[x].activity_id, UserSettings.importedScores[x].is_passed, UserSettings.importedScores[x].score, true);
            }

        	$.unblockUI();
            console.log("successfull import!");
            
        }
    },
}
