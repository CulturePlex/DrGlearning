Ext.define('DrGlearning.view.CareerDetail', {
    extend: 'Ext.Panel',
	xtype: 'careerdetail',
    requires: [
		'DrGlearning.view.CareerDescription',
		'DrGlearning.model.Level',
		'DrGlearning.store.Levels'
    ],
    config: {
        layout: 'vbox',
        defaults: {
            flex: 1
        },
        items: [
		{
	        xtype: 'careerdescription',
        },
		{
	        xtype: 'carousel',
			customId: 'levelscarousel',
			listeners: {
                element: 'element',
                delegate: 'a.navigation',
                tap: function(e,img,asd,thisObj){
					if(e.target.nodeName == "IMG")
					{
						careerController.startLevel();
					}
                }
            }
        }
        ],
	},
	
});