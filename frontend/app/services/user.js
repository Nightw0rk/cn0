app.factory("AuthService", function($http, Session, $q) {
    return {
        login: function(cert) {
            var d = $q.defer();
            $http.post("http://crm.lorena-kuhni.ru:2080/auth/login", cert)
                .then((body) => {
                    if(body.data.status=='OK'){
                      Session.create(body.data.result);
                      d.resolve();
                    } else{
                      d.reject(body.data.msg)
                    }
                }, (err) => {
                    d.reject(err);
                })
            return d.promise;
        },
        isAuthenticated: function() {
            return Session.data && Session.data.session;
        }
    }
});

app.service("Session", function() {
    this.data = {};
    this.create = function(user) {
        this.data = user;
    };
    this.destroy = function() {
        this.data = null;
    }
    return this;
})
