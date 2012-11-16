var Loading = {
            retrieving: null,
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
            careersRequest: function (searchString, knowledgeValue) {
                if (localStorage.searchString !== searchString || localStorage.knowledgeValue !== knowledgeValue)
                {
                    localStorage.searchString = searchString;
                    localStorage.knowledgeValue = knowledgeValue;
                    localStorage.offset = 0;
                    localStorage.total_count = 1;
                    localStorage.current_count = 0;
                    Dao.careersStore.all(function(arrCareers){
                      var empty = true;
		                  for(var i = 0; i<arrCareers.length;i++)
		                  {
		                    if(arrCareers[i].value.installed === false)
		                    {
		                        Dao.careersStore.remove(arrCareers[i]);
		                    }
		                  }
		                });
                }
                console.log('requesting careers...');
                console.log(searchString);
                console.log(knowledgeValue);
                console.log(localStorage.current_count);
                console.log(localStorage.total_count);
                
                if (parseInt(localStorage.current_count, 10)  < parseInt(localStorage.total_count, 10) && !Loading.retrieving)
                {
                    Loading.retrieving = true;
		    $.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Courses...')+'</p>' });
                    var HOST = GlobalSettings.getServerURL();
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
                    jQuery.ajax({
                        url: HOST + "/api/v1/career/?format=jsonp",
                        dataType : 'jsonp',
                        data: searchParams,
                        success: function (response, opts) {
                            localStorage.offset = response.meta.limit;
                            localStorage.total_count = response.meta.total_count;
                            var careers = response.objects;
                            console.log('vuelve');
                            $('#addcareerslist').empty();
                            for (var cont in careers) {
                                localStorage.current_count ++;
                                var obj = {name:careers[cont].name,description:careers[cont].description,levels:careers[cont].levels,activities:careers[cont].activities,installed:false};
                                console.log(obj);
                                Dao.careersStore.save({key:careers[cont].id,value:obj});
                            }
                            DrGlearning.refreshAddCareers();
                            Loading.retrieving = false;
			    $.unblockUI();
                        },
                        failure: function () {
                            Loading.retrieving = false;
			    $.unblockUI();
                        }
                    });
                }
            },
            getCareer: function(id) {
                $('#levelslist').empty();
                $('#levelslist').append(
                      '<li><a href="#"><h1>'+
                      i18n.gettext('Loading Levels...')+
                      '</h1><p>'+
                      '</p></a></li>');
		            $('#levelslist').listview("refresh");
                Dao.careersStore.get(DrGlearning.careerId,function(career){ 
                    $('#careerTitle').html(career.value.name);
                    $('#levelTitle').html(career.value.name);
                    $('#careerDescription').html(career.value.description);
                    var activities = career.value.activities;
                    var activitiesInstalled = 0;
                    var cont;
                    for (cont in activities) {

                        if (activities[cont])
                        {
                            var activitiesToInstall = [];
                            var size = 0;
                            var HOST = GlobalSettings.getServerURL();
                            jQuery.ajax({
                                url: HOST + activities[cont].full_activity_url + '?format=jsonp',
                                data: {
                                    deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                                    deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                                },
                                dataType : 'jsonp',
                                success: function (response, opts) {
                                    var activity = response;
                                    var activityModel = {
                                        id : activity.id,
                                        name : activity.name.trim(),
                                        careerId : id,
                                        activity_type : activity.activity_type.trim(),
                                        language_code : activity.language_code.trim(),
                                        level_type : activity.level_type,
                                        level_order : activity.level_order,
                                        level_required : activity.level_required,
                                        query : activity.query.trim(),
                                        timestamp : activity.timestamp.trim(),
                                        resource_uri : activity.resource_uri.trim(),
                                        reward: activity.reward.trim(),
                                        penalty: activity.penalty.trim(),
                                        score: 0,
                                        played: false,
                                        successful: false,
                                        helpviewed: false
                                    };
                                    if (activityModel.activity_type == 'linguistic') {
                                        //activityModel.setImage('image', activity.image, this);
                                        $.extend(activityModel,{ image_url : activity.image_url.trim()});
                                        $.extend(activityModel,{ locked_text : activity.locked_text.trim()});
                                        $.extend(activityModel,{ answer : activity.answer.trim()});
                                    }
                                    if (activityModel.activity_type == 'visual') {
                                        //activityModel.setImage('image', activity.image, this);
                                        //activityModel.setImage('obImage', activity.obfuscated_image, this);
                                        $.extend(activityModel,{ image_url : activity.image_url.trim()});
                                        $.extend(activityModel,{ obfuscated_image_url : activity.obfuscated_image_url.trim()});
                                        //activityModel.data.image=activity.image;
                                        $.extend(activityModel,{ answers : activity.answers});
                                        $.extend(activityModel,{ correct_answer : activity.correct_answer.trim()});
                                        //activityModel.set('obfuscated_image', activity.obfuscated_image);
                                        $.extend(activityModel,{ obfuscated_image_url : activity.obfuscated_image_url.trim()});
                                        $.extend(activityModel,{ time : activity.time.trim()});
                                    }
                                    if (activityModel.activity_type == 'quiz') {
                                        //activityModel.setImage('image', activity.image, this);
                                        $.extend(activityModel,{ image_url : activity.image_url });
                                        //activityModel.data.image=activity.image;
                                        $.extend(activityModel,{ answers : activity.answers });
                                        $.extend(activityModel,{ correct_answer : activity.correct_answer.trim()});
                                        //activityModel.set('obfuscated_image',activity.obfuscated_image);
                                        if (activity.time) {
                                            $.extend(activityModel,{time : activity.time.trim()});
                                        }
                                    }
                                    if (activityModel.activity_type == 'relational') {
                                        $.extend(activityModel,{ graph_nodes : activity.graph_nodes});
                                        for (var x in activity.graph_edges) {
                                            if (activity.graph_edges[x].inverse === undefined) {
                                                activity.graph_edges[x].inverse = "";
                                            }
                                        }
                                        $.extend(activityModel,{ graph_edges : activity.graph_edges});
                                        $.extend(activityModel,{ constraints : activity.constraints});
                                        $.extend(activityModel,{ path_limit : activity.path_limit});
                                    }
                                    if (activityModel.activity_type == 'temporal') {
                                        //activityModel.setImage('image', activity.image, this);
                                        $.extend(activityModel,{ image_url : activity.image_url.trim()});
                                        $.extend(activityModel,{ image_datetime : activity.image_datetime.trim()});
                                        $.extend(activityModel,{ query_datetime : activity.query_datetime.trim()});
                                    }
                                    if (activityModel.activity_type == 'geospatial') {
                                        $.extend(activityModel,{ area : activity.area.trim()});
                                        $.extend(activityModel,{ point : activity.points.trim()});
                                        $.extend(activityModel,{ radius : activity.radius});
                                    }
                                    activitiesToInstall.push(activityModel);
                                    activitiesInstalled = activitiesInstalled + 1;
                                    if (activities.length == activitiesInstalled) {
                                        for (var cont in activitiesToInstall) {
                                            if (activitiesToInstall[cont])
                                            {
                                                Dao.activitiesStore.save({key:activitiesToInstall[cont].id,value:activitiesToInstall[cont]});
                                            }
                                        }
                                        DrGlearning.refreshCareer();
                                    }
                                },
                                failure : function () {
                                    console.log('fallo');
                                    //Ext.Viewport.setMasked(false);
                                    //Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('Try again later'), Ext.emptyFn);
                                }
                            });
                        }
                    }
                    /*jQuery.ajax({
                        scope: this,
                        url: HOST + career.contents + '?format=jsonp',
                        data: {
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        },
                        dataType : 'jsonp',
                        success: function (response, opts) {
                            console.log(response);
                            for (var uri in response)
                            {
                                if (response[uri])
                                {
                                    console.log(response[uri]);
                                    //career.set(uri, response[uri]);
                                }
                            }
                            console.log(career);
                        },
                        failure: function () {
                            console.log('fallo');
                        }
                    });*/
            });
     }
}
