
angular.module('greceipt.taxonomy_two_analytics', ['greceipt.service.auth', 'chart.js', 'ion-floating-menu', 'display-pie'])
    .controller('TaxTwoCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory, displayFactory) {

        $ionicHistory.nextViewOptions({
            disableBack: false
        });

        $scope.title = $state.params.taxonomy_two;
        $scope.currReceipts = [];
        var currentReceipts = $state.params.receipts;

        // Handles case where user intends to drill down on a single receipt.
        $scope.goReceipt = function(rec) {
          $state.transitionTo('app.receipt', {'receipt' : rec});
        }

        // Determines an icon to display for a particular taxonomy.
        $scope.determineIcon = function(taxonomy_level1) {
          if (taxonomy_level1.localeCompare("Lifestyle") == 0) {
            return "icon ion-wineglass";
          } else if (taxonomy_level1.localeCompare("Services") == 0) {
            return "icon ion-settings";
          } else if (taxonomy_level1.localeCompare("Transportation") == 0) {
            return "icon ion-android-car";
          } else if (taxonomy_level1.localeCompare("Health") == 0) {
            return "icon ion-medkit";
          } else {
            return "icon ion-calculator";
          }
        }

        for (var i = 0; i < currentReceipts.length; i++) {
          if (currentReceipts[i].taxonomy_level2 == $scope.title) {
            ($scope.currReceipts).push(currentReceipts[i]);
          }
        }

    });

var showErrorPopup = function(ionicPopup) {
    return ionicPopup.alert({
        title: 'Oops!',
        template: "Something happended that we should have avoided!?!"
    });
};
