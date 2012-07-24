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

        Ext.define('DrGlearning.view.activities.Geospatial', {
            extend: 'Ext.Panel',
            xtype : 'geospatial',
            poligono: null,
            marker: null,
            circle: null,
            bandera: null,
            config:  {
                customId: 'activity',
                id: 'activity',
                title: 'Map',
                iconCls: 'maps',
                layout: 'fit',
                fullscreen: true,
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        ui: 'neutral',
                        customId: 'query',
                        layout: {
                            type: 'hbox',
                            pack : 'center' 
                        },
                        height: 40
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        items: [
                            {
                                xtype: 'button',
                                customId: 'backtolevel',
                                text: i18n.gettext('Back'),
                                ui: 'back'
                            },
                            {
                                xtype: 'spacer' 
                            },
                            {
                                xtype: 'button',
                                text: i18n.gettext("Confirm"),
                                id: 'confirm',
                                customId: 'confirm'
                            }
                        ]
                    }
                ]
            }
            
            
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
