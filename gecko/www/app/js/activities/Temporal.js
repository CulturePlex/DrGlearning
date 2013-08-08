//Temporal Activity Controller
var Temporal = {
    //Var to keep the activity model
    activity: null,
    //Flag to know if the user has watched the activity info (it shows autmatically first time)
	helpViewed: false,
    //Method to setup temporal activity (set up button handlers)
    setup: function(){
        $(document).on('click', '#before',function(e) {
          Temporal.checkBefore(e);
        });
        $(document).on('click', '#after',function(e) {
          Temporal.checkAfter(e);
        });
		
	  },
    //Method to refresh temporal activity (load question and answers)
    refresh: function(){
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            if(activity.value.image_url)
            {
				$('#temporalImage').load(function() {
				  $.unblockUI();
				}).attr("src", "");
				$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Activity...')+'</p>' });
				$('#temporalImage').load(function() {
				  $.unblockUI();
				}).attr("src", GlobalSettings.getServerURL()+"/media/"+activity.value.image_url);
            }
            Temporal.activity = activity;
            $('#temporalActivityQuery').html(activity.value.query);
            $('#temporalActivityName').html(activity.value.name);
            
	      });
		if(!Temporal.helpViewed)
		{
			$('#infoTemporal').click();
			Temporal.helpViewed = true;
		}
	  },
    //Method invoked when user click on after button
	checkAfter: function(e){
        if (Temporal.activity.value.image_datetime > Temporal.activity.value.query_datetime) {
            $('#dialogText').html(Temporal.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": 100");
			Dao.activityPlayed(Temporal.activity.value.id, true, 100);
        }
        else 
        {
  	         $('#dialogText').html(Temporal.activity.value.penalty);
			Dao.activityPlayed(Temporal.activity.value.id, false, 0);
			Workflow.toLevel = true;
        }
	  },
    //Method invoked when user click on before button
	checkBefore: function(e){
        if (Temporal.activity.value.image_datetime > Temporal.activity.value.query_datetime) {
  	        $('#dialogText').html(Temporal.activity.value.penalty);
			Dao.activityPlayed(Temporal.activity.value.id, false, 0);
			Workflow.toLevel = true;
        }
        else 
        {
            $('#dialogText').html(Temporal.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": 100");
			Dao.activityPlayed(Temporal.activity.value.id, true, 100);
        }
	  }
}
