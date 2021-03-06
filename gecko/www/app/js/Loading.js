//Loading controller
var Loading = {
            //Variable to keep if we are retrieving courses currently or not
            retrieving: null,
            //Secure Hash Algorithm 1 to crypt some communications with server
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
            //Method to request courses from server given a search string and/or knowledge field or course id
            careersRequest: function (searchString, knowledgeValue,id) {
				var localSearchString;
				Dao.userStore.get('searchString',function(me)
				{
					localSearchString = (me !== null) ? me.value : '';
				});
				var localKnowledgeValue;
				Dao.userStore.get('knowledgeValue',function(me)
				{
						localKnowledgeValue = (me !== null) ? me.value : '';
				});
				var localCurrentCount;
				Dao.userStore.get('current_count',function(me)
				{
						localCurrentCount =  (me !== null) ? me.value : 0;
				});			
				var localTotalCount;
				Dao.userStore.get('total_count',function(me)
				{
						localTotalCount =  (me !== null) ? me.value : 0;
				});	
				var localOffset;
				Dao.userStore.get('offset',function(me)
				{
						localOffset = (me !== null) ? me.value : 0;
				});	
                if (localSearchString !== searchString || localKnowledgeValue !== knowledgeValue)
                {
					Dao.userStore.save({key:'searchString',value:searchString});
					Dao.userStore.save({key:'knowledgeValue',value:knowledgeValue});
					Dao.userStore.save({key:'offset',value:0});
                    localOffset = 0;
					Dao.userStore.save({key:'total_count',value:1});
                    localTotalCount = 1;
					Dao.userStore.save({key:'current_count',value:0});
                    localStorageCurrentCount = 0;
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
              
                if (parseInt(localCurrentCount, 10)  < parseInt(localTotalCount, 10) && !Loading.retrieving)
                {
                    Loading.retrieving = true;
		   			$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Courses...')+'</p>' });
                    var HOST = GlobalSettings.getServerURL();
                    var searchParams = {
                        offset: localOffset,
                        name__contains: localSearchString,
                        deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                        deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                    };
                    if (localKnowledgeValue !== 'All' && localKnowledgeValue !== '')
                    {
                        searchParams = {
                            offset: localOffset,
                            name__contains: searchString,
                            knowledges__name: localKnowledgeValue,
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        };
                    }
                    if (localKnowledgeValue !== 'All' && localKnowledgeValue === '')
                    {
                        searchParams = {
                            offset: localOffset,
                            name__contains: '',
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        };
                    }
                    if (localKnowledgeValue === 'All' && localKnowledgeValue !== '')
                    {
                        searchParams = {
                            offset: localOffset,
                            name__contains: searchString,
                            deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                            deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200
                        };
                    }
					if(id)
					{
						searchParams.id=id;
					}
                    jQuery.ajax({
						type:'GET',
                        url:  HOST + "/api/v1/career/?format=json",
                        data: searchParams,
						dataType:'json',
						success: function (response, opts) {
							Dao.userStore.save({key:'offset',value:response.meta.limit});
                            //localStorage.offset = response.meta.limit;
							Dao.userStore.save({key:'total_count',value:response.meta.total_count});
                            //localStorage.total_count = response.meta.total_count;
                            var careers = response.objects;
                            $('#addcareerslist').empty();
                            for (var cont in careers) {
                                localCurrentCount ++;
								Dao.userStore.save({key:'current_count',value:localCurrentCount});
								Dao.careersStore.keys(function(keys) {
									if(keys.indexOf(careers[cont].id.toString())==-1)
									{
				                        var obj = {
											name:careers[cont].name,
											description:careers[cont].description,
											levels:careers[cont].levels,
											activities:careers[cont].activities,
											installed:false,
											career_type:careers[cont].career_type,
											timestamp:careers[cont].timestamp,
											has_code:careers[cont].has_code};
				                        Dao.careersStore.save({key:careers[cont].id,value:obj});
									}
								})
                            }
                            DrGlearning.refreshAddCareers();
                            Loading.retrieving = false;
			    			$.unblockUI();
                        },
                        failure: function () {
                            console.log('fallo');
                            Loading.retrieving = false;
							$.unblockUI();
			            }
			        });
                }
            },
            //Mehtod to request only one course, only the information, not the activities
			requestACareer: function (id) {
		   			$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Courses...')+'</p>' });
                    var HOST = GlobalSettings.getServerURL();
                   
                    jQuery.ajax({
						type:'GET',
                        url:  HOST + "/api/v1/career/"+id+"/?format=json",
						dataType:'json',
						success: function (response, opts) {
                            var obj = {
								name:response.name, 		
								description:response.description, 
								levels:response.levels, 
								activities:response.activities, 
								installed:false, 
								career_type:response.career_type,
								timestamp:response.timestamp,
								has_code:response.has_code
							};
				            Dao.careersStore.save({key:response.id,value:obj});
							var careerModel;
							Dao.careersStore.get(response.id,function(career){
								careerModel = career;
							});
							
							console.log(response);
							if(DrGlearning.embed && response.has_code)
							{
								console.log(1);
								UserSettings.careerTemp = careerModel;
								XD.postMessage({'action': 'getCourseCode','params':{'id':parseInt(id, 10)}}, DrGlearning.embedImport, parent);

							}
							else
							{
								console.log(2);
								Loading.getCareer(id);
							}
                            Loading.retrieving = false;

                        },
                        failure: function () {
                            console.log('fallo');
                            Loading.retrieving = false;
							$.unblockUI();
			            }
			        });
            },
            //Method to get the activities from a career requested previously 
            getCareer: function(id) {
				var params = {
                    deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                    deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200,
                };
                $('#levelslist').empty();
                $('#levelslist').append(
                      '<li><a href="#"><h1>'+
                      i18n.gettext('Loading Levels...')+
                      '</h1><p>'+
                      '</p></a></li>');
				var user_id;
				Dao.userStore.get('id',function(me)
				{
					user_id = (me !== null) ? me.value : '';
				});
                Dao.careersStore.get(id,function(career){
                    console.log(career); 
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
                                url: HOST + activities[cont].full_activity_url + '?format=json',
                                data: {
                                    deviceWidth: (window.screen.width !== undefined) ? window.screen.width : 200,
                                    deviceHeight: (window.screen.height !== undefined) ? window.screen.height : 200,
									"callback": "a",
				                    "player__id": user_id
                                },
                                dataType : 'json',
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
                                        score: (activity.best_score !== null) ? activity.best_score : 0,
								        played: (activity.best_score !== null) ? true : false,
								        successful: (activity.is_passed === true) ? true : false,
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
                                            if (activitiesToInstall[cont] )
                                            {
												//Code added to avoid geospatial activities installation for 17-12-12 presentation
												//if(activitiesToInstall[cont].activity_type != "geospatial")
                                                Dao.activitiesStore.save({key:activitiesToInstall[cont].id,value:activitiesToInstall[cont]});
                                            }
                                        }
										career.value.installed = true;
										console.log(career);
										Dao.careersStore.save({key:career.key,value:career.value});
                                        DrGlearning.refreshMain();						
										$.unblockUI();
										var temp;
										Dao.userStore.get('options',function(me) {
											temp = me;
										});			
										if(!temp.value.careers)
										{
											temp.value.careers = [];
										}
										temp.value.careers.push(id);	
										Dao.userStore.save({key:'options',value:temp.value});
										UserSettings.updateUserSettings();
										if(DrGlearning.embed)
										{
											$.mobile.changePage("#career");
										}
                                    }
                                },
                                failure : function () {
                                    console.log('fallo');
									$.unblockUI();
                                    
                                }
                            });
                        }
                    }
                  
                });
            },
            //Method to create a new user and send the propper information to server
            createUser: function(uniqueid) {
                jQuery.ajax({
                    url: GlobalSettings.getServerURL() + "/api/v1/player/?format=json" ,
                    dataType : 'json',
                    data: {
					    "callback": "a",
                        "code": uniqueid
                    },
                    success: function (response) {
					    response.options = {};
					    var options = { careers : [] };
					    Dao.userStore.save({key:'id',value:response.id});
					    Dao.userStore.save({key:'options',value:options});
					    Dao.userStore.save({key:'token',value:response.token});
                        //localStorage.token = response.token;
                    }
                });
            }
}
