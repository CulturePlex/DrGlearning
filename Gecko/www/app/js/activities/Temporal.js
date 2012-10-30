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
                $('#temporalImage').attr("src", GlobalSettings.getServerURL()+"/media/"+activity.value.image_url);
            }
            Temporal.activity = activity;
            $('#temporalActivityQuery').html(activity.value.query);
            $('#temporalActivityName').html(activity.value.name);
            
	      });
	  },
	  checkAfter: function(e){
        if (Temporal.activity.value.image_datetime > Temporal.activity.value.query_datetime) {
            $('#dialogText').html(Temporal.activity.value.reward+". Score:100");
        }
        else 
        {
  	         $('#dialogText').html(Temporal.activity.value.penalty);
        }
	  },
	  checkBefore: function(e){
        if (Temporal.activity.value.image_datetime > Temporal.activity.value.query_datetime) {
  	        $('#dialogText').html(Temporal.activity.value.penalty);
        }
        else 
        {
            $('#dialogText').html(Temporal.activity.value.reward+". Score:100");
        }
	  }
}
