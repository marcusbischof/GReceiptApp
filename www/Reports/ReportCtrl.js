angular.module('greceipt.report', ['greceipt.service.auth', 'greceipt.factory.task', 'ion-floating-menu'])
    .controller('ReportCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory) {

        $scope.report = $stateParams.report;

        console.log("report is --> ", $scope.report);

});
