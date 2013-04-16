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

        Ext.define('DrGlearning.view.CareersFrame', {
            extend: 'Ext.Container',
            xtype: 'careersframe',
            config: 
            {
                fullscreen: true,
                items: 
                [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        items: 
                        [
                            {
                                xtype: 'spacer'
                            }, 
                            {
                                xtype: 'title',
                                title: i18n.gettext("Dr. Glearning")
                            }, 
                            {
                                xtype: 'spacer'
                            }
                        ]
                    }, 
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        ui: 'neutral',
                        id: 'toolbarTopNormal',
                        items: [{
                            xtype: 'selectfield',
                            name: 'state',
                            width: '40%',
                            inputCls: localStorage.alignCls,
                            options: [ {
                                text: i18n.gettext('All'),
                                value: 'all'
                            },
                            {
                                text: i18n.gettext('In progress'),
                                value: 'inProgress'
                            }, 
                            {
                                text: i18n.gettext('Not yet started'),
                                value: 'notYet'
                            }]
                        }, {
                            xtype: 'spacer'
                        }, {
                            xtype: 'button',
                            text: i18n.gettext('Add course'),
                            id: 'addCareer'
                        }]
                    }, 
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        id: 'toolbarTopAdd',
                        ui: 'neutral',
                        items: [{
                            xtype: 'searchfield',
                            placeHolder: i18n.gettext('Search'),
                            inputCls: localStorage.alignCls,
                            width: '40%',
                            name: 'searchfield',
                            id: 'searchbox'
                        }, {
                            xtype: 'spacer'
                        }, {
                            xtype: 'selectfield',
                            name: 'knnowledge_field',
                            width: '40%', 
                            options: []
                        }]
                    }, {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        id: 'toolbarBottomAdd',
                        items: [{
                            xtype: 'button',
                            name: 'back',
                            id: 'back',
                            text: i18n.gettext('Back'),
                            ui: 'back'
                        },
                        {
                            xtype: 'spacer'
                        }
                        /*{
                            xtype: 'button',
                            name: 'refresh',
                            id: 'refresh',
                            text: i18n.gettext('Refresh')
                        }*/]
                    
                    },
                    {
                        xtype: 'panel',
                        layout: 'vbox',
                        items:
                        [
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'container',
                                layout: 'hbox',        
                                items: 
                                [
                                    {
                                        xtype: 'spacer'
                                    },
                                    {
                                        xtype: 'panel',
                                        html: '<p align="center" >' + i18n.gettext("No courses installed, click on 'Add course' to start") + ' </p>',
                                        customId: 'emptyList'
                                    },
                                    {
                                        xtype: 'spacer'
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                layout: 'hbox', 
                                items: [
                                    {xtype: 'spacer'},
                                    {
                                        xtype: 'button',
                                        text: i18n.gettext('Add course'),
                                        width: '150px',
                                        align: 'center',
                                        customId: 'addCareer'
                                    },    
                                    {xtype: 'spacer'}
                                ]
                            },
                            {
                                xtype: 'spacer'
                            }
                        ]
                    }, {
                        xtype: 'careerslist'
                    }, {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        
                        layout: {
                            type: 'hbox',
                            pack: 'center',
                            align: 'center'
                        },
                        id: 'toolbarBottomSettings',
                        items: [{
                            id: 'settings',
                            text: i18n.gettext('Settings'),
                            xtype: 'button'
                            //xtype: 'panel',
                            //html: '<font color="white">'+i18n.gettext('CulturePlex Lab.')+'</font>',
                        },
                        /*{
                            id: 'sync',
                            text: i18n.gettext('Sync'),
                            xtype: 'button'
                            //xtype: 'panel',
                            //html: '<font color="white">'+i18n.gettext('CulturePlex Lab.')+'</font>',
                        },*/
                        {
                            id: 'updateAll',
                            text: i18n.gettext('Update all'),
                            xtype: 'button'
                            //xtype: 'panel',
                            //html: '<font color="white">'+i18n.gettext('CulturePlex Lab.')+'</font>',
                        }]
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
