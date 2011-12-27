/**
 * @class kiva.views.List
 * @extends Ext.List
 *
 * This simple Ext.List subclass is used to display the Loans that are returned from Kiva's API. The largest
 * part of this class is the XTemplate used to render each item - all other functionality is already provided
 * by Ext.List
 */
Ext.define('DrGlearning.view.CareersList', {
    extend: 'Ext.dataview.ComponentView',
    xtype : 'careerslist',
    requires: [
        'DrGlearning.view.CareersListItem'
    ],
	emptyText: 'No more careers to install',
	deferEmptyText: false,
    config: {
		deselectOnContainerClick: true,
        ui   : 'careers',
        store: 'Careers',
        defaultType: 'careerslistitem',
		//emptyText: 'No more careers to install',
        deselectOnContainerClick: false,

    },
	ponmascara: function(){
		
			console.log('asd');
			if (this.getStore().getCount() == 0) {
				this.setMask('No installed careers, please click on Add Career button to start!');
			}
		
	}
});

