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
        store: 'Careers',
		disableSelection: true,
		useComponents: true,
        itemTpl: new Ext.XTemplate(
		    '<tpl for=".">',
				'<div style="display:table; width:100%;">',
			        '<div style="display:table-cell;vertical-align: middle;">',
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
					'<div style="display:table-cell; vertical-align: middle; float:right;">',
						'<tpl if= "installed == true">',
				       		'<img hspace="2" vertical-align= "middle" id="uninstall" height="25" src="resources/images/settings.png">',
				        	'<tpl if= "update == true">',
				        	'<img hspace="2" vertical-align= "middle" id="update" height="25" src="resources/images/reload.png">',
				        	'</tpl>',
						'</tpl>',
						'<tpl if= "installed == false">',
				       		'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/plus.png">',
				        '</tpl>',
					'</div>',
				'</div>',
				'<tpl if= "installed == true">',
					'<div style="display:table; width:100%;">',
					'<tpl if= "illetratum == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/iletratumB.png">',
					'</tpl>',
					'<tpl if= "illetratum == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/iletratum.png">',
					'</tpl>',
					'<tpl if= "primary == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/primaryB.png">',
					'</tpl>',
					'<tpl if= "primary == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/primary.png">',
					'</tpl>',
					'<tpl if= "secondary == \'exists\'	">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/secondaryB.png">',
					'</tpl>',
					'<tpl if= "secondary == \'successed\'	">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/secondary.png">',
					'</tpl>',
					'<tpl if= "highschool == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/highschoolB.png">',
					'</tpl>',
					'<tpl if= "highschool == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/highschool.png">',
					'</tpl>',
					'<tpl if= "college == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/collegeB.png">',
					'</tpl>',
					'<tpl if= "college == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/college.png">',
					'</tpl>',
					'<tpl if= "master == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/masterB.png">',
					'</tpl>',
					'<tpl if= "master == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/master.png">',
					'</tpl>',
					'<tpl if= "phd == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/PhDB.png">',
					'</tpl>',
					'<tpl if= "phd == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/PhD.png">',
					'</tpl>',
					'<tpl if= "postdoc == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/post-docB.png">',
					'</tpl>',
					'<tpl if= "postdoc == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/post-doc.png">',
					'</tpl>',
					'<tpl if= "professor == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/professorB.png">',
					'</tpl>',
					'<tpl if= "professor == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/professor.png">',
					'</tpl>',
					'<tpl if= "emeritus == \'exists\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/emeritusB.png">',
					'</tpl>',
					'<tpl if= "emeritus == \'successed\'">',
						'<img hspace="2" vertical-align= "middle" height="25" src="resources/images/level_icons/emeritus.png">',
					'</tpl>',
					'</div>',
				'</tpl>',
		    '</tpl>'
		),
		
    }
});

