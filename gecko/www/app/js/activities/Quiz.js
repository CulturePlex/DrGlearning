var Quiz = {
    activity: null,
    helpViewed: false,
    setup: function(){
        $(document).on('click', '#quizSelectAnswer',function(e) {
          Quiz.checkAnswer($(this).attr("data-answer"));
        });
      },
    refresh: function(){
        $('#quizAnswersList').empty();
        console.log('borrando');
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){
            Quiz.activity = activity;
            $('#quizActivityQuery').html(activity.value.query);
            $('#quizActivityName').html(activity.value.name);
            for(var i = 0; i<activity.value.answers.length;i++)
            {
                  var listdiv = document.createElement('li');
                  listdiv.setAttribute('id','listdiv');
                  listdiv.innerHTML = '<a id="quizSelectAnswer" data-answer="'+
                      activity.value.answers[i]+
                      '"><h1>'+
                      activity.value.answers[i]+
                      '</h1></a>';
                  $('#quizAnswersList').append(listdiv);
            }
            $('#quizAnswersList').listview("refresh");
        });
        if(!Quiz.helpViewed)
        {
            $('#infoQuiz').click();
            Quiz.helpViewed = true;
        }
      },
      checkAnswer: function(answer){
        $.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});
        console.log(Quiz.activity);
          if(Quiz.activity.value.correct_answer.trim() === answer.trim())
          {
            $('#dialogText').html(Quiz.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": 100");
            Dao.activityPlayed(Quiz.activity.value.id, true, 100);
          }
          else
          {
               $('#dialogText').html(Quiz.activity.value.penalty);
            Dao.activityPlayed(Quiz.activity.value.id, false, 0);
            Workflow.toLevel = true;
          }
      }
};
