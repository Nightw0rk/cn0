var app = angular.module('CRM', ['ngMaterial', 'ngRoute', 'googlechart']);
app.config(function($routeProvider, $locationProvider, $mdThemingProvider,$mdIconProvider) {
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
            resolve:{
              clients:function(ReportService) {
                return ReportService.getClientsToDay();
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
        .otherwise({
            redirectTo: "/"
        })
    //$locationProvider.html5Mode(true);
})
app.run(function($rootScope, AuthService, $location) {
    $rootScope.back = function() {
        window.history.back();
    }
    $rootScope.$on('$locationChnageStart', function(event, next) {
        $rootScope.notPrimary = false;
        /*if (!AuthService.isAuthenticated()) {
            $location.path("/login")
        }*/
    })
})
app.controller('AppCtrl', function($rootScope, $scope, $location,Session, AuthService,clients,ReportService) {

    $rootScope.notPrimary = false;
    $scope.start = new Date();
    $scope.end = new Date();
    $scope.FollowChart={};
    if (!AuthService.isAuthenticated()) {
        $location.path("/login")
    }
    $scope.countClient = clients;
    $scope.user = Session.data;
    if($scope.user.type!='Консультант'){
      ReportService.getFollowWeek().then(result=>{
        $scope.fc = {};
        $scope.fc.rows=[];
        $scope.fc.cols=[
          {id:"t",label:"Topping",type:"string"},
          {id:"s",label:"Клиентов",type:"number"}
        ];
        result.map(item=>{
          $scope.fc.rows.push({c:[{v:item._id.type},{v:item.count}]});
        })
        $scope.FollowChart.data ={
          "cols":$scope.fc.cols,
          "rows":$scope.fc.rows
        };
        $scope.FollowChart.type='BarChart';
      },console.log)
    }

});
app.controller('DefaultCtrl', function($rootScope, $scope, $location, AuthService) {

    $rootScope.notPrimary = false;
    if (!AuthService.isAuthenticated()) {
        $location.path("/login")
    }

});
app.controller('ReportCtrl', function($rootScope, $scope, $location, ReportService, $mdToast,AuthService) {
     if (!AuthService.isAuthenticated()) {
         $location.path("/login")
     }
    $rootScope.notPrimary = true;
    $scope.save = function() {
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

app.controller('LoginCtrl', function($scope, $location, AuthService, $mdToast) {
    $scope.login = function() {
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
