    $(function() {

        var list = [' art?'
                  , ' science?'
                  , ' history?'
                  , ' music?'
                  , ' math?'
                  , ' biology?'
                  , ' algorithmics?'
                  , ' poetry?'];

        var txt = $('#txtlzr');
        var options = {
            duration: 1000,          // Time (ms) each blurb will remain on screen
            rearrangeDuration: 1000, // Time (ms) a character takes to reach its position
            effect: 'random',        // Animation effect the characters use to appear
            centered: true           // Centers the text relative to its container
          }
        txt.textualizer(list, { duration: 1000 });
        txt.textualizer('start');
    });
