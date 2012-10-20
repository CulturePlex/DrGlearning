var GlobalSettings = {
    isDevice: function () {
        if (window.device === undefined) {
            return false;
        } else {
            return true;
        }
    },
}
