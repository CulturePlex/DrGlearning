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

        Ext.define('DrGlearning.view.CareerFrame', {
            extend: 'Ext.Container',
            xtype: 'careerframe',
            requires: [
                'DrGlearning.view.CareerDetail'
            ],
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
                                id: 'title',
                                name: 'title',
                                title: i18n.gettext('Course Name'),
                                maxWidth: '100%',
                                centered: true
                            }
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        items: 
                        [
                            {
                                xtype: 'button',
                                id: 'backToCareers',
                                text: i18n.gettext('Back'),
                                ui: 'back'
                            },
                            {
                                xtype: 'spacer' 
                            },
                            {
                                xtype: 'button',
                                id: 'learn',
                                text: i18n.gettext('Learn'),
                                customId: 'learn'
                            },
                            {
                                xtype: 'spacer' 
                            },
                            {
                                xtype: 'button',
                                text: i18n.gettext('Start'),
                                id: 'startLevel',
                                customId: 'startLevel'
                            }
                        ]
                    },
                    {
                        xtype: 'careerdetail'
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
