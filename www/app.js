// greceipt Sample App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'greceipt' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('greceipt', ['ionic',
    'ngMessages',
    'rzModule',
    '720kb.datepicker',
    'greceipt.factory.report',
    'greceipt.factory.receipt',
    'chart.js',
    'greceipt.service.auth',
    'greceipt.menu',
    'greceipt.login',
    'greceipt.confirm',
    'greceipt.overview',
    'greceipt.about',
    'greceipt.reports',
    'greceipt.alerts',
    'greceipt.analytics',
    'greceipt.taxonomy_two_analytics',
    'greceipt.preferences',
    'greceipt.rewards',
    'greceipt.search',
    'greceipt.social',
    'greceipt.support',
    'greceipt.receipt',
    'greceipt.report'
])

.constant('$ionicLoadingConfig', {
    template: '<ion-spinner icon="bubbles" class="spinner-royal"></ion-spinner>'
})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.filter('moment', function() {
    return function(dateString, format) {
        return moment(new Date(dateString)).format(format);
    };
})

.filter('setStatus', function() {
    return function(stage, datedue) {
        var _newStage = '';
        if (stage) {
            if (typeof datedue == 'object') {
                datedue = moment(datedue).toISOString();
            }
            _newStage = stage;
            if (stage.toLowerCase() === "not started" && moment(datedue, moment.ISO_8601).set('hour', 23).set(
                    'minute', 59) < moment()) {
                _newStage = "overdue";
            }
        }
        return _newStage;
    };
})

.filter('statusColor', function() {
    return function(stage, datedue) {
        var _c = '';
        if (stage) {
            if (typeof datedue == 'object') {
                datedue = moment(datedue).toISOString();
            }
            if (stage.toLowerCase() === "not started" && moment(datedue, moment.ISO_8601).set('hour', 23).set(
                    'minute', 59) < moment()) {
                stage = "overdue";
            }
            switch (stage.toLowerCase()) {
                case "not started":
                    _c += 'notstarted';
                    break;
                case "started":
                    _c += 'started';
                    break;
                case "done":
                    _c += 'done';
                    break;
                case "overdue":
                    _c += 'overdue';
                    break;
                default:
                    break;
            }
        }

        return _c;
    };
})

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'Login/Login.html',
        controller: 'LoginCtrl'
    })

    .state('confirm', {
        url: '/confirm',
        templateUrl: 'Confirm/Confirm.html',
        controller: 'ConfirmCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'Menu/menu.html',
        controller: 'MenuCtrl'
    })

    .state('app.receipt', {
        url: '/receipt',
        params: {'receipt':null},
        views: {
            'menuContent': {
                templateUrl: 'Analytics/receipt.html',
                controller: 'ReceiptCtrl'
            }
        },
        authenticate: true
    })

    .state('app.report', {
        url: '/report',
        params: {'report':null},
        views: {
            'menuContent': {
                templateUrl: 'Reports/report.html',
                controller: 'ReportCtrl'
            }
        },
        authenticate: true
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'About/About.html',
                controller: 'AboutCtrl'
            }
        },
        authenticate: true
    })

    .state('app.overview', {
        url: '/overview',
        views: {
            'menuContent': {
                templateUrl: 'Overview/overview.html',
                controller: 'OverviewCtrl'
            }
        },
        authenticate: true
    })

    .state('app.reports', {
        url: '/reports',
        views: {
            'menuContent': {
                templateUrl: 'Reports/reports.html',
                controller: 'ReportsCtrl'
            }
        },
        authenticate: true
    })

    .state('app.alerts', {
        url: '/alerts',
        views: {
            'menuContent': {
                templateUrl: 'Alerts/alerts.html',
                controller: 'AlertsCtrl'
            }
        },
        authenticate: true
    })

    .state('app.analytics', {
        url: '/analytics',
        views: {
            'menuContent': {
                templateUrl: 'Analytics/analytics.html',
                controller: 'AnalyticsCtrl'
            }
        },
        authenticate: true
    })

    .state('app.receipts_detailed', {
        url: '/receipts_detailed/:taxonomyOne',
        views: {
            'menuContent': {
                templateUrl: 'Analytics/analytic_receipts.html',
                controller: 'AnalyticsCtrl'
            }
        },
        authenticate: true
    })

    .state('app.preferences', {
        url: '/preferences',
        views: {
            'menuContent': {
                templateUrl: 'Preferences/preferences.html',
                controller: 'PreferencesCtrl'
            }
        },
        authenticate: true
    })

    .state('app.rewards', {
        url: '/rewards',
        views: {
            'menuContent': {
                templateUrl: 'Rewards/rewards.html',
                controller: 'RewardsCtrl'
            }
        },
        authenticate: true
    })

    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'Search/search.html',
                controller: 'SearchCtrl'
            }
        },
        authenticate: true
    })

    .state('app.social', {
        url: '/social',
        views: {
            'menuContent': {
                templateUrl: 'Social/social.html',
                controller: 'SocialCtrl'
            }
        },
        authenticate: true
    })

    .state('app.support', {
        url: '/support',
        views: {
            'menuContent': {
                templateUrl: 'Support/support.html',
                controller: 'SupportCtrl'
            }
        },
        authenticate: true
    })

    .state('app.taxonomy_two_analytics', {
        url: '/tax_two',
        params: {'taxonomy_two': null, 'receipts': null},
        views: {
            'menuContent': {
                templateUrl: 'Analytics/taxonomy_two.html',
                controller: 'TaxTwoCtrl'
            }
        },
        authenticate: true
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

})

.run(function($rootScope, $state, authService) {
    // $scope.$emit('myCustomEvent', 'Data to send');

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate) {
            authService.isAuthenticated().then(function(authenticated) {
                if (!authenticated) {
                    // User isn’t authenticated
                    $state.transitionTo("signin");
                    event.preventDefault();
                }
            }).catch(function(result) {
                // User isn’t authenticated
                $state.transitionTo("signin");
                event.preventDefault();
            });
        }
        // Only case where we change nav color is upon inspection of a single Taxonomy One
        // from the analytic_receipts page.
        if (toState.name == "app.receipts_detailed") {
          if (toParams.taxonomyOne == "Health") {
            getNewNavColor("Health","#EF4373", $rootScope);
          } else if (toParams.taxonomyOne == "Education") {
            getNewNavColor("Education","#75C163", $rootScope);
          } else if (toParams.taxonomyOne == "Services") {
            getNewNavColor("Services","#673695", $rootScope);
          } else if (toParams.taxonomyOne == "Transportation") {
            getNewNavColor("Transportation","#EAE611", $rootScope);
          } else {
            getNewNavColor("Lifestyle","#0AE2DF", $rootScope);
          }
        } else {
           document.getElementsByClassName('bar bar-primary bar-header')[0].style["background-color"] = "#00661B";
        }

        if (fromState.name == "app.receipts_detailed") {
          document.getElementsByClassName('bar bar-primary bar-header')[0].style["background-color"] = "#00661B";
        }
    });
});

var getNewNavColor = function ( title , color , rootScope) {
  if (title == "regular") {
    console.log("leaving our page");
    rootScope.setNavColor = function() {
      document.getElementsByClassName('bar bar-primary bar-header')[0].style["background-color"] = color;
    }
  } else {
    rootScope.setNavColor = function() {
      document.getElementsByClassName('bar bar-primary bar-header')[0].style["background-color"] = color;
    }
    rootScope.currentTitle = title;
  }
}
