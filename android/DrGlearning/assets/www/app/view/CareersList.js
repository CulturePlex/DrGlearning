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
        ui   : 'careers',
        store: 'Careers',
		disableSelection: true,
		useComponents: true,
		//emptyText: 'No more careers to install',
        itemTpl: new Ext.XTemplate(
		    '<tpl for=".">',
		   
		        '<div><b>{name}</b></div><div>{description}</div><div>',
		    	'<tpl if= "installed == \'true\'">',
		       		'<img height="25" src="resources/images/uninstall.jpg">',
					'<img height="25" src="resources/images/update.jpg">',
		        '</tpl>',
				'<tpl if= "installed == \'false\'">',
		       		'<img height="25" src="resources/images/install.jpg">',
		        '</tpl>',
		        		   
		    '</tpl>'
		),
		
    },
	ponmascara: function(){
		
			console.log('asd');
			if (this.getStore().getCount() == 0) {
				this.setMask('No installed careers, please click on Add Career button to start!');
			}
		
	}
});

