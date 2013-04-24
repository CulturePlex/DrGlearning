/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace
*/


try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.model.Career', {
            extend : 'Ext.data.Model',
            config : {
                fields : [ {
                    name : "id",
                    type : "int"
                }, {
                    name : "customId",
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
                }, {
                    name : "has_code",
                    type : "boolean"
                }, {
                    name : "code",
                    type : "string"
                }, {
                    name : "size",
                    type : "int"
                }, {
                    name : "career_type",
                    type : "string"
                },
                //A string field for eachlevel, "exists" means exists but not successed and allowed, and "successed" means exists and successed, "notallowed" means not allowed (for exam careers)
                {
                    name: "illetratum",
                    type: "string"
                }, {
                    name: "primary",
                    type: "string"
                }, {
                    name: "secondary",
                    type: "string"
                }, {
                    name: "highschool",
                    type: "string"
                }, {
                    name: "college",
                    type: "string"
                }, {
                    name: "master",
                    type: "string"
                }, {
                    name: "phd",
                    type: "string"
                }, {
                    name: "postdoc",
                    type: "string"
                }, {
                    name: "professor",
                    type: "string"
                }, {
                    name: "emeritus",
                    type: "string"
                }, {
                    name: "contents",
                    type: "auto"
                }, {
                    name: "level1",
                    type: "auto"
                }, {
                    name: "level2",
                    type: "auto"
                }, {
                    name: "level3",
                    type: "auto"
                }, {
                    name: "level4",
                    type: "auto"
                }, {
                    name: "level5",
                    type: "auto"
                }, {
                    name: "level6",
                    type: "auto"
                }, {
                    name: "level7",
                    type: "auto"
                }, {
                    name: "level8",
                    type: "auto"
                }, {
                    name: "level9",
                    type: "auto"
                }, {
                    name: "level10",
                    type: "auto"
                }, {
                    name: "level1_description",
                    type: "auto"
                }, {
                    name: "level2_description",
                    type: "auto"
                }, {
                    name: "level3_description",
                    type: "auto"
                }, {
                    name: "level4_description",
                    type: "auto"
                }, {
                    name: "level5_description",
                    type: "auto"
                }, {
                    name: "level6_description",
                    type: "auto"
                }, {
                    name: "level7_description",
                    type: "auto"
                }, {
                    name: "level8_description",
                    type: "auto"
                }, {
                    name: "level9_description",
                    type: "auto"
                }, {
                    name: "level10_description",
                    type: "auto"
                }, {
                    name: "level1_url",
                    type: "auto"
                }, {
                    name: "level2_url",
                    type: "auto"
                }, {
                    name: "level3_url",
                    type: "auto"
                }, {
                    name: "level4_url",
                    type: "auto"
                }, {
                    name: "level5_url",
                    type: "auto"
                }, {
                    name: "level6_url",
                    type: "auto"
                }, {
                    name: "level7_url",
                    type: "auto"
                }, {
                    name: "level8_url",
                    type: "auto"
                }, {
                    name: "level9_url",
                    type: "auto"
                }, {
                    name: "level10_url",
                    type: "auto"
                }, {
                    name: "main",
                    type: "auto"
                }, {
                    name: "main_url",
                    type: "auto"
                }
                ],
                proxy : {
                    type : 'localstorage',
                    id : 'DrGlearningCareers'
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
