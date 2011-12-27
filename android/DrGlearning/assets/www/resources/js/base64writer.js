var Base64Manager = {
  DIRECTORY: ".drglearning",

  storeImage: function(imageData, activity, sufix){
    if (LocalFileSystem == undefined) {
      return imageData;
    }
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successFS, fail);


    function successFS(fileSystem) {
      fileSystem.root.getDirectory(Base64Manager.DIRECTORY , {create: true, exclusive: false}, successDirectory, fail);
    }

    function successDirectory(parent){
      sufix = (sufix!=undefined) ? sufix : "";
      var imageName = "image" + activity.id + sufix + ".b64";
      parent.getFile(imageName, {create: true, exclusive: false}, successFile, fail);
    }

    function successFile(fileEntry) {
      fileEntry.createWriter(successFileWriter, fail);
    }

    function successFileWriter(writer) {
      writer.onwrite = function(evt) {
        console.log("Image successfully written");
      };
      writer.write(imageData);
    }

    function fail(error) {
      console.log(error);
      // We send back the information in case the device does not
      // implement the FileWriter interface (Desktop WebKit debugging)
      return imageData;
    }

    // TODO Send file URI and implement method to return base64 info from it
    return imageData;
  }
};