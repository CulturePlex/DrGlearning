var Visual = {
    activity: null,
    time: null,
    secondtemp: null,
    score: null,
    setup: function(){
        $(document).on('click', '#visualSelectAnswer',function(e) {
          Visual.checkAnswer($(this).attr("data-answer"));
        });
        $(document).on('click', '#skipButtonVisual',function(e) {
          console.log('caca');
          Visual.skip();
        });
        $(document).on('click', '#backFromVisual',function(e) {
          if(Visual.secondtemp)
          {
              clearInterval(Visual.secondtemp);
          }
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
				$('#visualImage').load(function() {
				  $.unblockUI();
				}).attr("src", "");
				$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Activity...')+'</p>' });
				$('#visualImage').load(function() {
				  $.unblockUI();
				  	Visual.secondtemp = setInterval(function () 
					{
						console.log('contando');
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
            console.log(activity);
            Visual.time = activity.value.time;
            $('#timeVisual').empty();
            $('#timeVisual').append(Visual.time + " sec");
            $('#skipButtonVisual').show();
            $('#timeVisual').show();
            
	      })
	  },
    showSeconds: function ()
    {
     
//        if (Visual.isStopped === false && Visual.loading === false) 
//        {
            
            Visual.time--;
            $('#timeVisual').empty();
            $('#timeVisual').append(Visual.time + " sec");
            if (Visual.time < 0) {
                clearInterval(Visual.secondtemp);
                Visual.showAnswers();
                Visual.score=50;
            }
//        }
    },
    skip: function ()
    {
        clearInterval(Visual.secondtemp);
        Visual.showAnswers();
        Visual.score = parseInt(Visual.time + 1 * 100 / Visual.activity.value.time, 10);
		if (Visual.score > 100)
		{
			Visual.score = 100;
		}
    },
    showAnswers: function () 
    {
        $('#visualAnswersList').show();
        console.log($('#visualImage'));
        $('#visualImage').attr("src", GlobalSettings.getServerURL()+"/media/"+Visual.activity.value.obfuscated_image_url);
        $('#skipButtonVisual').hide();
        $('#timeVisual').hide();
    
    },
	  checkAnswer: function(answer){
        if (Visual.score < 50)
        {
            Visual.score = 50;
        }
        console.log(Visual.activity);
	      if(Visual.activity.value.correct_answer === answer)
	      {
            $('#dialogText').html(Visual.activity.value.reward+". "+i18n.gettext('Score')+":"+Visual.score);
			Dao.activityPlayed(Visual.activity.value.id, true, Visual.score);
	      }
	      else
	      {
  	         $('#dialogText').html(Visual.activity.value.penalty);
			Dao.activityPlayed(Visual.activity.value.id, false, Visual.score);
			Workflow.toLevel = true;
	      }
	  }
}
