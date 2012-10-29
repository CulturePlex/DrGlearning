var Temporal = {
    activity: null,
    setup: function(){
        $(document).on('click', '#quizSelectAnswer',function(e) {
          Quiz.checkAnswer($(this).attr("data-answer"));
        });
	  },
    refresh: function(){
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            console.log(activity.value.image_url);
            Temporal.activity = activity;
            $('#temporalActivityQuery').html(activity.value.query);
	      });
	  },
	  checkAnswer: function(answer){
        console.log(Quiz.activity);
	      if(Quiz.activity.value.correct_answer === answer)
	      {
            $('#dialogText').html(Quiz.activity.value.reward+". Score:100");
	      }
	      else
	      {
  	         $('#dialogText').html(Quiz.activity.value.penalty);
	      }
	  }
}
