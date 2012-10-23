var Dao = {
    careersStore : new Lawnchair({name:'careers'}, function(e) {
          console.log('Careers Storage Open');
        }),
    installCareer: function (element) {
        element.parent().remove();
        console.log(this.careersStore);
    },
}

