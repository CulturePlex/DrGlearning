var Dao = {
    careersStore : new Lawnchair({adapter:'dom',name:'careers'}, function(e) {
          console.log('Careers Storage Open');
        }),
    installCareer: function (element) {
        //Dao.careersStore.get({key:element.attr("data-href"), installed:true});
        Dao.careersStore.get(element.attr("data-href"),function(r){ 
            r.value.installed = true;
            Dao.careersStore.save({key:element.attr("data-href"), value: r.value});
        });
	      DrGlearning.refreshAddCareers();
    },
}

