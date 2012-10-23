var DrGlearning = {
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
        //Setting up buttons
        $('#addcourses').click(function(){
            $( '#addCourses' ).live( 'pageinit',function(event){
                Loading.careersRequest("","All");
            });
        });
        
        $('#backfromsettings').click(function(){
          UserSettings.saveSettings();
        });
        
        $('#refreshMain').click(function(){
            console.log('asdasd');
            DrGlearning.refreshMain();
        });
        $(document).on('click', '#careertoinstall',function(e) {
            Dao.installCareer($(this));
            return false;
        });
    },
    refreshMain: function(){
        console.log('holasssss');
        Dao.careersStore.all(function(arrCareers){
		      for(var i = 0; i<arrCareers.length;i++)
		      {
			      console.log(arrCareers);
			      var listdiv = document.createElement('li');
          	listdiv.setAttribute('id','listdiv');
          	console.log(arrCareers[i]);
          	listdiv.innerHTML = arrCareers[i].value.name;
			      $('#careerslist').append(listdiv);
		      }
		      $('#careerslist').listview("refresh");
	      });
	  }
}
