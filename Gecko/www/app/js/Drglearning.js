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
        
        //Setting up pageinits
        $( '#addCourses' ).live( 'pagebeforeshow',function(event){
            console.log('lalo');
            DrGlearning.refreshAddCareers();
        });
        
        $( '#main' ).live( 'pagebeforeshow',function(event){
            console.log('lala');
           DrGlearning.refreshMain();
        });
        
        //Setting up buttons
        $('#backfromsettings').click(function(){
          UserSettings.saveSettings();
        });
        
        $(document).on('click', '#careertoinstall',function(e) {
            Dao.installCareer($(this));
            return false;
        });
        
        //Refreshing installed careers
        DrGlearning.refreshMain();
    },
    refreshMain: function(){
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
              $('#addcareerslist').listview('refresh');
		          Loading.careersRequest("","All");
		      }
		      $('#addcareerslist').listview("refresh");
	      });
	  },

}
