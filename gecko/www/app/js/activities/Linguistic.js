var Linguistic = {
    activity: null,
    time: null,
    secondtemp: null,
    score: null,
    letterAsked: null,
    squaresBlack: null,
    loquedText: null,
    louedTextfinded: null,
    imageSrc: null,
    setup: function(){
        $(document).on('click', '#tryLinguistic',function(e) {
          Linguistic.tryIt();
        });
        
        $(document).on('click', '#solveLinguistic',function(e) {
          Linguistic.solve();
        });
	  },
    refresh: function(){
        console.log('olasss');
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Linguistic.activity = activity;
            Linguistic.imageSrc = activity.value.image_url;
            $('#linguisticActivityQuery').html(activity.value.query);
            $('#linguisticActivityName').html(activity.value.name);
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
            $('#answerLinguistic').append("Answer: "+activity.value.locked_text.replace(/[A-z0-9]/g, '_ '));
            $('#lettersLinguistic').empty();
            $('#lettersLinguistic').append('');
            if (activity.value.locked_text.toLowerCase() === activity.value.answer.toLowerCase()) {
                //this.activityView.down('label[customId=tip]').setHtml(i18n.gettext('Answer') + ": ");
            }
            var table = Linguistic.getTable();
            $('#linguisticImage').empty();
            $('#linguisticImage').append(table);
	      })
	  },
    getTable: function ()
    {
        var table = '<table style="background-repeat:no-repeat;background-position:center center;" WIDTH="100%" HEIGHT="170" BACKGROUND="' + GlobalSettings.getServerURL()+"/media/"+Linguistic.imageSrc + '"><tr>';
        //var table='<table border="1" WIDTH="100%" HEIGHT="170" BACKGROUND="WHITE"><tr>';
        var squaresBlack = Linguistic.squaresBlack;
        var cont;
        var temp;
        for (cont = 0; cont < squaresBlack.length; cont++)
        {
            if (squaresBlack[cont]) {
                table = table + '<td BGCOLOR="BLACK" style="border: inset 0pt" width="20%"></td>';
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
        console.log('oyee');
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
          console.log(Linguistic.loquedText.length);
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
                  console.log('restando');
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
       $('#answerLinguistic').append(loqued);
       console.log(Linguistic.score);
       if (loqued.toLowerCase() === Linguistic.activity.value.answer.toLowerCase()) 
       {
           if (Linguistic.score < 20)
           {
               Linguistic.score = 20;
           }
           $('#dialogText').html(Linguistic.activity.value.reward+". "+i18n.gettext('Score')+":"+Linguistic.score);
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
    /*
        var answer;
        var saveButton = Ext.create('Ext.Button', {
            scope: this,
            text: i18n.gettext('Solve')
        });
        var cancelButton = Ext.create('Ext.Button', {
            scope: this,
            text: i18n.gettext('Cancel')
        });
        var show = new Ext.MessageBox().show({
            id: 'info',
            title: i18n.gettext('Answer the question') + ": ",
            msg: this.activity.data.query,
            items: [{
                xtype: 'textfield',
                labelAlign: 'top',
                clearIcon: true,
                value: '',
                id: 'importvalue'
            }],
            buttons: [cancelButton, saveButton],
            icon: Ext.Msg.INFO
        });
        saveButton.setHandler(function ()
        {
            show.hide();
            answer = show.down('#importvalue').getValue();
            if (answer.toLowerCase() === this.activity.data.answer.toLowerCase()) {
                if (this.score < 20)
                {
                    this.score = 20;
                }
                Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' ' + i18n.gettext("Score") + ": " + parseInt(this.score,10), function ()
                {
                    this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                    this.levelController.nextActivity(this.activity.data.level_type);
                }, this);
            }
            else {
                if (this.score < 0)
                {
                    this.score = 0;
                }
                Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
                {
                    this.daoController.activityPlayed(this.activity.data.id, false, this.score);
                    this.levelController.tolevel();
                }, this);
            }
        });
        cancelButton.setHandler(function ()
        {
            show.hide();
            this.destroy(show);
        });*/
    }
}
