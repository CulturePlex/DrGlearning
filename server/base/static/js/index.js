    $(function() {

        var list = [' art?'
                  ,' history?'
                  , ' music?'
                  , ' poetry?'];

        var txt = $('#txtlzr');

        txt.textualizer(list, { duration: 1000 });
        txt.textualizer('start');
    });
