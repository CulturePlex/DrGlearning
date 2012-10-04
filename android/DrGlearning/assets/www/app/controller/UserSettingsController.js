/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50 noempty:false
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace
*/
try {
    (function () {
    // Exceptions Catcher Begins
        Ext.define('DrGlearning.controller.UserSettingsController', {
            extend : 'Ext.app.Controller',
            careersToPreinstall: null,
            preinstallingIndex: null,
            lossettingsView: null,
            importedScores: null,
            init : function () {
            },
            launch : function () {
                this.careersStore = Ext.getStore('Careers');
                this.activitiesStore = Ext.getStore('Activities');
                this.offlineScoresStore = Ext.getStore('OfflineScores');
                this.daoController = this.getApplication().getController('DaoController');
                this.careersListController = this.getApplication().getController('CareersListController');
                this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
                this.careersStore = Ext.getStore('Careers');
            },
            settings : function () {
                var userStore = Ext.getStore('Users');
                userStore.load();
                this.settingsView =  view;
                var view = this.getSettings();
                if (!view) {
                    view = Ext.create('DrGlearning.view.Settings');
                }
                if (!view.getParent()) {
                    Ext.Viewport.add(view);
                }
                view.show();
                this.lossettingsView =  view;
                console.log(this.lossettingsView);
                this.getCareersframe().hide();
                var usernameField = view.down('textfield[id=username]');
                var emailField = view.down('textfield[id=email]');
                var user = userStore.getAt(0);
                emailField.setValue(user.data.email);
                usernameField.setValue(user.data.display_name);
            },
            saveSettings : function () {
                var userStore = Ext.getStore('Users');
                userStore.load();
                var view = this.getSettings();
                var usernameField = view.down('textfield[id=username]').getValue();
                var emailField = view.down('textfield[id=email]').getValue();
                var user = userStore.getAt(0);
                var changed = false;
                if(emailField !== user.data.email || usernameField !== user.data.display_name)
                {
                  var changed = true;
                }
                user.set('display_name', usernameField);
                user.set('email', emailField);
                user.save();
                userStore.sync();
                var locale = view.down('selectfield[id=locale]').getValue();
                if (localStorage.locale !== locale) {
                    if (locale === "ar")
                    {
                        localStorage.alignCls = 'rightalign';
                    } else
                    {
                        localStorage.alignCls = 'leftalign';
                    }
                    localStorage.locale = locale;
                    Ext.Msg.alert(i18n.gettext('Language changed'), i18n.gettext('You need to restart the app to see the changes'), Ext.emptyFn);
               }
               view.hide();
               this.getCareersframe().show();
               if(changed)
               {
                if (!this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                        Ext.Msg.alert(i18n.gettext('No Internet'), i18n.gettext('You need Internet connection to sync your profile'), function ()
                        {
                          view.down('textfield[id=username]').setValue(user.data.display_name);
                          view.down('textfield[id=email]').setValue(user.data.email);
                        }, this);
                    } else
                    {
                        this.daoController.updateOfflineScores();
                    }
               }
            },
            exportUser : function () {
                var userStore = Ext.getStore('Users');
                userStore.load();
                var user = userStore.getAt(0);
                new Ext.MessageBox().show({
                    title : i18n.gettext('Export user'),
                    items : [ {
                        xtype : 'textareafield',
                        label : i18n.gettext('Copy and paste this code in another<br>device') + ":",
                        name : 'id',
                        id : 'id',
                        labelAlign : 'top',
                        value : user.data.uniqueid,
                        clearIcon : false
                    } ],
                    multiline : true,
                    width:'100%',
                    buttons : Ext.Msg.OK,
                    icon : Ext.Msg.INFO
                });

            },
            userDataReceived: function(response,opts){
                var userStore = Ext.getStore('Users');
                userStore.load();
                var user = userStore.getAt(0);
                var HOST = this.globalSettingsController.getServerURL();
                Ext.data.JsonP.request({
                    scope: this,
                    url: HOST + '/api/v1/score/?format=jsonp',
                    params: {
                          player: response.id,
                    },
                    success: function (response, opts) {
                      this.getApplication().getController('UserSettingsController').collectCareersFromScores(response,opts);
                    },
                    failure : function () {
                      Ext.Viewport.setMasked(false);
                      Ext.Msg.alert(i18n.gettext('Unable to Import'), i18n.gettext('Unable to Import User Data'), Ext.emptyFn);
                  }
                });

                user.data.uniqueid = response.code;
                user.data.display_name = response.display_name;
                user.data.email = response.email;
                user.save();
           
                var usernameField = Ext.ComponentQuery.query('textfield[id=username]')[0];
                console.log(usernameField);
                var emailField = Ext.ComponentQuery.query('textfield[id=email]')[0];
                emailField.setValue(user.data.email);
                usernameField.setValue(user.data.display_name);
                

            },
            collectCareersFromScores: function(response,objects) {
              careersToPreinstall = [];
              for (x in response.objects) {
                  if(careersToPreinstall.indexOf(response.objects[x].career_id)==-1)
                  {
                    careersToPreinstall.push(response.objects[x].career_id);
                  }
              }
              this.preinstallingIndex = 0;
              this.importedScores = response.objects;
              this.preinstall();
            },
            preinstall:function (scores) {
              //Downloading career Data:
              console.log(this.preinstallingIndex);
              console.log(careersToPreinstall.length);
              if(parseInt(this.preinstallingIndex,10) < parseInt(careersToPreinstall.length,10))
              {
                var HOST = this.globalSettingsController.getServerURL();
                Ext.data.JsonP.request({
                        url: HOST + "/api/v1/career/"+careersToPreinstall[this.preinstallingIndex]+"/?format=jsonp",
                        scope   : this,
                        success: function (response, opts) {
                            console.log(response);
                            var career = response;
                            var careerModel;
                            if (this.careersStore.find('id', career.id) === -1) {
                                careerModel = new DrGlearning.model.Career({
                                  id : parseInt(career.id, 10),
                                  customId : parseInt(career.id, 10),
                                  levels : career.levels,
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
                            } else 
                            {
                                //Watch for updates
                                careerModel = this.careersStore.getAt(this.careersStore.find('id', career.id));
                                if (careerModel.data.timestamp < career.timestamp && !careerModel.data.installed) {
                                    careerModel.data.update = true;
                                    careerModel.save();

                                }
                              
                            }
                            this.retrieving = false;
                            this.getApplication().getController('DaoController').preinstallCareer(careerModel);
                        },
                        failure: function () {
                            Ext.Viewport.setMasked(false);
                            console.log('error downloading career data');
                            this.retrieving = false;
                        }
                    });
              }else
              {
                this.careersStore.clearFilter();
                this.careersStore.filter("installed", true);
                for (var x in this.importedScores)
                {
                  console.log(this.importedScores[x]);
                  this.daoController.activityPlayed(this.importedScores[x].activity_id,this.importedScores[x].is_passed,this.importedScores[x].score,true);
                }
                Ext.Viewport.setMasked(false);
                Ext.Msg.alert(i18n.gettext('User Data Successfully Imported'), i18n.gettext('Your User Data have been imported to this device. You should restart the app to see the changes'), function(){
                
                });
                this.careersListController.filterCareers();
              }
            },
            importUser : function () {
                var userStore = Ext.getStore('Users');
                userStore.load();
                var user = userStore.getAt(0);
                var saveButton = Ext.create('Ext.Button', {
                    scope : this,
                    text : i18n.gettext('Save')
                });
                var cancelButton = Ext.create('Ext.Button', {
                    scope : this,
                    text : i18n.gettext('Cancel')
                });
                var show = new Ext.MessageBox().show({
                    id : 'info',
                    title : i18n.gettext('Import user'),
                    items : [ {
                        xtype : 'textareafield',
                        labelAlign : 'top',
                        label : i18n.gettext('Paste your code here') + ":",
                        clearIcon : false,
                        value : '',
                        id : 'importvalue'
                    } ],
                    buttons : [ cancelButton, saveButton ],
                    icon : Ext.Msg.INFO
                });
                saveButton.setHandler(function () {
                    show.hide();
                    Ext.Msg.confirm(i18n.gettext("Import User"), i18n.gettext("Are you sure you want to import user data? Your actual user data will be lost. If you want to keep your actual data use this code:<br>") + user.data.uniqueid.substr(0, 15) +'<br>'+ user.data.uniqueid.substr(15, user.data.uniqueid.length), function (answer)
                    {
                        if (answer === 'yes') {
                          Ext.Viewport.setMasked({
                            xtype: 'loadmask',
                            message: i18n.gettext('Importing User Data') + "…",
                            indicator: true
                          });
                          Ext.getStore('OfflineScores').removeAll();
                          Ext.getStore('Careers').removeAll();
                          Ext.getStore('Activities').removeAll();
                          var uniqueid = show.down('#importvalue').getValue();
                          this.destroy(show);
                          var usersStore = Ext.getStore('Users');
                          var user = usersStore.getAt(0);
                          var HOST = this.globalSettingsController.getServerURL();
                          Ext.data.JsonP.request({
                              scope: this,
                              url: HOST + '/api/v1/player/?format=jsonp',
                              params: {
                                    code: uniqueid,
                              },
                             success: function (response, opts) {
                                if(response.token == null)
                                {
                                  this.getApplication().getController('UserSettingsController').userDataReceived(response,opts);
                                }
                                else
                                {
                                  Ext.Msg.alert(i18n.gettext('Unable to Import'), i18n.gettext('You typed an incorrect code'), Ext.emptyFn);
                                }

                             },
                             failure : function () {
                               Ext.Viewport.setMasked(false);
                               Ext.Msg.alert(i18n.gettext('Unable to Import'), i18n.gettext('Unable to Import User Data'), Ext.emptyFn);
                            }
                          });
                        }
                    }, this); 
                });
                cancelButton.setHandler(function () {
                    show.hide();
                    this.destroy(show);
                });
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
