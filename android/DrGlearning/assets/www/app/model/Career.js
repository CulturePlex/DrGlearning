Ext.define('DrGlearning.model.Career', {
    extend : 'Ext.data.Model',
    config : {
        fields : [ {
            name : "id",
            type : "int"
        }, {
            name : "activities",
            type : "auto"
        }, {
            name : "levels",
            type : "auto"
        }, {
            name : "negative_votes",
            type : "string"
        }, {
            name : "positive_votes",
            type : "string"
        }, {
            name : "name",
            type : "string"
        }, {
            name : "description",
            type : "string"
        }, {
            name : "creator",
            type : "string"
        }, {
            name : "resource_uri",
            type : "string"
        }, {
            name : "knowledges",
            type : "auto"
        }, {
            name : "timestamp",
            type : "string"
        }, {
            name : "installed",
            type : "boolean"
        }, {
            name : "started",
            type : "boolean"
        }, {
            name : "update",
            type : "boolean"
        },{
            name : "size",
            type : "int"
        },{
            name : "career_type",
            type : "string"
        },
        //A string field for eachlevel, "exists" means exists but not successed and allowed, and "successed" means exists and successed, "notallowed" means not allowed (for exam careers)
        {
            name: "illetratum",
            type: "string",
        },{
            name: "primary",
            type: "string",
        },{
            name: "secondary",
            type: "string",
        },{
            name: "highschool",
            type: "string",
        },{
            name: "college",
            type: "string",
        },{
            name: "master",
            type: "string",
        },{
            name: "phd",
            type: "string",
        },{
            name: "postdoc",
            type: "string",
        },{
            name: "professor",
            type: "string",
        },{
            name: "emeritus",
            type: "string",
        },
        
        ],
        proxy : {
            type : 'localstorage',
            id : 'DrGlearningCareers'
        }
    }
});
