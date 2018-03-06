angular.module('greceipt.support', ['greceipt.service.auth'])
    .controller('SupportCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
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
