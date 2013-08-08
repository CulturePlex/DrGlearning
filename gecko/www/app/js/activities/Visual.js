//Visual Activity Controller
var Visual = {
    //Var to keep the activity model
    activity: null,
    //Var to save time for the user to finish
    time: null,
    //Interval variable
    secondtemp: null,
    //Score variable
    score: null,
    //Flag to know if the clock is paused (when user click in info button) 
    isStoped: false,
    //Flag to know if the user has watched the activity info (it shows autmatically first time)
    helpViewed: false,
    //Method to setup visual activity (set up button handlers)
    setup: function(){
        $(document).on('click', '#visualSelectAnswer',function(e) {
          Visual.checkAnswer($(this).attr("data-answer"));
        });
        $(document).on('click', '#skipButtonVisual',function(e) {
          Visual.skip();
        });
        $(document).on('click', '#backFromVisual',function(e) {
          if(Visual.secondtemp)
          {
              clearInterval(Visual.secondtemp);
          }
        });
      },
     //Method to refresh visual activity (load activity model)
     refresh: function(){
        $('#visualAnswersList').empty();
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){
            Visual.activity = activity;
            $('#visualActivityQuery').html(activity.value.query);
            $('#visualActivityName').html(activity.value.name);
            if(activity.value.image_url)
            {
                $('#visualImage').load(function() {
                  $.unblockUI();
                }).attr("src", "");
                $.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Activity...')+'</p>' });
                $('#visualImage').load(function() {
                  $.unblockUI();
                    clearInterval(Visual.secondtemp);
                      Visual.secondtemp = setInterval(function ()
                    {
                        Visual.showSeconds();
                    }, 1000);
                }).attr("src", GlobalSettings.getServerURL()+"/media/"+activity.value.image_url);
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
            $('#visualAnswersList').hide();
            Visual.time = activity.value.time;
            $('#timeVisual').empty();
            $('#timeVisual').append(Visual.time + " sec");
            $('#skipButtonVisual').show();
            $('#timeVisual').show();
            if(!Visual.helpViewed)
            {
                $('#infoVisual').click();
                Visual.helpViewed = true;
            }

          });
      },
     //Method to refresh seconds
     showSeconds: function ()
     {

//        if (Visual.isStopped === false && Visual.loading === false)
//        {
            if(!Visual.isStoped)
            {
                Visual.time--;
            }
            $('#timeVisual').empty();
            $('#timeVisual').append(Visual.time + " sec");
            if (Visual.time < 0) {
                clearInterval(Visual.secondtemp);
                Visual.showAnswers();
                Visual.score=50;
            }
//        }
    },
    //Method to skip time
    skip: function ()
    {
        clearInterval(Visual.secondtemp);
        Visual.showAnswers();
        Visual.score = parseInt((Visual.time + 1)* 100 / Visual.activity.value.time, 10);
        if (Visual.score > 100)
        {
            Visual.score = 100;
        }
    },
    //Method to show possible answers
    showAnswers: function ()
    {
        $('#visualAnswersList').show();
        $('#visualImage').attr("src", GlobalSettings.getServerURL()+"/media/"+Visual.activity.value.obfuscated_image_url);
        $('#skipButtonVisual').hide();
        $('#timeVisual').hide();

    },    
    //Method to check if selected answer is the correct one
    checkAnswer: function(answer){
		if (Visual.score < 50)
		{
		    Visual.score = 50;
		}
		  if(Visual.activity.value.correct_answer.trim() === answer.trim())
		  {
		    $('#dialogText').html(Visual.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": "+Visual.score);
		    Dao.activityPlayed(Visual.activity.value.id, true, Visual.score);
		  }
		  else
		  {
		       $('#dialogText').html(Visual.activity.value.penalty);
		    Dao.activityPlayed(Visual.activity.value.id, false, 0);
		    Workflow.toLevel = true;
		  }
	  }
};
