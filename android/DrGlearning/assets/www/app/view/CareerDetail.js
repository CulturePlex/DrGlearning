/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace console
*/ 

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.CareerDetail', {
            extend: 'Ext.Panel',
            xtype: 'careerdetail',
            requires: [
                'DrGlearning.view.CareerDescription',
                'DrGlearning.model.Level',
                'DrGlearning.store.Levels'
            ],
            config: {
                layout: 'vbox',
                defaults: {
                    flex: 1
                },
                items: 
                [
                    {
                        xtype: 'careerdescription'
                    },
                    {
                        xtype: 'carousel',
                        customId: 'levelscarousel'
                    }
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
