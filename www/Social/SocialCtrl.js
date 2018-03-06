angular.module('greceipt.social', ['greceipt.service.auth'])
    .controller('SocialCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
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
