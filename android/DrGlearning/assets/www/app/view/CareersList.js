/**
 * @class kiva.views.List
 * @extends Ext.List
 *
 * This simple Ext.List subclass is used to display the Loans that are returned from Kiva's API. The largest
 * part of this class is the XTemplate used to render each item - all other functionality is already provided
 * by Ext.List
 */
Ext.define('DrGlearning.view.CareersList', {
	extend: 'Ext.List',
    xtype : 'careerslist',
    config: {
		ui:'careers',
//		styleHtmlContent:true,
        store: 'Careers',
		disableSelection: true,
		useComponents: true,
		//emptyText: 'No more careers to install',
        itemTpl: new Ext.XTemplate(
		    '<tpl for=".">',
				'<div style="display:table; width:100%;">',
			        '<div style="display:table-cell; width:99%;">',
						'<div><b>{name}</b></div>',
						'<tpl for="knowledges">',
							'<tpl if= "xindex == xcount">',
								'<font size="3" color="grey">{name} </font>',
							'</tpl>',
							'<tpl if= "xindex != xcount">',
								'<font size="3" color="grey">{name}, </font>',
							'</tpl>',
						'</tpl>',
					'</div>',
					'<div style="display:table-cell; vertical-align: middle;">',
						'<tpl if= "installed == true">',
				       		'<img vertical-align= "middle" id="uninstall" height="25" src="resources/images/settings.png">',
						'</tpl>',
				        	'<tpl if= "update == true">',
				        	'<img id="update" height="25" src="resources/images/update.jpg">',
				        '</tpl>',
						'<tpl if= "installed == false">',
				       		'<img height="25" src="resources/images/plus.png">',
				        '</tpl>',
					'</div>',
				'</div>',
		    '</tpl>'
		),
		
    }
});

