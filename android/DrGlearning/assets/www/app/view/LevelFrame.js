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
                                centered:true
                            }
                          
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        items:[
                            {
                                xtype: 'button',
                                id: 'backtolevels',
                                text: i18n.gettext('Back'),
                                ui:'back',
                                controller: 'DrGlearning.controller.Career',
                                action: 'index'
                                
                            }/*,
                            {
                                 xtype: 'spacer' 
                            },
                            {
                                xtype: 'button',
                                text: 'Start',
                                id: 'startActivity'
                                
                              }*/
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
