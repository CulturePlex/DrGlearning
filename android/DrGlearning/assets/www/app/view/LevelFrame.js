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

        Ext.define('DrGlearning.view.LevelFrame', {
            extend: 'Ext.Container',
            xtype: 'levelframe',
            requires: [
                'DrGlearning.view.LevelDetail'
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
                                id: 'backtolevels',
                                text: i18n.gettext('Back'),
                                ui: 'back',
                                controller: 'DrGlearning.controller.Career',
                                action: 'index'
                                
                            },
                            {
                                xtype: 'spacer' 
                            },
                            {
                                xtype: 'button',
                                id: 'learnlevel',
                                text: i18n.gettext('Learn'),
                                customId: 'learnlevel'
                            },
                            {
                                xtype: 'spacer' 
                            },
                            {
                                xtype: 'button',
                                id: 'infolevel',
                                text: i18n.gettext('Info'),
                                customId: 'infolevel'
                            },
                        ]
                    },
                    {
                        xtype: 'leveldetail'
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
