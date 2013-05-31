var exit_code = 0;
var page = require('webpage').create();

page.onConsoleMessage = function (msg) {
    if(msg==="phantom-exit")
    {
        phantom.exit(exit_code);
    }
    else
    {
        if(msg!=="Passed")
        {
            exit_code = -1;
        }
        console.log(msg);
    }
};

page.onInitialized = function() {
  page.evaluate(function(domContentLoadedMsg) {
    document.addEventListener('DOMContentLoaded', function() {
      window.callPhantom('DOMContentLoaded');
    }, false);
  });
};

page.open('jasmine-tests.html');
