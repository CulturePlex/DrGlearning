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
          //Linguistic.Try();
        });
        $(document).on('click', '#solveLinguistic',function(e) {
          //Linguistic.Solve();
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
}
