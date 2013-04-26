/*jshint
    forin:false, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES console catalogueFR i18n google GeoJSON StackTrace DrGlearning TERMS_VERSION unescape
*/

try {
    (function () {
    // Exceptions Catcher Begins

        //Ext.require('Phonegap');
        Ext.define('DrGlearning.controller.LoadingController', {
            extend: 'Ext.app.Controller',
            config: {
                refs:
                {
                    loading : 'loading',
                    loadingpanel: 'loadingpanel',
                    careerframe: 'careerframe',
                    careersframe: 'careersframe'
                }
            },
            retrieving : false,
            init: function () {
                this.daoController = this.getApplication().getController('DaoController');
                this.careersStore = Ext.getStore('Careers');
                this.knowledgesStore = Ext.getStore('Knowledges');
                this.termsStore = Ext.getStore('Terms');

                this.careersListController = this.getApplication().getController('CareersListController');
                this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
                this.offset = 0;
            },

            onLaunch: function () {
                //localStorage.restartNeeded = false;
                this.globalSettingsController.showMessage("loading............");
                //Add trim to prototype
                String.prototype.trim = function () {return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[\n\r]$/, ''); };
                //Aplication start
                Ext.create('DrGlearning.view.Loading');
                this.getLoading().show();
                //this.globalSettingsController.showMessage('Loading...');
                this.globalSettingsController.showMessage('Is device?');
                this.globalSettingsController.showMessage(this.getApplication().getController('GlobalSettingsController').isDevice());
                //view.show();
                //Seeing if course test is needed
                var testCourse = this.getParameter('course');
                if (typeof(testCourse) !== "null" && typeof(testCourse) !== "undefined") {
                    this.globalSettingsController.showMessage("Installing Test course");
                    this.globalSettingsController.showMessage(testCourse);
                    this.installTestCourse(testCourse);
                }
                this.careersStore.load();
                Ext.getStore('Activities').load();
                var usersStore = Ext.getStore('Users');
                this.globalSettingsController.showMessage(usersStore.getCount());
                //Create user if needed and block to run first app launch
                if (usersStore.getCount() === 0) {
                    localStorage.alignCls = 'leftAlign';
                    //First calculate max localstorage size
                    Ext.Viewport.setMasked({
                        xtype: 'loadmask',
                        message: i18n.gettext("Loading") + "…<br/>" + i18n.gettext("The first time, it might take a bit to load. Don't worry"),
                        indicator: true
                    });
                    this.getApplication().getController('MaxStorageSizeController').initTest(this);
                    localStorage.maxSize = 2600000;
                    localStorage.actualSize = 0;
                    this.globalSettingsController.showMessage("New user");
                    var digest;
                    if (this.getApplication().getController('GlobalSettingsController').isDevice()) {
                        digest = this.SHA1(window.device.uuid + " " + new Date().getTime());
                    } else {
                        digest = this.SHA1("test" + " " + new Date().getTime());
                    }
                    this.globalSettingsController.showMessage(digest);
                    //var userModel=Ext.ModelManager.getModel('DrGlearning.model.User');
                    //user.set('uniqueid:', digest);
                    var userModel = new DrGlearning.model.User({
                        uniqueid : digest,
                        token : ''
                    });
                    userModel.save();
                }
                this.knowledgesRequest();
                if (this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                    //Register user if needed
                    usersStore.sync();
                    usersStore.load();
                    var user = usersStore.getAt(0);
                    this.globalSettingsController.showMessage(user);
                    if (user !== undefined && user.data.token === '') {
                        this.globalSettingsController.showMessage("Registering user");
                        var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
                        Ext.data.JsonP.request({
                            scope: this,
                            url: HOST + "/api/v1/player/?format=jsonp",
                            params: {
                                code: user.data.uniqueid
                            },
                            success: function (response) {

                                this.globalSettingsController.showMessage(response);
								user.data.options = {careers:[],language:"en_US"};
                                user.data.token = response.token;
                                user.data.serverid = response.id;
                                user.data.resource_uri = response.resource_uri;
                                //user.save();
                                usersStore.sync();
                                this.globalSettingsController.showMessage("User successfully registered");
                            }
                        });
                        usersStore.sync();
                    }
                    //Here was the Career request

                    //if (localStorage.maxSize!=undefined) {
                    this.getLoading().hide();
                    this.showTerms();
                    this.getApplication().getController('CareersListController').initializate();
                    this.getApplication().getController('CareersListController').index();

                    //Ext.Viewport.setMasked(false);
                      //this.globalSettingsController.showMessage();
                      //this.globalSettingsController.showMessage("Listo1");
                    //this.getApplication().getController('DaoController').updateOfflineScores();

                } else {
                    //Ext.Viewport.setMasked(false);
                    this.globalSettingsController.showMessage("Listo2");
                    this.getLoading().hide();
                    this.showTerms();
                    Ext.Viewport.setMasked(false);
                    this.getApplication().getController('CareersListController').initializate();
                    this.getApplication().getController('CareersListController').index();
                }
            },
            showTerms: function () {
                var terms = Ext.create('DrGlearning.view.Terms');
                if (typeof(TERMS_VERSION) === "undefined") {
                    if (typeof(localStorage.terms_version) === "undefined")
                    {
                        this.termsStore.load(
                        {
                            callback: function () {
                                terms.setHtml(this.getAt(0).data.text);
                            }
                        });
                        Ext.Viewport.add(terms);
                        terms.show();

                        localStorage.terms_version = TERMS_VERSION;
                    }
                    if (TERMS_VERSION !== localStorage.terms_version)
                    {
                        this.termsStore.load(
                        {
                            callback: function () {
                                terms.setHtml(this.getAt(0).data.text);
                            }
                        });
                        Ext.Viewport.add(terms);
                        terms.show();
                    }
                }
            },
            careersRequest: function (searchString, knowledgeValue) {
                if (localStorage.searchString !== searchString || localStorage.knowledgeValue !== knowledgeValue)
                {
                    this.getCareersframe().down('careerslist').hide();
                    this.getCareersframe().down('panel[customId=emptyList]').hide();
                    this.getCareersframe().down('button[customId=addCareer]').hide();
                    localStorage.searchString = searchString;
                    localStorage.knowledgeValue = knowledgeValue;
                    localStorage.offset = 0;
                    localStorage.total_count = 1;
                    localStorage.current_count = 0;
                    this.careersStore.each(function (record) {
                        if (!record.data.installed) {
                            record.erase();
                        }
                    }, this);
                }
                if (parseInt(localStorage.current_count, 10)  < parseInt(localStorage.total_count, 10) && !this.retrieving && this.careersListController.installing === true)
                {
                    this.retrieving = true;
                    this.daoController.updateOfflineScores();
                    this.knowledgesRequest();
                    Ext.Viewport.setMasked({
                        xtype: 'loadmask',
                        message: i18n.gettext('Retrieving courses') + "…",
                        indicator: true,
                        html: "<img src='resources/images/ic_launcher.png'>"
                    });
                    var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
                    var searchParams = {
                        offset: localStorage.offset,
                        name__contains: localStorage.searchString,
                        deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                        deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                    };
                    if (localStorage.knowledgeValue !== 'All' && localStorage.knowledgeValue !== '')
                    {
                        searchParams = {
                            offset: localStorage.offset,
                            name__contains: localStorage.searchString,
                            knowledges__name: localStorage.knowledgeValue,
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        };
                    }
                    if (localStorage.knowledgeValue !== 'All' && localStorage.knowledgeValue === '')
                    {
                        searchParams = {
                            offset: localStorage.offset,
                            knowledges__name: localStorage.knowledgeValue,
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        };
                    }
                    if (localStorage.knowledgeValue === 'All' && localStorage.knowledgeValue !== '')
                    {
                        searchParams = {
                            offset: localStorage.offset,
                            name__contains: localStorage.searchString,
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        };
                    }
                    Ext.data.JsonP.request({
                        url: HOST + "/api/v1/career/?format=jsonp",
                        scope   : this,
                        params: searchParams,
                        success: function (response, opts) {
                            this.getCareersframe().down('careerslist').show();
                            this.getCareersframe().down('panel[customId=emptyList]').show();
                            this.getCareersframe().down('button[customId=addCareer]').show();
                            localStorage.offset = response.meta.limit;
                            localStorage.total_count = response.meta.total_count;
                            this.globalSettingsController.showMessage(localStorage.offset);
                            this.globalSettingsController.showMessage(localStorage.total_count);
                            var careers = response.objects;
                            this.careersStore.each(function (record) {
                                if (!record.data.installed) {
                                    var exist = false;
                                    for (var cont in careers) {
                                        if (careers[cont].id === record.data.id) {
                                            exist = true;
                                            break;
                                        }
                                    }
                                }
                            }, this);
                            this.careersStore.load();
                            this.careersStore.clearFilter();
                            for (var cont in careers) {
                                var career = careers[cont];
                                localStorage.current_count ++;
                                var careerModel;
                                if (this.careersStore.find('id', career.id) === -1) {
                                    careerModel = new DrGlearning.model.Career({
                                            id : parseInt(career.id, 10),
                                            levels : career.levels,
											has_code: career.has_code,
                                            negative_votes : career.negative_votes,
                                            positive_votes : career.positive_votes,
                                            name : career.name,
                                            description : career.description,
                                            creator : career.creator,
                                            resource_uri : career.resource_uri,
                                            knowledges : career.knowledges,
                                            timestamp : career.timestamp,
                                            installed : false,
                                            started : false,
                                            update : false,
                                            size: career.size,
                                            career_type: career.career_type,
                                            contents: career.contents.resource_uri
                                        });
                                    var activities = [];
                                    for (cont in career.activities) {
                                        activities[cont] = career.activities[cont].full_activity_url;
                                    }
                                    careerModel.set('activities', activities);
                                    careerModel.save();
                                    this.careersStore.load();
                                    this.careersStore.sync();
                                    this.globalSettingsController.showMessage(this.careersStore);
                                } else {
                                    this.globalSettingsController.showMessage('existe');
                                    //Watch for updates
                                    careerModel = this.careersStore.getAt(this.careersStore.find('id', career.id));
                                    if (careerModel.data.timestamp < career.timestamp && !careerModel.data.installed) {
                                        careerModel.data.update = true;
                                        careerModel.save();

                                    }
                                }
                            }
                            this.careersListController.showCareersToInstall();
                            Ext.Viewport.setMasked(false);
                            this.retrieving = false;
                        },
                        failure: function () {
                            Ext.Viewport.setMasked(false);
                            this.retrieving = false;
                        }
                    });
                }
            },
            knowledgesRequest: function () {
                this.globalSettingsController.showMessage('retrieving knowledges');
                localStorage.knowledgeFields = [];
                var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
                Ext.data.JsonP.request({
                    url: HOST + "/api/v1/knowledge/?format=jsonp",
                    scope   : this,
                    success: function (response, opts) {
                        var knowledges = response.objects;
                        this.knowledgesStore.removeAll();
                        for (var cont in knowledges) {
                            var knowledge = knowledges[cont];
                            var knowledgeModel = new DrGlearning.model.Knowledge({
                                name : this.getKnowledgeFieldName(knowledge.id, knowledge.name),
                                resource_uri : knowledge.resource_uri
                            });
                            knowledgeModel.save();
                        }
                    },
                    failure: function () {
                    }
                });
            },
            getKnowledgeFieldName: function (id, name)
            {
                var nameTemp;
                if (this.globalSettingsController.knowledgesList[id] !== undefined)
                {
                    nameTemp = this.globalSettingsController.knowledgesList[id];
                } else
                {
                    nameTemp = name;
                }
                return nameTemp;
            },

            pausecomp: function (ms) {
                ms += new Date().getTime();
                //while (new Date() < ms) {}
            },

            installTestCourse: function (url) {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Installing testing course') + "…",
                    indicator: true
                });
                this.careersStore.load();
                var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
                Ext.data.JsonP.request({
                    url: HOST + url + '?testing=true&format=jsonp',
                    scope   : this,
                    success: function (response, opts) {
                        this.globalSettingsController.showMessage("Career retrieved");
                        var career = response;
                        this.careersStore.each(function (record) {
                            if (record.data.installed) {
                                if (career.id === record.data.id) {
                                    this.globalSettingsController.showMessage('Test course ');
                                    this.getApplication().getController('DaoController').deleteCareer(career.id);
                                }
                            }
                        }, this);
                        var careerModel = new DrGlearning.model.Career({
                            id : career.id,
                            negative_votes : career.negative_votes,
                            positive_votes : career.positive_votes,
                            name : career.name,
                            description : career.description,
                            creator : career.creator,
                            resource_uri : career.resource_uri,
                            knowledges : career.knowledges,
                            timestamp : career.timestamp,
                            installed : true,
                            started : false,
                            update : false,
                            size: career.size
                        });
                        var activities = [];
                        for (var cont in career.activities) {
                            activities[cont] = career.activities[cont].full_activity_url;
                        }
                        careerModel.set('activities', activities);
                        careerModel.save();
                        this.careersStore.sync();
                        console.log('sync...');
                        this.careersStore.load();
                        //Ext.Viewport.setMasked(false);
                        this.getApplication().getController('DaoController').installCareer(career.id, function (scope) {
                            scope.careersListController.refreshingAfterImport();
                            scope.careersListController.index();
                            var temp = {};
                            temp.data = career;
                            scope.careersListController.selectedcareer = temp;
                            scope.getApplication().getController('CareerController').updateCareer(temp);
                            localStorage.selectedcareer = career.id;
                            scope.getCareersframe().hide();
                            scope.getCareerframe().down('button[id=backToCareers]').hide();
                            localStorage.selectedcareer = 0;
                            Ext.Viewport.setMasked(false); 
                        }, this,undefined,"testing");
                    }
                });
            },

            /**
            *
            *  Secure Hash Algorithm (SHA1)
            *  http://www.webtoolkit.info/
            *
            **/

            SHA1: function (msg) {

                function rotate_left(n, s) {
                    var t4 = (n<<s) | (n>>>(32 - s));
                    return t4;
                }

                function lsb_hex(val) {
                    var str = "";
                    var i;
                    var vh;
                    var vl;

                    for (i = 0; i <= 6; i += 2) {
                        vh = (val>>>(i * 4 + 4))&0x0f;
                        vl = (val>>>(i * 4))&0x0f;
                        str += vh.toString(16) + vl.toString(16);
                    }
                    return str;
                }

                function cvt_hex(val) {
                    var str = "";
                    var i;
                    var v;

                    for (i = 7; i >= 0; i--) {
                        v = (val>>>(i * 4))&0x0f;
                        str += v.toString(16);
                    }
                    return str;
                }


                function Utf8Encode(string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";

                    for (var n = 0; n < string.length; n++) {

                        var c = string.charCodeAt(n);

                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        }
                        else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }

                    }

                    return utftext;
                }

                var blockstart;
                var i, j;
                var W = new Array(80);
                var H0 = 0x67452301;
                var H1 = 0xEFCDAB89;
                var H2 = 0x98BADCFE;
                var H3 = 0x10325476;
                var H4 = 0xC3D2E1F0;
                var A, B, C, D, E;
                var temp;

                msg = Utf8Encode(msg);

                var msg_len = msg.length;

                var word_array = [];
                for (i = 0; i < msg_len - 3; i += 4) {
                    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i + 1)<<16 |
                    msg.charCodeAt(i + 2)<<8 | msg.charCodeAt(i + 3);
                    word_array.push(j);
                }

                switch (msg_len % 4) {
                case 0:
                    i = 0x080000000;
                    break;
                case 1:
                    i = msg.charCodeAt(msg_len - 1)<<24 | 0x0800000;
                    break;

                case 2:
                    i = msg.charCodeAt(msg_len - 2)<<24 | msg.charCodeAt(msg_len - 1)<<16 | 0x08000;
                    break;

                case 3:
                    i = msg.charCodeAt(msg_len - 3)<<24 | msg.charCodeAt(msg_len - 2)<<16 | msg.charCodeAt(msg_len - 1)<<8    | 0x80;
                    break;
                }

                word_array.push(i);

                while ((word_array.length % 16) !== 14) {word_array.push(0); }

                word_array.push(msg_len>>>29);
                word_array.push((msg_len<<3)&0x0ffffffff);


                for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

                    for (i = 0; i < 16; i++) { W[i] = word_array[blockstart + i]; }
                    for (i = 16; i <= 79; i++) { W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1); }

                    A = H0;
                    B = H1;
                    C = H2;
                    D = H3;
                    E = H4;

                    for (i = 0; i <= 19; i++) {
                        temp = (rotate_left(A, 5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }

                    for (i = 20; i <= 39; i++) {
                        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }

                    for (i = 40;i <= 59;i++) {
                        temp = (rotate_left(A, 5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }

                    for (i = 60; i <= 79; i++) {
                        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }

                    H0 = (H0 + A) & 0x0ffffffff;
                    H1 = (H1 + B) & 0x0ffffffff;
                    H2 = (H2 + C) & 0x0ffffffff;
                    H3 = (H3 + D) & 0x0ffffffff;
                    H4 = (H4 + E) & 0x0ffffffff;

                }

                temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

                return temp.toLowerCase();

            },

            getParameter: function (param) {
                var queryString = window.location.search;
                var parameterName = param + "=";
                var begin, end;
                if (queryString.length > 0) {
                  // Find the beginning of the string
                    begin = queryString.indexOf(parameterName);
                  // If the parameter name is not found, skip it, otherwise return the value
                    if (begin !== -1) {
                     // Add the length (integer) to the beginning
                        begin += parameterName.length;
                     // Multiple parameters are separated by the "&" sign
                        end = queryString.indexOf("&", begin);
                        if (end === -1) {
                            end = queryString.length;
                        }
                  // Return the string
                        return unescape(queryString.substring(begin, end));
                    }
               // Return "null" if no parameter has been found
                    return "null";
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
