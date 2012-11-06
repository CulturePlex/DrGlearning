var Linguistic = {
    activity: null,
    time: null,
    secondtemp: null,
    score: null,
    setup: function(){
        $(document).on('click', '#tryLinguistic',function(e) {
          //Linguistic.Try();
        });
        $(document).on('click', '#solveLinguistic',function(e) {
          //Linguistic.Solve();
        });
	  },
    refresh: function(){
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Visual.activity = activity;
            $('#linguisticActivityQuery').html(activity.value.query);
            $('#linguisticActivityName').html(activity.value.name);
            if(activity.value.image_url)
            {
                $('#linguisticImage').attr("src", GlobalSettings.getServerURL()+"/media/"+activity.value.image_url);
            }
	      })
	  }
}
