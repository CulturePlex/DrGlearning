Ext.define('DrGlearning.model.User', {
    extend: 'Ext.data.Model',
    config: {
             fields: [
                      {
                    	  name: "id",
                    	  type: "string"
                      },{
                    	  name: "display_name",
                    	  type: "string"
                      },{
                    	  name: "email",
                    	  type: "string"
                      },{
                    	  name: "image",
                    	  type: "string"
                      },{
                    	  name: "resource_uri",
                    	  type: "string"
                      },{
                    	  name: "token",
                    	  type: "string"
                      },{
                    	  name: "uniqueid",
                    	  type: "string"
                      },{
                    	  name: "serverid",
                    	  type: "string"
                      }],
             proxy: {
            	 type: 'localstorage',
            	 id  : 'DrGlearningUser'
             }
    }
});
