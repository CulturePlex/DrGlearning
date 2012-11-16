var Relational = {
    activity: null,
    score: null,
    graphNodes: null,
	graphEdges: null,
	constraints: null,
	path_limit: null,
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
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Relational.activity = activity;
	    	var blankOption = i18n.gettext("Choose");
            var playerPath = [];
            var playerEdgePath = [];
            var pathStart, pathGoal, pathPosition;
            var option;
        //    var allConstraintsPassed = false;
            var score = 20;
            //Import graph nodes and edges from database
            Relational.graphNodes = activity.value.graph_nodes;
            Relational.graphEdges = activity.value.graph_edges;
            Relational.constraints = activity.value.constraints;
            Relational.path_limit = activity.value.path_limit;
            $('#relationalActivityQuery').html(activity.value.query);
            $('#relationalActivityName').html(activity.value.name);
		});
	  },
    showSeconds: function ()
    {
     
//        if (Visual.isStopped === false && Visual.loading === false) 
//        {
            
            Visual.time--;
            $('#timeVisual').empty();
            $('#timeVisual').append(Visual.time + "sec");
            if (Visual.time < 0) {
                clearInterval(Visual.secondtemp);
                Visual.showAnswers();
                Visual.score=20;
            }
//        }
    },
    skip: function ()
    {
        clearInterval(Visual.secondtemp);
        Visual.showAnswers();
        Visual.score = parseInt(Visual.time * 100 / Visual.activity.value.time, 10);
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
        if (Visual.score < 20)
        {
            Visual.score = 20;
        }
        console.log(Visual.activity);
	      if(Visual.activity.value.correct_answer === answer)
	      {
            $('#dialogText').html(Visual.activity.value.reward+". "+i18n.gettext('Score')+":"+Visual.score);
	      }
	      else
	      {
  	         $('#dialogText').html(Visual.activity.value.penalty);
	      }
	  }
}
