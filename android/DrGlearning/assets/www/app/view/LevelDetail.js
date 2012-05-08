Ext.define('DrGlearning.view.LevelDetail', {
    extend: 'Ext.Panel',
    xtype: 'leveldetail',
    requires: [
        'DrGlearning.view.LevelDescription',
    ],
    config: {
        layout: 'vbox',
        defaults: {
            flex: 1
        },
        items: [
        
        {
            ui:'activities',
            xtype: 'list',
            customId:'activitiesList',
            store:'Activities',
            cls:'activities-list',
            disableSelection: true,
            itemTpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<tpl if= "successful == true">',
                    '<div style="background-color:#90EE90;">',
                            '<b>{name}</b><img height=20 src=resources/images/tick.png><div class = "score">Score: {score}</div>',
                            '<div><font size="3" color="grey">{query} </font><div>',
                    '</div>',
                '</tpl>',
                '<tpl if= "successful == false">',
                    '<div>',
                            '<div><b>{name}</b></div>',
                            '<font size="3" color="grey">{query} </font>',
                    '</div>',
                '</tpl>',
            '</tpl>'
        ),
        }    
        ]
    }
});
