    $(function() {

        var list = ['What do you know about art?'
                  ,'What do you know about history?'
                  , 'What do you know about music?'
                  , 'What do you know about poetry?'];

        var txt = $('#txtlzr');

        txt.textualizer(list, { duration: 1000 });
        txt.textualizer('start');
    });
