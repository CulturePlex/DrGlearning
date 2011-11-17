Ext.define('DrGlearning.controller.activities.RelationalController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Relational'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [{
        ref: 'activities.reospatial',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],	
	updateActivity: function(view,newActivity) {
		activityView = Ext.create('DrGlearning.view.activities.Relational');
		var html='<script type="text/javascript" src="resources/js/processing-1.3.6.min.js"></script>'+'</br>';
		html=html+'<script id="script1" type="text/javascript"> \
    var graphNodes = {1: {"name": "val1"}, 2: {"name": "val2"}, \
                    3: {"name": "val3"}, 4: {"name": "val4"}, \
                    5: {"name": "val5"}, 6: {"name": "val6"}, \
                    7: {"name": "val7"}, 8: {"name": "val8"}}; \
    var graphEdges = [{"source": 1, "target": 2, "properties": {"type": "t1"}}, \
                    {"source": 1, "target": 3, "properties": {"type": "t2"}}, \
                    {"source": 2, "target": 4, "properties": {"type": "t1"}}, \
                    {"source": 4, "target": 5, "properties": {"type": "t1"}}, \
                    {"source": 5, "target": 6, "properties": {"type": "t1"}}, \
                    {"source": 5, "target": 8, "properties": {"type": "t1"}}, \
                    {"source": 6, "target": 7, "properties": {"type": "t1"}}, \
                    {"source": 7, "target": 8, "properties": {"type": "t1"}}]; \
 \
    var sourcePath = 1;  \
    var targetPath = 8; \
    var scoredNodes = []; \
    var query = []; \
    var P; \
    var answer = "initial"; \
 \
    function setAnswer(){ \
        answer = document.getElementById("answer").value; \
    } \
 \
 \
    </script>';
		html=html+' \
	  <div id="content"> \
      <div id="control-bar"> \
        <span>Relation:</span> \
        <span id="selected-node"></span> \
        <select id="next-type"> \
        </select> \
        <input id="answer" size="8" type="text" onChange="setAnswer()"/> \
      </div> \
      <canvas id="sketch" data-processing-sources="resources/js/relational.pde"></canvas>';
		html=html+'<script id="script1" type="text/javascript"> \
					function prueba(){ \
        			console.log("HURRA!!!"); \
					}</script>';
		activityView.down('panel[id=contentSencha]').setHtml(html);
		activityView.down('title').setTitle(newActivity.data.query);
		view.add(activityView);
	},
});
