/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50 noempty:false
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace
*/
try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.MaxStorageSizeController', {
            extend: 'Ext.app.Controller',
            
            
            init: function () {
            },
            
            initTest: function (controller) {
                var iterationsData;
                //var results = document.getElementById('results');
                (function () {
                    if (!('localStorage' in window)) {
                        //console.log('Your browser has no localStorage support.');
                        return;
                    }

                    var n10b =    '0123456789';
                    var n100b =   repeat(n10b, 10);
                    var n1kib =   repeat(n100b, 10);
                    var n10kib =  repeat(n1kib, 10);
                    var n100kib = repeat(n10kib, 10);
                    var n1mib =   repeat(n100kib, 10);
                    var n10mib =  repeat(n1mib, 10);

                    var values = [n10b, n100b, n1kib, n10kib, n100kib, n1mib, n10mib];

                    iterationsData = [];
                    for (var majorIndex = 1; majorIndex < values.length; majorIndex++) {
                        var major = values[majorIndex];
                        var minor = values[majorIndex - 1];
                        for (var i = 1; i < 10; i++) {
                            for (var j = 0; j < 10; j++) {
                                iterationsData.push([major, minor, i, j]);
                            }
                        }
                    }
                    var index = 0;
                    var oldLength = 0;
                    function iteration() {
                        var data = iterationsData[index];
                        major = data[0];
                        minor = data[1];
                        i = data[2];
                        j = data[3];

                        var string = repeat(major, i) + repeat(minor, j);
                        var length = '' + string.length;

                        if (test(string)) {
                        //results.innerHTML = length + ' characters were stored successfully.';
                        } else {
                            //console.log('Max localstorage size '+oldLength);
                            localStorage.maxSize = oldLength;
                            localStorage.actualSize = 0;
                            localStorage.removeItem('test');
                            Ext.Viewport.setMasked(false);
                            controller.getLoading().hide();
                            controller.getApplication().getController('CareersListController').initializate();
                        //results.innerHTML = oldLength + ' characters were stored successfully,  but ' + length + ' weren\'t.';
                            return;
                        }
                        oldLength = length;
                        
                        index++;
                        if (index < iterationsData.length) {
                            setTimeout(iteration, 0);
                        } else {
                            //results.innerHTML = oldLength + ' characters were saved successfully, test is stopped.';
                            return;
                        }
                    }

                    iteration();
                    return;
                         
                    function test(value, name) {
                        try {
                            localStorage.test = value;
                            return true;
                        } catch (e) {
                            return false;
                        }
                    }

                    function repeat(string, count) {
                        var array = [];
                        while (count--) {
                            array.push(string);
                        }
                        return array.join('');
                    }
                })();
                
            }
                
                
        });

        // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
