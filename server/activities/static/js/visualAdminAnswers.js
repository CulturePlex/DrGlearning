if ($ == undefined) {
  $ = django.jQuery;
}

$(document).ready(function(){
    var DEBUG = false;
    
    function getJSON(){
        var json = $('#id_answers').text();
        if (!json){
            return [];
        } else {
            return JSON.parse(json);
        }

    }
    
    //Hide original widget
    if (!DEBUG){
        $('#id_answers').hide();
    }

    //New widget elements construction    
    $('#id_answers').before('<div id="answer-widget"></div>');
    $('#answer-widget').append('<button id="add-answer" type="button">Add answer</button>')
    $('#answer-widget').append('<button id="remove-answer" type="button">Remove answer</button>')
    $('#answer-widget').append('<ol id="answer-list"></ol>')
    
    //Add answer function
    $('#add-answer').click(function(){
    var newAnswer = prompt('Enter answer');
    if (newAnswer){
        $('#answer-list').append('<li>'+newAnswer+'</li>');
        var json = getJSON();
        json.push(newAnswer);
        $('#id_answers').text(JSON.stringify(json));
    }
    });
    
    //Remove answer function
    $('#remove-answer').click(function(){
        var answerToRemove = prompt('Enter answer number to delete')-1;
        var json = getJSON();
        if (answerToRemove<json.length){
            json.splice(answerToRemove, 1);
        }
        $('#id_answers').text(JSON.stringify(json));
        $('#answer-list').remove();
        $('#answer-widget').append('<ol id="answer-list"></ol>')
        for(var i=0;i<json.length;i++){
            $('#answer-list').append('<li>'+json[i]+'</li>');
        }
    })

    //Populate with existing answers
    var existingAnswers = getJSON();
    $.each(existingAnswers, function(answer){
      $('#answer-list').append('<li>'+answer+'</li>');
    });

});
