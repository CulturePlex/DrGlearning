var Visual = {
    activity: null,
    setup: function(){
        $(document).on('click', '#visualSelectAnswer',function(e) {
          Visual.checkAnswer($(this).attr("data-answer"));
        });
	  },
    refresh: function(){
        $('#visualAnswersList').empty();
        console.log('borrando');
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Visual.activity = activity;
            $('#visualActivityQuery').html(activity.value.query);
            $('#visualActivityName').html(activity.value.name);
            if(activity.value.image_url)
            {
                $('#visualImage').attr("src", GlobalSettings.getServerURL()+"/media/"+activity.value.image_url);
            }
            for(var i = 0; i<activity.value.answers.length;i++)
            {
	              var listdiv = document.createElement('li');
              	listdiv.setAttribute('id','listdiv');
              	listdiv.innerHTML = '<a id="visualSelectAnswer" href="#dialog" data-rel="dialog" data-answer="'+
              	    activity.value.answers[i]+
              	    '"><h1>'+
              	    activity.value.answers[i]+
              	    '</h1></a>';
	              $('#visualAnswersList').append(listdiv);
            }
            $('#visualAnswersList').listview("refresh");
	      });
	  },
	  checkAnswer: function(answer){
        console.log(Visual.activity);
	      if(Visual.activity.value.correct_answer === answer)
	      {
            $('#dialogText').html(Visual.activity.value.reward+". Score:100");
	      }
	      else
	      {
  	         $('#dialogText').html(Visual.activity.value.penalty);
	      }
	  }
}
