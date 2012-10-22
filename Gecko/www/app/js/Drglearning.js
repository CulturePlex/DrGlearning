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
          Loading.careersRequest("","All");
        });
        
        $('#backfromsettings').click(function(){
          UserSettings.saveSettings();
        });
        
        /*var playerStore = new Lawnchair({name:'player'}, function(e) {
          console.log('Player Storage Open');
        });
        // create an object
        playerStore.get('uniqueid', function(me) {
          console.log(me);
          if(me === undefined)
          {
            var digest;
            if (GlobalSettings.isDevice()) {
                digest = Loading.SHA1(window.device.uuid + " " + new Date().getTime());
            } else {
                digest = Loading.SHA1("test" + " " + new Date().getTime());
            }
            var me = {key:'uniqueid',value:digest};
            console.log("Creating User");
            playerStore.save(me);
          }
        });*/

      //jQuery.ajax( this.getServerURL() + "/api/v1/player/?format=jsonp" );
    }
}
