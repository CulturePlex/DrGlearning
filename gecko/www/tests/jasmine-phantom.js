var page = require('webpage').create();
page.open('jasmine-tests.html', function () {
    page.render('google.png');
    phantom.exit();
});
