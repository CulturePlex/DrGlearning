var GlobalSettings = {
    getServerURL: function () {
      //return 'http://drglearning.testing.cultureplex.ca';
      return 'http://beta.drglearning.com';
      //return 'http://0.0.0.0:8000';
    },
    isDevice: function () {
        if (window.device === undefined) {
            return false;
        } else {
            return true;
        }
    },
}
