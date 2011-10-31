Ext.define('DrGlearning.view.CareersFrame', {
    extend: 'Ext.Container',
	xtype: 'careersframe',
    requires: [
		'DrGlearning.view.CareersList',

		
    ],
	config: {
        items: [
            {
                xtype: 'toolbar',
                ui   : 'green',
                docked: 'top',
                items: [
                    { xtype: 'spacer', width: 35 },
                    { xtype: 'spacer' },
                    {
                        xtype: 'title',
                        title: 'Dr. Glearning'
                    },
                    { xtype: 'spacer' }
                  
                ]
            },
			{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'gray',
                items:[
                    {
                        xtype: 'selectfield',
                        name: 'estado',
                        options: [
                            {text: 'In progress', value: 'both'},
                            {text: 'Not Yet', value: 'male'}
                        ]
                    },
					{ xtype: 'spacer' },
                    {
                        xtype: 'button',
                        text: 'Add Career'
                    }
					]
                
            },
			{
				xtype: 'careerslist'
			}
        ],

        layout: 'fit'
    }
});