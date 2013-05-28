var page = require('webpage').create();
page.open('jasmine-tests.html', function () {
    phantom.exit();
});
