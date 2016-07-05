app.factory("ReportService", function ($http, Session, $q) {
    return {
        save: function (cert) {
            var d = $q.defer();
            $http.post(options.api.base_url + "/reports/add?session=" + Session.data.session, cert, {
                headers: { "X-Session": Session.data }
            }).then((body) => {
                d.resolve();
            }, (err) => {
                d.reject(err);
            })
            return d.promise;
        },
        getClientsToDay: function () {
            var d = $q.defer();
            if (!Session.data) return d.reject("Не авторизван");
            $http.get(options.api.base_url + "/reports/default/today/clients?session=" + Session.data.session).then((body) => {
                d.resolve(body.data);
            }, (err) => {
                d.reject(err);
            })
            return d.promise;
        },
        getClientsRange: function (start, end) {
            var d = $q.defer();
            if (!Session.data) return d.reject("Не авторизван");
            $http.get(options.api.base_url + "/reports/default/range/clients/" + start + "/" + end + "?session=" + Session.data.session).then((body) => {
                d.resolve(body.data.data);
            }, (err) => {
                d.reject(err);
            })
            return d.promise;
        },
        getFollowWeek: function () {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/default/today/follows?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.follow) }, d.reject);
            return d.promise;
        },
        getFollowRange: function (start, end) {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/default/range/follows/" + start + "/" + end + "?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.follow) }, d.reject);
            return d.promise;
        },
        getDrawRange: function (start, end) {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/default/range/draw/" + start + "/" + end + "?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.data) }, d.reject);
            return d.promise;
        },
        getZakazRange: function (start, end) {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/default/range/zakaz/" + start + "/" + end + "?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.data) }, d.reject);
            return d.promise;
        },
        getPayRange: function (start, end) {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/default/range/pay/" + start + "/" + end + "?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.data) }, d.reject);
            return d.promise;
        },
        getSecondPayRange: function (start, end) {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/default/range/secondpay/" + start + "/" + end + "?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.data) }, d.reject);
            return d.promise;
        },
        getSalonStats: function (start, end) {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/salons/stats/" + start + "/" + end + "?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.salons) }, d.reject);
            return d.promise;
        },
        getSalonStaffStats: function (name, start, end) {
            var d = $q.defer();
            $http.get(options.api.base_url + "/reports/salon/" + name + "/staff/stats/" + start + "/" + end + "?session=" + Session.data.session)
                .then(body => { d.resolve(body.data.staff) }, d.reject);
            return d.promise;
        }
    }
});
