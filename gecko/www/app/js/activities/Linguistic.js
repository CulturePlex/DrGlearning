var Linguistic = {
    activity: null,
    score: null,
    letterAsked: null,
    squaresBlack: null,
    loquedText: null,
    louedTextfinded: null,
    imageSrc: null,
    imageWidth: null,
    imageHeight: null,
	helpViewed: false,
    setup: function(){
        $(document).on('click', '#tryLinguistic',function(e) {
          Linguistic.tryIt();
        });
        
        $(document).on('click', '#solveLinguistic',function(e) {
          Linguistic.solve();
        });
	  },
    refresh: function(){
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Linguistic.activity = activity;
            Linguistic.imageSrc = activity.value.image_url;
			$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Activity...')+'</p>' });
            var bgImage = new Image();
            bgImage.onload = function () {
				$.unblockUI();
	            Linguistic.imageWidth = this.width;
	            Linguistic.imageHeight = this.height;
	            Linguistic.refresh2();
            };
            bgImage.src = GlobalSettings.getServerURL()+"/media/"+Linguistic.imageSrc ;
        });
    },
    refresh2: function(){
        $('#linguisticActivityQuery').html(Linguistic.activity.value.query);
        $('#linguisticActivityName').html(Linguistic.activity.value.name);
        /*if(activity.value.image_url)
        {
            $('#linguisticImage').attr("src", GlobalSettings.getServerURL()+"/media/"+activity.value.image_url);
        }*/
        Linguistic.score = 100;
        Linguistic.lettersAsked = [];
        //Initializate values
        Linguistic.squaresBlack = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        Linguistic.loquedText = Linguistic.activity.value.locked_text.split("");
        Linguistic.loquedTextFinded = [];
        var cont;
        for (cont in Linguistic.loquedText) 
        {
            if (Linguistic.loquedText[cont] === " ") {
                Linguistic.loquedTextFinded[cont] = true;
            }
            else {
                Linguistic.loquedTextFinded[cont] = false;
            }
        }
        $('#answerLinguistic').empty();
        $('#answerLinguistic').append("Answer: "+Linguistic.activity.value.locked_text.replace(/[A-z0-9]/g, '_ '));
        $('#lettersLinguistic').empty();
        $('#lettersLinguistic').append('');
        if (Linguistic.activity.value.locked_text.toLowerCase() === Linguistic.activity.value.answer.toLowerCase()) {
            //this.activityView.down('label[customId=tip]').setHtml(i18n.gettext('Answer') + ": ");
        }
        var table = Linguistic.getTable();
        $('#linguisticImage').empty();
        $('#linguisticImage').append(table);
		if(!Linguistic.helpViewed)
		{
			$('#infoLinguistic').click();
			Linguistic.helpViewed = true;
		}
	  },
    getTable: function ()
    {
        var table = '<table BORDER-COLOR="BLACK"style="border-collapse: collapse;border-spacing: 0;border-width: 0px 0px 0px 0px;border: 0px none; background-repeat:no-repeat;background-position:center center;" WIDTH="100%" HEIGHT='+Linguistic.imageHeight+' BACKGROUND="' + GlobalSettings.getServerURL()+"/media/"+Linguistic.imageSrc + '"><tr>';
        //var table='<table border="1" WIDTH="100%" HEIGHT="170" BACKGROUND="WHITE"><tr>';
        var squaresBlack = Linguistic.squaresBlack;
        var cont;
        var temp;
        for (cont = 0; cont < squaresBlack.length; cont++)
        {
            if (squaresBlack[cont]) {
                table = table + '<td BGCOLOR="BLACK" style="border: 0px" width="20%"></td>';
            }
            else {
                table = table + '<td></td>';
            }
            if (((parseInt(cont, 10) + 1) % 5) === 0) {
                table = table + '</tr>';
            }
            if (((parseInt(cont, 10) + 1) % 5) === 0 && (parseInt(cont, 10) + 1) !== 25) 
            {
                table = table + '<tr>';
            }
        }
        table = table + '</tr></table>';
        return table;
    },
    tryIt: function ()
    {
        var letter = $("#inputLinguistic").val();
        $("#inputLinguistic").val('');
        var cont;
        var exist = false;
        for (cont in Linguistic.loquedTextFinded) {
            if (letter.toLowerCase() === Linguistic.loquedText[cont].toLowerCase()) {
                Linguistic.loquedTextFinded[cont] = true;
                exist = true;
            }
        }
        if(Linguistic.lettersAsked.indexOf(letter) == -1)
        {
          Linguistic.lettersAsked.push(letter);
          var loquedTextLower = [];
          for (var x in Linguistic.loquedText)
          {
            loquedTextLower[x]=Linguistic.loquedText[x].toLowerCase();
          }
          var arrayAux = [];
          
          for (var y in loquedTextLower)
          {
            if(arrayAux.indexOf(loquedTextLower[y]) == -1)
            {
              arrayAux.push(loquedTextLower[y]);
            }
          }
          var numDifLetter = arrayAux.length;
          if (exist) {
              var i = 0;
              while (i != -1)
              {
                var i = loquedTextLower.indexOf(letter.toLowerCase(),i);
                if (i != -1)
                {
                  i++;
                  Linguistic.score -= (10/numDifLetter);
                }
              }
              $("#lettersLinguistic").append(letter + ' ');
              Linguistic.goodLetter();
          }
          else {
              Linguistic.score -= 70/(27-numDifLetter);
              $("#lettersLinguistic").append(letter.fontcolor("red") + ' ');
          }
       }
       var loqued = "";
       for (cont in Linguistic.loquedTextFinded) {
           if (Linguistic.loquedTextFinded[cont]) {
               loqued = loqued + Linguistic.loquedText[cont];
           }
           else {
               loqued = loqued + "_ ";
           }
       }
       $('#answerLinguistic').empty();
       $('#answerLinguistic').append("Answer: "+loqued);
       if (loqued.toLowerCase() === Linguistic.activity.value.answer.toLowerCase()) 
       {
           if (Linguistic.score < 50)
           {
               Linguistic.score = 50;
           }
		   Dao.activityPlayed(Linguistic.activity.value.id, true, Linguistic.score);
           $('#dialogText').html(Linguistic.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": "+parseInt(Linguistic.score,10));
           $.mobile.changePage("#dialog");
       }
    },
    goodLetter: function ()
    {
        var cont;
        var goodLetters = 1;
        var whiteSquares = 0;
        for (cont in Linguistic.loquedTextFinded) {
            if (Linguistic.loquedTextFinded[cont]) {
                goodLetters++;
            }
        }
        var keysBlack = [];
        for (cont in Linguistic.squaresBlack) {
            if (!Linguistic.squaresBlack[cont]) {
                whiteSquares++;
            }
            else {
                keysBlack.push(cont);
            }
        }
        var neededWhiteSquares = Math.floor((goodLetters * 25) / Linguistic.loquedTextFinded.length);
        while (goodLetters > 0 && whiteSquares < neededWhiteSquares) {
            var random = Math.floor(Math.random() * keysBlack.length);
            Linguistic.squaresBlack[keysBlack[random]] = false;
            keysBlack = [];
            for (cont in Linguistic.squaresBlack) {
                if (Linguistic.squaresBlack[cont]) {
                    keysBlack.push(cont);
                }
            }
            whiteSquares++;
        }
        var table = Linguistic.getTable();
        $('#linguisticImage').empty();
        $('#linguisticImage').append(table);
    },
    solve: function ()
    {
      $.mobile.changePage("#dialogLinguistic");
      $(document).on('click', '#solveOKLinguistic',function(e)
      {
        var answer = $('#inputSolveLinguistic').val();
        if (answer.toLowerCase() === Linguistic.activity.value.answer.toLowerCase()) {
          if (Linguistic.score < 20)
          {
              Linguistic.score = 20;
          }
          $('#dialogText').html(Linguistic.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": "+parseInt(Linguistic.score,10));
		  Dao.activityPlayed(Linguistic.activity.value.id, true, Linguistic.score);
          //Workflow.nextActivity(newActivity.data.level_type);
        }
        else {
            Linguistic.score = 0;
            Dao.activityPlayed(Linguistic.activity.value.id, false, Linguistic.score);
			Workflow.toLevel = true;			
  	        $('#dialogText').html(Linguistic.activity.value.penalty);
        }
        });
    }
}
