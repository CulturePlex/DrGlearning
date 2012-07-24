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

        Ext.define('DrGlearning.view.ActivityFrame', {
            extend: 'Ext.Container',
            xtype: 'activityframe',
            
            config: {
                fullscreen: true,
                items: [
                    {
                        ref: 'toolbar',
                        xtype: 'toolbar',
                        docked: 'top',
                        name: 'up',
                        items: [
                            {
                                xtype: 'title',
                                customId: 'title',
                                name: 'title',
                                title: i18n.gettext('Activity name'),
                                centered: true
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        id: 'activity',
                        customId: 'activity'
                    }
                    
                ],

                layout: 'fit'
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
