angular.module('greceipt.about', ['greceipt.service.auth'])
    .controller('AboutCtrl', function($scope, $state, $ionicHistory, authService) {

        $scope.logout = function() {
            authService.logOut();
            $state.go('login', {});
        }

        authService.getUserInfo().then(function(userinfo) {
            $scope.version = APP_VERSION;
            $scope.userinfo = userinfo;
        }, function(msg) {
            console.log(msg);
        });

    });
