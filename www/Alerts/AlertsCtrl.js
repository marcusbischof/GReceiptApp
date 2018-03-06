angular.module('greceipt.alerts', ['greceipt.service.auth'])
    .controller('AlertsCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory) {

        $ionicHistory.nextViewOptions({
            disableBack: false
        });

        /* When a user selects two dates, and starts a report, the following logic occurs:
           1) Create a report
              1.1) Fields: report_id (done in lambda function), start_date, end_date, receiptid_list, report_name, receival_date, report_tags (these are meta tags similar to taxonomies, 1 layer).
           2) Did the end date finish earlier than (or equal to) today.
              2.1) NO
                  2.1.1) Do not act.
              2.2) YES
                  2.2.1) GET request for receipts.
                  2.2.2) Scan returned receipts for dates falling between 'start_date' and 'end_date', when found in loop, store in a temp array.
                  2.2.3) Loop through the temp array, and add each 'receiptid' to 'receiptid_list' of report.
        */

        // $scope.create_account = function (account_name) {
        //   console.log("account name is --> ", account_name);
        //   taskFactory.createAccount(account_name, function(err, response) {
        //       if (err) {
        //           console.log(err);
        //           $ionicLoading.show();
        //           var alertPopup = showErrorPopup($ionicPopup);
        //           return;
        //       }
        //       console.log("response is --> ", response);
        //       $ionicLoading.hide();
        //   });
        // }
        //
        // var getReceiptCount = function () {
        //   taskFactory.getReceiptCount(function(err, response) {
        //       if (err) {
        //           console.log(err);
        //           $ionicLoading.show();
        //           var alertPopup = showErrorPopup($ionicPopup);
        //           return;
        //       }
        //       console.log("receipt count is --> ", response[0].receipt_count);
        //       $ionicLoading.hide();
        //   });
        // }
        //
        // var updateReceiptCount = function(rec_count) {
        //   taskFactory.updateCreateReceiptCount(rec_count, function(err, response) {
        //       if (err) {
        //           console.log(err);
        //           $ionicLoading.show();
        //           var alertPopup = showErrorPopup($ionicPopup);
        //           return;
        //       }
        //       // console.log("receipt count is --> ", response[0].receipt_count);
        //       $ionicLoading.hide();
        //   });
        // }
        //
        // // We will need a function that determines the new receipts, based on either a value
        // // directly set in the DB indicating this is a new receipts, or based on a date "created at"
        // // analysis, not sure best approach.
        // var findNewReceipts = function () {
        //   // for (var i = 0; i < $rootScope.receipts.length; i++) {
        //   //
        //   // }
        //   console.log("testing");
        // }
        //
        // console.log("root scope receipt length is --> ", $rootScope.receipts.length);
        //
        // // updateReceiptCount(99);
        // getReceiptCount();
        // // $scope.create_account("yoyoyoMorning");


    });

var showErrorPopup = function(ionicPopup) {
    return ionicPopup.alert({
        title: 'Oops!',
        template: "Something happended that we should have avoided!?!"
    });
};
