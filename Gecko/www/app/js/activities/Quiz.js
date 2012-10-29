var Quiz = {
    activity: null,
    setup: function(){
        $(document).on('click', '#quizSelectAnswer',function(e) {
          Quiz.checkAnswer($(this).attr("data-answer"));
        });
	  },
    refresh: function(){
        $('#quizanswerslist').empty();
        console.log('borrando');
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Quiz.activity = activity;
            $('#quizActivityQuery').html(activity.value.query);
            for(var i = 0; i<activity.value.answers.length;i++)
            {
	              var listdiv = document.createElement('li');
              	listdiv.setAttribute('id','listdiv');
              	listdiv.innerHTML = '<a id="quizSelectAnswer" href="#dialog" data-rel="dialog" data-answer="'+
              	    activity.value.answers[i]+
              	    '"><h1>'+
              	    activity.value.answers[i]+
              	    '</h1></a>';
	              $('#quizAnswersList').append(listdiv);
            }
            $('#quizAnswersList').listview("refresh");
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
