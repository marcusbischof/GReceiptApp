angular.module('greceipt.rewards', ['greceipt.service.auth'])
    .controller('RewardsCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory) {

        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        
    });

var showErrorPopup = function(ionicPopup) {
    return ionicPopup.alert({
        title: 'Oops!',
        template: "Something happended that we should have avoided!?!"
    });
};
