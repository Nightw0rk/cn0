"use strict";
var options = {};
options.msInDay = 86400000;
options.api = {};
options.api.base_url = "http://crm.lorena-kuhni.ru:2080";
var app = angular.module('CRM', ['ngMaterial', 'ngRoute', 'googlechart']);
app.config(function ($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
    $mdIconProvider
        .defaultIconSet('app/assets/images/core-icons.svg', 24);
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('blue')
        .dark();
    $mdThemingProvider.theme('default')
        .primaryPalette('amber')
        .accentPalette('green');
    $routeProvider
        .when("/", {
            controller: 'AppCtrl',
            templateUrl: 'app/views/main.html',
            resolve: {
                clients: function (ReportService) {
                    return ReportService.getClientsToDay();
                },
                draw: function (ReportService) {
                    var d = new Date();
                    return ReportService.getDrawRange(d - options.msInDay, d - 1);
                },
                zakaz: function (ReportService) {
                    var d = new Date();
                    return ReportService.getZakazRange(d - options.msInDay, d - 1);
                },
                pay: function (ReportService) {
                    var d = new Date();
                    return ReportService.getPayRange(d - options.msInDay, d - 1);
                },
                secondPay: function (ReportService) {
                    var d = new Date();
                    return ReportService.getSecondPayRange(d - options.msInDay, d - 1);
                }
            }
        })
        .when("/app", {
            controller: 'AppCtrl',
            templateUrl: 'app/views/main.html'
        })
        .when("/reports/add", {
            controller: 'ReportCtrl',
            templateUrl: 'app/views/reports.html'
        })
        .when("/login", {
            controller: 'LoginCtrl',
            templateUrl: 'app/views/login.html'
        })
        .when("/salon/:name", {
            controller: 'SalonCtrl',
            templateUrl: 'app/views/salon.html'
        })
        .when("/salon/:name/staff/:staff", {
            controller: 'StaffCtrl',
            templateUrl: 'app/views/staff.html'
        })
        .otherwise({
            redirectTo: "/"
        })
    //$locationProvider.html5Mode(true);
})
app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);
app.run(function ($rootScope, AuthService, $location, Session) {
    Session.load();
    $rootScope.back = function () {
        window.history.back();
    }
    $rootScope.$on('$locationChnageStart', function (event, next) {
        $rootScope.notPrimary = false;
        /*if (!AuthService.isAuthenticated()) {
            $location.path("/login")
        }*/
    })
})
app.controller('AppCtrl', function ($rootScope, $scope, $location, Session, AuthService,
    draw, zakaz, pay, secondPay,
    clients, ReportService) {

    $rootScope.notPrimary = false;
    $scope.start = new Date();
    $scope.end = new Date();
    $scope.FollowChart = {};
    $scope.ReportChart = {};
    if (!AuthService.isAuthenticated()) {
        $location.path("/login")
    }
    $scope.countClient = clients.data || 0;
    if ($scope.user.type != 'Консультант') {
        $scope._oc = {};
        $scope._oc.rows = [];
        $scope._oc.cols = [
            { id: "t", label: "Topping", type: "string" },
            { id: "s", label: "Отчеты", type: "number" }
        ];
        if (clients.items) {
            clients.items.map(item => {
                $scope._oc.rows.push({ c: [{ v: item._id.group + '(' + item._id.day + '.' + item._id.month + ')' }, { v: item.count }] });
            })
            $scope.ReportChart.data = {
                "cols": $scope._oc.cols,
                "rows": $scope._oc.rows
            };
            $scope.ReportChart.type = 'BarChart';
        }
    }
    $scope.countDraw = draw || 0;
    $scope.countZakaz = zakaz || 0;
    $scope.sumPay = pay;
    $scope.sumSecondPay = secondPay;
    $scope.user = Session.data;
    if ($scope.user.type != 'Консультант') {
        ReportService.getFollowWeek().then(result => {
            $scope.fc = {};
            $scope.fc.rows = [];
            $scope.fc.cols = [
                { id: "t", label: "Topping", type: "string" },
                { id: "s", label: "Клиентов", type: "number" }
            ];
            if (result.result) {
                result.result.map(item => {
                    $scope.fc.rows.push({ c: [{ v: item._id.type }, { v: item.count }] });
                })
                $scope.FollowChart.data = {
                    "cols": $scope.fc.cols,
                    "rows": $scope.fc.rows
                };
                $scope.FollowChart.type = 'BarChart';
            }
        }, console.log)
        ReportService.getSalonStats($scope.start.getTime(), $scope.end.getTime()).then(
            data => {
                $scope.SalonsStats = data;
            },
            console.log
        )
    }
    if ($scope.user.type == 'ПЭО') {
        $scope.PlanChart = {
            "type": "PieChart",
            "displayed": false,
            "data": {
                "cols": [
                    {
                        "id": "month",
                        "label": "Month",
                        "type": "string",
                        "p": {}
                    },
                    {
                        "id": "laptop-id",
                        "label": "Laptop",
                        "type": "number",
                        "p": {}
                    },
                ],
                "rows": [
                    {
                        "c": [
                            {
                                "v": "Выполнено"
                            },
                            {
                                "v": 2500014,
                            }
                        ]
                    },
                    {
                        "c": [
                            {
                                "v": "Осталось"
                            },
                            {
                                "v": 130000
                            }
                        ]
                    },
                ]
            },
            "options": {
                "title": "План выполнения продаж",
                "isStacked": "false",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Sales unit",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Date"
                }
            },
            "formatters": {}
        }
    }
    $scope.update = function () {
        ReportService.getClientsRange($scope.start.getTime(), $scope.end.getTime()).then(function (data) { $scope.countClient = data.count })
        ReportService.getDrawRange($scope.start.getTime(), $scope.end.getTime()).then(function (data) { $scope.countDraw = data })
        ReportService.getPayRange($scope.start.getTime(), $scope.end.getTime()).then(function (data) { $scope.sumPay = data })
        ReportService.getSecondPayRange($scope.start.getTime(), $scope.end.getTime()).then(function (data) { $scope.sumSecondPay = data })
        ReportService.getZakazRange($scope.start.getTime(), $scope.end.getTime()).then(function (data) { $scope.countZakaz = data })
        if ($scope.user.type != 'Консультант') {
            ReportService.getFollowRange($scope.start.getTime(), $scope.end.getTime()).then(result => {
                $scope.fc = {};
                $scope.fc.rows = [];
                $scope.fc.cols = [
                    { id: "t", label: "Topping", type: "string" },
                    { id: "s", label: "Клиенты", type: "number" }
                ];
                if (result.result) {
                    result.result.map(item => {
                        $scope.fc.rows.push({ c: [{ v: item._id.type }, { v: item.count }] });
                    })
                    $scope.FollowChart.data = {
                        "cols": $scope.fc.cols,
                        "rows": $scope.fc.rows
                    };
                    $scope.FollowChart.type = 'BarChart';
                }
            }, console.log)
        }
    }

});
app.controller('DefaultCtrl', function ($rootScope, $scope, $location, Session, AuthService) {
    $scope.user = Session.data;
    $rootScope.notPrimary = false;
    if (!AuthService.isAuthenticated()) {
        $location.path("/login")
    }
    $scope.exit = function () {
        Session.data = undefined;
        localStorage.setItem('session', undefined);
        $location.path("/login")
    }

});
app.controller('StaffCtrl', function ($rootScope, $scope, $location, Session, AuthService, ReportService, $routeParams) {
    $scope.user = Session.data;
    $rootScope.notPrimary = true;
    if (!AuthService.isAuthenticated()) {
        $location.path("/login")
    }
    $scope.salonName = $routeParams.name;
    $scope.staffName = $routeParams.staff;
    if ($scope.user.type == 'ПЭО') {
        $scope.PlanChart = {
            "type": "PieChart",
            "displayed": false,
            "data": {
                "cols": [
                    {
                        "id": "month",
                        "label": "Month",
                        "type": "string",
                        "p": {}
                    },
                    {
                        "id": "laptop-id",
                        "label": "Laptop",
                        "type": "number",
                        "p": {}
                    },
                ],
                "rows": [
                    {
                        "c": [
                            {
                                "v": "Выполнено"
                            },
                            {
                                "v": 2500014,
                            }
                        ]
                    },
                    {
                        "c": [
                            {
                                "v": "Осталось"
                            },
                            {
                                "v": 130000
                            }
                        ]
                    },
                ]
            },
            "options": {
                "title": "План выполнения продаж",
                "isStacked": "false",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Sales unit",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Date"
                }
            },
            "formatters": {}
        }
    }
    $scope.ConversionChart = {
        "type": "AreaChart",
        "displayed": false,
        "data": {
            "cols": [
                {
                    "id": "month",
                    "label": "Month",
                    "type": "string",
                    "p": {}
                },
                {
                    "id": "laptop-id",
                    "label": "Заказы",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "desktop-id",
                    "label": "Прорисовки",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "server-id",
                    "label": "Консультанции",
                    "type": "number",
                    "p": {}
                },
            ],
            "rows": [
                {
                    "c": [
                        {
                            "v": "Январь"
                        },
                        {
                            "v": 19,
                            "f": "42 items"
                        },
                        {
                            "v": 12,
                            "f": "Ony 12 items"
                        },
                        {
                            "v": 7,
                            "f": "7 servers"
                        },
                        {
                            "v": 4
                        }
                    ]
                },
                {
                    "c": [
                        {
                            "v": "Февраль"
                        },
                        {
                            "v": 13
                        },
                        {
                            "v": 1,
                        },
                        {
                            "v": 12
                        },
                        {
                            "v": 2
                        }
                    ]
                },
                {
                    "c": [
                        {
                            "v": "Март"
                        },
                        {
                            "v": 24
                        },
                        {
                            "v": 5
                        },
                        {
                            "v": 11
                        },
                        {
                            "v": 6
                        }
                    ]
                }
            ]
        },
        "options": {
            "title": "Статистика",
            "isStacked": "true",
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
                "title": "Кол-во",
                "gridlines": {
                    "count": 10
                }
            },
            "hAxis": {
                "title": "Date"
            }
        },
        "formatters": {}
    }
});
app.controller('SalonCtrl', function ($rootScope, $scope, $location, Session, AuthService, ReportService, $routeParams) {
    $scope.user = Session.data;
    $rootScope.notPrimary = true;
    if (!AuthService.isAuthenticated()) {
        $location.path("/login")
    }
    $scope.salonName = $routeParams.name;
    if ($scope.user.type == 'ПЭО') {
        $scope.PlanChart = {
            "type": "PieChart",
            "displayed": false,
            "data": {
                "cols": [
                    {
                        "id": "month",
                        "label": "Month",
                        "type": "string",
                        "p": {}
                    },
                    {
                        "id": "laptop-id",
                        "label": "Laptop",
                        "type": "number",
                        "p": {}
                    },
                ],
                "rows": [
                    {
                        "c": [
                            {
                                "v": "Выполнено"
                            },
                            {
                                "v": 2500014,
                            }
                        ]
                    },
                    {
                        "c": [
                            {
                                "v": "Осталось"
                            },
                            {
                                "v": 130000
                            }
                        ]
                    },
                ]
            },
            "options": {
                "title": "План выполнения продаж",
                "isStacked": "false",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Sales unit",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Date"
                }
            },
            "formatters": {}
        }
    }
    ReportService.getSalonStaffStats($scope.salonName, 0, 0)
        .then(data => {
            $scope.staffStats = data;
            var r = $scope.staffStats.reduce(function (result, item) {
                result.except += 1;
                result.actual += item.stats;
                return result;
            }, { except: 0, actual: 0 })
            $scope.ConversionChart = {
                "type": "PieChart",
                "displayed": false,
                "data": {
                    "cols": [
                        {
                            "id": "month",
                            "label": "Month",
                            "type": "string",
                            "p": {}
                        },
                        {
                            "id": "laptop-id",
                            "label": "Laptop",
                            "type": "number",
                            "p": {}
                        },
                    ],
                    "rows": [
                        {
                            "c": [
                                {
                                    "v": "Текущий"
                                },
                                {
                                    "v": r.except,
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": "Осталось"
                                },
                                {
                                    "v": r.actual
                                }
                            ]
                        },
                    ]
                },
                "options": {
                    "title": "Конверсия салона",
                    "isStacked": "false",
                    "fill": 20,
                    "displayExactValues": true,
                    "vAxis": {
                        "title": "Sales unit",
                        "gridlines": {
                            "count": 10
                        }
                    },
                    "hAxis": {
                        "title": "Date"
                    }
                },
                "formatters": {}
            }
        },
        console.log);
});
app.controller('ReportCtrl', function ($rootScope, $scope, $location, Session, ReportService, $mdToast, AuthService) {
    if (!AuthService.isAuthenticated()) {
        $location.path("/login")
    }
    $scope.report = {};
    $scope.salons = []
    for (var item in Session.data.salons) {
        if (!isNaN(Number(item))) {
            $scope.salons.push(Session.data.salons[item].NameOrg);
        }
    }
    $scope.report.salon = $scope.salons[0];
    $rootScope.notPrimary = true;
    $scope.save = function () {
        if (!$scope.report.follow) {
            var toast = $mdToast.simple()
                .textContent("Поле \"Узнали о нас из\" обязательно для заполнения!")
                .action('OK')
                .highlightAction(false);
            $mdToast.show(toast);
            return;
        }
        if (!$scope.report.houseifo) {
            var toast = $mdToast.simple()
                .textContent("Поле \"Кухня планируется устанавливаться в\" обязательно для заполнения!")
                .action('OK')
                .highlightAction(false);
            $mdToast.show(toast);
            return;
        }
        ReportService.save($scope.report)
            .then(() => {
                $location.path("/");
            }, (err) => {
                var toast = $mdToast.simple()
                    .textContent("Проверьте данные что тут не так!")
                    .action('OK')
                    .highlightAction(false);
                $mdToast.show(toast);
            });
    }
});

app.controller('LoginCtrl', function ($scope, $location, AuthService, $mdToast) {
    $scope.login = function () {
        AuthService.login($scope.user)
            .then(() => {
                $location.path("/")
            }, (err) => {
                console.log(err);
                var toast = $mdToast.simple()
                    .textContent("Ошибка авторизации!")
                    .action('OK')
                    .highlightAction(false);
                $mdToast.show(toast)
            })
    }
});
