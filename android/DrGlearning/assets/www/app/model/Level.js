try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.model.Level', {
            extend : 'Ext.data.Model',
            config : {
                fields : [ {
                    name : "customId",
                    type : "string"
                }, {
                    name : "name",
                    type : "string"
                },{
                    name : "nameBeauty",
                    type : "string"
                },{
                    name : "description",
                    type : "string"
                } ]
                /*proxy : {
                    type : 'ajax',
                    url : 'resources/json/levels.json',
                    reader : {
                        type : 'json',
                        rootProperty : 'levels'
                    }
                }*/
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
