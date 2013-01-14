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

        Ext.define('DrGlearning.view.LevelDetail', {
            extend: 'Ext.Panel',
            xtype: 'leveldetail',
            requires: [
                'DrGlearning.view.LevelDescription'
            ],
            config: {
                layout: 'vbox',
                defaults: {
                    flex: 1
                },
                items: 
                [
                    {
                        ui: 'activities',
                        xtype: 'list',
                        customId: 'activitiesList',
                        store: 'Activities',
                        cls: 'activities-list',
                        disableSelection: true,
                        itemTpl: new Ext.XTemplate(
                        '<tpl for=".">',
                            '<tpl if= "successful == true">',
                                '<div class = "itemlist">',
                                        '<b>{name}</b><img class="tick" height=20 src=resources/images/tick.png><div class = "score">Your best score: {score}</div>',
                                        '<div><font size="3" color="grey">{query} </font><div>',
                                '</div>',
                            '</tpl>',
                            '<tpl if= "successful == false">',
                                '<div class = "itemlist">',
                                        '<div><b>{name}</b></div>',
                                        '<font size="3" color="grey">{query} </font>',
                                '</div>',
                            '</tpl>',
                        '</tpl>'
                    )
                    }   
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
