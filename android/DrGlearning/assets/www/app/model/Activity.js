/*
COMUNES:
-name: El nombre de la actividad
-activity_type: El tipo. De momento las opciones son "geospatial", "linguistic", "relational", "temporal", "visual"
-id: El id de la actividad
-language_code: El lenguaje ("en", "es", ...)
-levels: La lista de los levels asociados a esta actividad
-query: Lo que se pregunta
-timestamp: Sistema de versionado (p. ej. "2011-10-26T13:15:13.556255")
-resource_uri: La uri de la actividad que estamos viendo.
-activity_ptr: Esto es interno de tastypie. Ignorarlo. Aun as�, el valor que tiene es el mismo que name.
 
 */

Ext.define('DrGlearning.model.Activity', {
	extend : 'Ext.data.Model',
	config : {
		fields : [ {
			name : "id",
			type : "int"
		}, {
			name : "name",
			type : "string"
		}, {
			name : "careerId",
			type : "string"
		}, {
			name : "activity_type",
			type : "string"
		}, {
			name : "language_code",
			type : "string"
		}, {
			name : "level_type",
			type : "string"
		}, {
			name : "level_order",
			type : "int"
		}, {
			name : "level_required",
			type : "string"
		}, {
			name : "query",
			type : "string"
		}, {
			name : "timestamp",
			type : "string"
		}, {
			name : "resource_uri",
			type : "string"
		}, {
			name : "reward",
			type : "string"
		}, {
			name : "score",
			type : "int"
		}, {
			name : "played",
			type : "boolean"
		}, {
			name : "successful",
			type : "boolean"
		}
		/*-----------------------
		Temporal Activities
		-----------------------
		ESPECIFICOS:
		- image: El chorizo base64 de la imagen correspondiente en el formato http://en.wikipedia.org/wiki/Data_URI_scheme
		- image_datetime. La fecha de lo que aparece en la imagen
		- query_datetime: La fecha de lo que se pregunta
		 */
		, {
			name : "image",
			type : "string"
		}, {
			name : "image_datetime",
			type : "date"
		}, {
			name : "query_datetime",
			type : "date"
		},{
			name : "image_url",
			type : "string"
		}
		
		/*-------------------------
			Linguistic Activities
		-------------------------
		ESPECIFICOS:
		- image: El chorizo base64 de la imagen correspondiente en el formato http://en.wikipedia.org/wiki/Data_URI_scheme
		- locked_text: el texto que comentamos de la ruleta de la fortuna
		- answer: la respuesta
		 */
		, {
			name : "locked_text",
			type : "string"
		}, {
			name : "answer",
			type : "string"
		}
		/*-------------------------
		Visual Activities
		-------------------------
		ESPECIFICOS:
		- answers: La lista json de las posibles respuestas (p. ej. "["Respuesta 1", "Res 2", "Res 3"]")
		- correct_answer: La cadena con la respuesta correcta  (p. ej. "Res 2")
		- image: El chorizo base64 de la imagen correspondiente en el formato http://en.wikipedia.org/wiki/Data_URI_scheme
		-obfuscated_image: El chorizo base64 de la imagen correspondiente en el formato http://en.wikipedia.org/wiki/Data_URI_scheme
		- time: El tiempo que se muestra la imagen buena
		 */
		, {
			name : "answers",
			type : "auto"
		}, {
			name : "correct_answer",
			type : "string"
		}, {
			name : "obfuscated_image",
			type : "string"
		}, {
			name : "time",
			type : "string"
		}, {
			name : "obfuscated_image_url",
			type : "string"
		}
		
		/*-------------------------
		Relational Activities
		-------------------------
		ESPECIFICOS:
		graph_nodes: El json con los nodos
		graph_edges: El json con las aristas
		scored_nodes: El json con las puntuaciones especiales 
		source_path: El nodo de inicio
		target_path: El nodo de fin
		 */
		, {
			name : "graph_nodes",
			type : "auto"
		}, {
			name : "graph_edges",
			type : "auto"
		}, {
			name : "constraints",
			type : "auto"
		}
		/*-------------------------
		Geospatial Activities
		-------------------------
		ESPECIFICOS:
		-area El poligono que se considera correcto (p. ej. "POLYGON ((30.0000000000000000 10.0000000000000000, 10.0000000000000000 20.0000000000000000, 20.0000000000000000 40.0000000000000000, 40.0000000000000000 40.0000000000000000, 30.0000000000000000 10.0000000000000000))")
		-point: El punto a encontrar (p. ej. "POINT (-80.0202941894531250 40.4835150479630030)"
		-radius: El radio alrededor del punto en metros
		 */
		, {
			name : "area",
			type : "string"
		}, {
			name : "point",
			type : "string"
		}, {
			name : "radius",
			type : "string"
		},{
			name : "minZoom",
			type : "int"
		} ],
        
		

		proxy : {
			type : 'localstorage',
			id : 'DrGlearningActivity'
		}
	},
	setImage: function(fieldName, value,scope) {
		if(window.device != undefined && LocalFileSystem!=undefined){
			//console.log('Estamos en un dispositivo movil');
			//console.log('Almacenamos en disco.');
			scope.getApplication().getController('FileManagerController').storeImage(value,this.data.id,fieldName);
		}
	},
    getImage: function(name,targetId,component,controller,view,activityView,isTable) {
    	//return scope.getApplication().getController('FileManagerController').retrieveImage(fieldName+this.data.id,targetId);
    	if(window.device != undefined && LocalFileSystem!=undefined){
    		//console.log('Recuperamos de disco.');
    		controller.getApplication().getController('FileManagerController').retrieveImage(this.data.id,name,component,controller,view,activityView,isTable);
    	}else{
    		if(isTable){
    			controller.loadingImages(view,activityView,controller.getApplication().getController('GlobalSettingsController').getServerURL()+'/media/'+this.data.image_url);
    		}else{
    			component.setHtml('<img class="activityImage" id="image" alt="imagen" src="'+controller.getApplication().getController('GlobalSettingsController').getServerURL()+'/media/'+this.data.image_url+'" />');
        		controller.loadingImages(view,activityView);	
    		}
    	}
    	
	},
});
