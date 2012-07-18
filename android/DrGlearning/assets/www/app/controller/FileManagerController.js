/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:false, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace MathJax LocalFileSystem Base64Manager
*/
try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.FileManagerController', {
            extend: 'Ext.app.Controller',

            init: function () {
            },

            onLaunch: function () {
            },
            /**
               * Use this parameter to customize the folder in which you want to store the files
               */
            DIRECTORY: "base64storage",
              /**
               * Saves the imageData in a text file called imageId+sufix.b64
               */
            storeImage: function (imageData, imageId, sufix) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successFS, fail);
                sufix = (typeof(sufix) !== "undefined") ? sufix : "";
                var imageName = "image" + imageId + sufix + ".b64";
                function successFS(fileSystem) {
                    fileSystem.root.getDirectory(Base64Manager.DIRECTORY, {create: true, exclusive: false}, successDirectory, fail);
                }
                function successDirectory(parent) {
                    parent.getFile(imageName, {create: true, exclusive: false}, successFile, fail);
                }
                function successFile(fileEntry) {
                    fileEntry.createWriter(successFileWriter, fail);
                }
                function successFileWriter(writer) {
                    writer.onwrite = function (evt) {
                    // Put your onwrite callback here
                    };
                    writer.write(imageData);
                }
                function fail(error) {
                    //console.log('Error al guardar imagen '+error);
                }
                return imageName;
            },
              /**
               * Reads the content of fileName storing base64 information.
               * The targetId is mandatory to load the image through a
               * callback in the DOM element with that id.
               */
            retrieveImage: function (imageId, sufix, component, controller, view, newActivity, isTable) {
                function successFS(fileSystem) {
                    fileSystem.root.getDirectory(Base64Manager.DIRECTORY, {create: true, exclusive: false}, successDirectory, fail);
                }
                function successDirectory(parent) {
                    var imageName = "image" + imageId + sufix + ".b64";
                    //console.log("Loading "+imageName);
                    parent.getFile(imageName, {create: true, exclusive: false}, successFile, fail);
                }
                function successFile(fileEntry) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        var value = evt.target.result;
                        if (isTable) {
                            controller.loadingImages(view, newActivity, value);
                        } else {
                            component.setHtml('<img id="image" alt="imagen" src="' + value + '" />');
                            controller.loadingImages(view, newActivity);    
                        }
                    };
                    reader.readAsText(fileEntry);
                }
                function fail(error) {
                    //console.log('Error al recuperar imagen ' + error);
                }
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successFS, fail);
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
