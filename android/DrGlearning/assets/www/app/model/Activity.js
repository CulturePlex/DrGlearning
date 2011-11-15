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
-activity_ptr: Esto es interno de tastypie. Ignorarlo. Aun así, el valor que tiene es el mismo que name.
 
 */

Ext.define('DrGlearning.model.Activity', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : "id",
		type : "string"
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
		type : "string"
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
	} 
	/*-----------------------
	Temporal Activities
	-----------------------
	ESPECIFICOS:
	- image: El chorizo base64 de la imagen correspondiente en el formato http://en.wikipedia.org/wiki/Data_URI_scheme
	- image_datetime. La fecha de lo que aparece en la imagen
	- query_datatime: La fecha de lo que se pregunta
	*/
	, {
		name : "image",
		type : "string"
	}
	, {
		name : "image_datetime",
		type : "string"
	}
	, {
		name : "query_datatime",
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
	}
	, {
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
		type : "string"
	}
	, {
		name : "correct_answer",
		type : "string"
	}
	, {
		name : "obfuscated_image",
		type : "string"
	}
	, {
		name : "time",
		type : "string"
	}

	],
	proxy : {
		type : 'localstorage',
		id : 'DrGlearningActivity'
	}
});
