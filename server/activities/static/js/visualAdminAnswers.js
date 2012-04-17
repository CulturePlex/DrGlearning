if ($ == undefined) {
  $ = django.jQuery;
}

function getJSON(){
  var json = $('#id_answers').text();
  if (!json){
    return [];
  } else {
    return JSON.parse(json);
  }

}

//Format answer and grappelli delete link
function formatAnswer(answer){
  var index = $('#answer-list > li').size();
  var element = $('<li>').text(answer);
  element.append($('<ul class="actions">')
    .append($('<li class="delete-link">')
      .append($('<a onClick="removeAnswer(' + index + ')">').text("Delete"))));
  return element;
};

//Remove answer function
function removeAnswer(index){
  var json = getJSON();
  if (index<json.length){
    json.splice(index, 1);
  }
  $('#id_answers').text(JSON.stringify(json));
  $('#answer-list').remove();
  $('#answer-widget').append('<ol id="answer-list"></ol>');
  for(var i=0;i<json.length;i++){
    $('#answer-list').append(formatAnswer(json[i]));
  }
  createCorrectAnswerSelect();
};

function createCorrectAnswerSelect(){
  var option = null;
  var previousValue = null;

  var existingAnswers = getJSON();
  var widgetId = 'id_correct_answer';
  var widgetName = 'correct_answer';

  // Append new select after current widget
  var newSelect = $('<select>');
  $('#'+widgetId).after(newSelect);
  previousValue = $('#'+widgetId).val();
  console.log("Previous", previousValue);
  
  // Create its options
  $.each(existingAnswers, function(i, answer){
    option = $('<option>').attr('value', answer).text(answer);
    newSelect.append(option);
  });

  // Set previous value and delete old widget
  $('#'+widgetId).remove();
  newSelect.attr('id', widgetId);
  newSelect.attr('name', widgetName);
  newSelect.val(previousValue);
};

$(document).ready(function(){
    var DEBUG = false;
    

    //Hide original widget
    if (!DEBUG){
        $('#id_answers').hide();
    }

    //New widget elements construction    
    $('#id_answers').before('<div id="answer-widget"></div>');
    $('#answer-widget').append('<button id="add-answer" type="button">Add answer</button>')
    $('#answer-widget').append('<ol id="answer-list"></ol>')

    $('#answer-widget').css('width', '300px');
    
    //Add answer function
    $('#add-answer').click(function(){
    var newAnswer = prompt('Enter answer');
    if (newAnswer){
        $('#answer-list').append(formatAnswer(newAnswer));
        var json = getJSON();
        json.push(newAnswer);
        $('#id_answers').text(JSON.stringify(json));
        createCorrectAnswerSelect();
    }
    });
    
    //Populate with existing answers
    var existingAnswers = getJSON();
    $.each(existingAnswers, function(i, answer){
      $('#answer-list').append(formatAnswer(answer));
    });
    createCorrectAnswerSelect();

});
