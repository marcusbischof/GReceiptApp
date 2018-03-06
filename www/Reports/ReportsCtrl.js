angular.module('greceipt.reports', ['greceipt.service.auth', '720kb.datepicker', 'date-ops'])
    .controller('ReportsCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory, reportFactory, dateFactory) {

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $scope.reports = [];
        // $scope.newReportName = "";
        // $scope.newReportStartDate = "";
        // $scope.newReportEndDate = "";
        // $scope.newReportReceiptIdList = [];
        // $scope.newReportReceivalDate = "";
        // $scope.newReportTags = [];
        $scope.receipts = $rootScope.receipts;

        $scope.new_report_submission = function (report_name, start_date, end_date, receival_date) {
          var start = dateFactory.transformDateFormat(start_date);
          var end = dateFactory.transformDateFormat(end_date);
          var receival = dateFactory.transformDateFormat(end_date);
          var testing_receipts = dateFactory.fallsBetween(start, end, $scope.receipts);
          var receipt_id_string = "";
          for (var i = 0; i < testing_receipts.length; i++) {
            if (i == 0) {
              receipt_id_string = testing_receipts[i].transactionNumber;
            } else {
              receipt_id_string = receipt_id_string + "," + testing_receipts[i].transactionNumber;
            }
          }
          submitNewReport(end, receipt_id_string, receival, "testing", report_name, start);
        }

        /* We want to clear the states so that there is no selection carry over from
           other pages (in the current state of the app, this entails carry over from
           the search page).
        */
        var clearStates = function() {
          for (var i = 0; i < $rootScope.receipts.length; i++) {
            $rootScope.receipts[i].state = 0;
            $rootScope.receipts[i].class ="box check_box_span color-unchecked";
          }
        }

        var getReports = function() {
          $ionicLoading.show();
          reportFactory.getreports(function(err, response) {
              if (err) {
                $ionicLoading.hide();
                showPopupFunc('Failure', 'Could Not Retrieve Reports', 'OK');
                return;
              } else {
                console.log("response is --> ", response);
                $scope.reports = response.Items;
                $ionicLoading.hide();
              }
            });
        }

        $scope.goReport = function(rep) {
          $state.transitionTo('app.report', {'report' : rep});
        }

        getReports();

        var submitNewReport = function (end_date, receiptid_list, receival_date, report_tags, report_name, start_date) {
          reportFactory.createreport(end_date, receiptid_list, receival_date, report_tags, report_name, start_date, function(err, response) {
              if (err) {
                $ionicLoading.hide();
                showPopupFunc('Failure', 'New Report Was Not Successfully Initiated', 'OK');
                return;
              } else {
                $ionicLoading.hide();
                showPopupFunc('Success', 'New Report Was Successfully Initiated', 'OK');
              }
            });
        }

        var updateExistingReport = function (end_date, receiptid_list, receival_date, report_tags, report_name, start_date, reportid) {
          reportFactory.updatereport(end_date, receiptid_list, receival_date, report_tags, report_name, start_date, reportid, function(err, response) {
              if (err) {
                $ionicLoading.hide();
                showPopupFunc('Failure', 'Report Was Not Successfully Updated', 'OK');
                return;
              } else {
                $ionicLoading.hide();
                showPopupFunc('Success', 'Report Was Successfully Updates', 'OK');
              }
            });
        }

        var showPopupFunc = function (title_message, sub_title_message, button_message) {
          $ionicPopup.show({
            template: '',
            title: title_message,
            subTitle: sub_title_message,
            scope: $scope,
            buttons: [
              { text: button_message }
            ]
          });
        }

        // submitNewReport("10/11/1992", "1,2,3", "10/13/1992", "shopping,outdoors", "saturday night shopping", "10/10/1992");
        // updateExistingReport("10/11/1992", "1,2,3", "10/13/1992", "shopping,outdoors", "saturday night shopping", "turnopolous", "d0d8481f-4ed4-4507-835d-8a4f0b46cf70");

        clearStates();

    });

var showErrorPopup = function(ionicPopup) {
    return ionicPopup.alert({
        title: 'Oops!',
        template: "Something happended that we should have avoided!?!"
    });
};
