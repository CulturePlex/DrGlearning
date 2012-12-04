var Temporal = {
    activity: null,
    setup: function(){
        $(document).on('click', '#before',function(e) {
          Temporal.checkBefore(e);
        });
        $(document).on('click', '#after',function(e) {
          Temporal.checkAfter(e);
        });
		
	  },
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
			console.log($('#temporalImage'));
            Temporal.activity = activity;
            $('#temporalActivityQuery').html(activity.value.query);
            $('#temporalActivityName').html(activity.value.name);
            
	      });
	  },
	checkAfter: function(e){
        if (Temporal.activity.value.image_datetime > Temporal.activity.value.query_datetime) {
            $('#dialogText').html(Temporal.activity.value.reward+". "+i18n.gettext('Score')+":100");
			Dao.activityPlayed(Temporal.activity.value.id, true, 100);
        }
        else 
        {
  	         $('#dialogText').html(Temporal.activity.value.penalty);
			Dao.activityPlayed(Temporal.activity.value.id, false, 0);
			Workflow.toLevel = true;
        }
	  },
	checkBefore: function(e){
        if (Temporal.activity.value.image_datetime > Temporal.activity.value.query_datetime) {
  	        $('#dialogText').html(Temporal.activity.value.penalty);
			Dao.activityPlayed(Temporal.activity.value.id, false, 0);
			Workflow.toLevel = true;
        }
        else 
        {
            $('#dialogText').html(Temporal.activity.value.reward+". "+i18n.gettext('Score')+":100");
			Dao.activityPlayed(Temporal.activity.value.id, true, 100);
        }
	  }
}
