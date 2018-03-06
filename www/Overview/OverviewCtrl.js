angular.module('greceipt.overview', ['greceipt.service.auth'])
    .controller('OverviewCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory) {

        $rootScope.receipts = [];

        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicLoading.hide();

        // A utitlity function for loading user's receipts.
        var loadReceipts = function() {
            $ionicLoading.show();
            taskFactory.receipts_web_service(5, function(err, receipts) {
                if (err) {
                  console.log(err);
                  $ionicLoading.show();
                  var alertPopup = showErrorPopup($ionicPopup);
                  return;
                }
                for (var i = 0; i < receipts.length; i++) {
                  receipts[i]["state"] = 0;
                  receipts[i]["class"] = "box check_box_span color-unchecked";
                  receipts[i]["taxonomy_level3"] = "";
                }
                $rootScope.receipts = receipts;
                $rootScope.receipts.sort(function(a,b) {
                    console.log(new Date(a.order_date).getTime() - new Date(b.order_date).getTime());
                    return new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
                });
                // Sort above returns an array from oldest to most recent, we are interested in the opposite.
                $rootScope.receipts.reverse();
                console.log("receipts of root scope are --> ", $rootScope.receipts);
                $ionicLoading.hide();
            });
        }

        // $rootScope.determineTaxonomyLevelThreeArray = function (scope, receipts) {
        //   scope.taxonomyThreeKeys = [];
        //   var tempKeys = {};
        //   for (var i = 0; i < receipts.length; i++) {
        //     if (receipts[i].taxonomy_level3 != "") {
        //       tempKeys[receipts[i].taxonomy_level3] = "";
        //     }
        //   }
        //   for (var key in tempKeys) {
        //     (scope.taxonomyThreeKeys).push(key);
        //   }
        //   (scope.taxonomyThreeKeys).push("New Category");
        // }

        loadReceipts();
    });

var showErrorPopup = function(ionicPopup) {
    return ionicPopup.alert({
        title: 'Oops!',
        template: "Something happended that we should have avoided!?!"
    });
};
