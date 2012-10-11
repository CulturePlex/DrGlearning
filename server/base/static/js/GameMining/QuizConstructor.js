var QuizConstructor = {
  createQuiz: function(graph_type){
    var attrib;
    var value;
    var correct;

    var edges = GraphEditor.getGraphEdgesJSON();
    var nodes = GraphEditor.getGraphNodesJSON();

    var answers=[];

    var top = parseInt(Math.random(10)*edges.length);
    if(graph_type == "FREEBASE_GRAPH")
    {
        console.log('_'+edges[top].type.replace(/\(.+\)/,'')+'_');
        while( edges[top].type.replace(/\(.+\)/,'') === 'Object name ' || 
               edges[top].type.replace(/\(.+\)/,'') === 'class-instance' ||
               edges[top].type.replace(/\(.+\)/,'') === 'Superclass-Subclass' ||
               edges[top].type.replace(/\(.+\)/,'') === 'Hide level' ||
               edges[top].type.replace(/\(.+\)/,'') === 'Role class' ||
               edges[top].type.replace(/\(.+\)/,'') === 'Software ' ||
               edges[top].type.replace(/\(.+\)/,'') === 'Association type' ||
               edges[top].type.replace(/\(.+\)/,'') === 'Role'
               )
        {
            
            top = parseInt(Math.random(10)*edges.length);
        }
    }
    //Adding question and correct answer
    attrib = edges[top].type;
    value = edges[top].target;
    correct = edges[top].source;
    
    var counter = 0;
    var index = 0;
    //Adding incorrect answers
    while(counter < 3 && index < edges.length)
    {
        if ( edges[index].type === attrib && edges[index].source !== correct)
        {
            answers[counter] = edges[index].source;
            counter++;
        }
        index++;
    }
    answers[3] = correct;
    //Translating FB terms
    if(graph_type == "FREEBASE_GRAPH")
    {
        if(attrib === 'class-instance')
        {
            attrib = 'Is';
        }
    }
    attrib = attrib.replace(/\(.+\)/,'');
    value = value.replace(/\(.+\)/,'');
    if(graph_type == "FREEBASE_GRAPH")
    {
        var question = 'Which of the followings has ' + value +' as ' + attrib +'?';
    }
    if(graph_type == "CULTUREPLEX_GRAPH")
    {
        var question = 'Which of the following is ' + attrib + ' ' + value +'?';
    }
    var quiz = '<div>' + 'Quiestion: ' + question + '</div>';
    
    //Deleting duplicated answers
    var j = 0;
    console.log(answers);
    while ( j < answers.length )
    {
        if ($.inArray(answers[j], answers)!== j)
        {
            answers.splice(j,2);
            console.log('repetido');
        }
        j++;
    }
    console.log(answers);
    //Mixing answers
    var answersmixed = [];
    j = 0;
    while ( j < answers.length )
    {
        var r = parseInt(Math.random(10)*answers.length);
        if ( typeof(answersmixed[r] ) === "undefined")
        {
            answersmixed[r] = answers[j];
            j++;
        }
    }
    
    for (var i = 0 ; i < answers.length; i++)
    {
        quiz += '<div>' + 'Answer ' + i + ': ' + answersmixed[i] + '</div>';
    }
    
    
    quiz += '<div>' + 'Correct Answer :' + correct + '</div>';
    $('.quizViewer').empty();
    $('.quizViewer').append(quiz);
  }
}

