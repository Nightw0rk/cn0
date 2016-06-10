app.factory("ReportService", function($http, Session, $q) {
    return {
        save: function(cert) {
            var d = $q.defer();
            $http.post("http://crm.lorena-kuhni.ru:2080/reports/add?session="+Session.data.session, cert,{
              headers:{"X-Session":Session.data}
              }).then((body) => {
                    d.resolve();
                }, (err) => {
                    d.reject(err);
                })
            return d.promise;
        },
        getClientsToDay: function(){
          var d = $q.defer();
          if(!Session.data) return d.reject("Не авторизван");
          $http.get("http://crm.lorena-kuhni.ru:2080/reports/default/today/clients?session="+Session.data.session).then((body) => {
                  d.resolve(body.data.data);
              }, (err) => {
                  d.reject(err);
              })
          return d.promise;
        },
        getFollowWeek:function(){
          var d = $q.defer();
          $http.get("http://crm.lorena-kuhni.ru:2080/reports//default/today/follows?session="+Session.data.session)
            .then(body=>{d.resolve(body.data.follow)},d.reject);
          return d.promise;
        }
    }
});
