Ext.define('DrGlearning.model.User', {
    extend: 'Ext.data.Model',
    config: {
             fields: [
                      {
                    	  name: "id",
                    	  type: "string"
                      },{
                    	  name: "name",
                    	  type: "string"
                      },{
                    	  name: "email",
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
