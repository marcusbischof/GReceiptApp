angular.module('greceipt.receipt', ['greceipt.service.auth', 'greceipt.factory.task', 'ion-floating-menu'])
    .controller('ReceiptCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory) {

        $scope.receipt = $stateParams.receipt;
        // Keeps track of current items via item_id and item_status.
        // Not added directly to item because of API call lag time.
        $scope.current_items_status = [];
        // Items that correspond to a receipt.
        $scope.items = [];
        // Tracks the deatils of the merchant responsible for receipt issue.
        $scope.merchant_details = {};
        // Tracks the name of a new folder that the user wants to add items to.
        $scope.newFolderName = "";
        // Tracks all folders corresponding to a username.
        $scope.folders = [];
        // Tracks number of items currently selected.
        var allSelectedTracker = 0;
        // Tracks an existing folder selection.
        $scope.userFolderSelection = {};

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

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

        // Gets the status of an item - how the retailer DB sees return process.
        $scope.getSingleItemStatus = function (item_id) {
          for (var i = 0; i < $scope.current_items_status.length; i++) {
            if ($scope.current_items_status[i].item_id == item_id) {
              return $scope.current_items_status[i].item_status;
            }
          }
        }

        // Gets the class (coloring) for the item text based on the item's
        // status regarding returns. Status can range from: not returned, returned, initiated.
        $scope.getItemTextClass = function (item) {
          if (item.returned == 0) {
            // Yet to distinguish initiated and waiting, vs. initiated and denied, vs not initiated.
            return "receipt_item_text_not_returned";
          } else {
            return "receipt_item_text_returned";
          }
        }

        // Closes the card allowing update and new folder.
        $scope.toggleFolderCard = function () {
          document.getElementById("folder_card").style.display = "none";
          document.getElementById("main_content_receipt").style.filter = "none";
          loadItems();
        }

        // Initiates the return of an item.
        $scope.initiateReturn = function (item) {
          if ( allSelectedTracker == 1 ) {
              for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].state == 1) {
                  initiateReturnFunc($scope.items[i].id, $rootScope.user_id_webservice, "return", "user", $scope.items[i].qty);
                }
              }
          } else {
            showPopupFunc('Error Returning Item', 'You can only return a single item, make sure a single item is selected.', 'OK');
          }
        }

        // Function that displays card allowing user to add selected items to current or new folder.
        $scope.addToFolder = function () {
          document.getElementById("folder_card").style.display = "block";
          document.getElementById("main_content_receipt").style.filter = "blur(5px)";
        }

        $scope.submitNewFolder = function () {
          $scope.addToFolder();
          if ($scope.newFolderName != "") {
            var curr_fold = find_folder($scope.newFolderName);
            var x = return_selected_items();
            var final_items = createItemStructureFolder(x, curr_fold);
            taskFactory.createFolder(final_items, $scope.newFolderName, function(err, response) {
                if (err) {
                  $ionicLoading.hide();
                  showPopupFunc('Failure', 'New Folder Was Not Successfully Created', 'OK');
                  return;
                } else {
                  $ionicLoading.hide();
                  showPopupFunc('Success', 'New Folder Successfully Created', 'OK');
                  getFolders();
                }
              });
              final_submit_formatting();
          } else {
            var x = return_selected_items();
            var final_items = createItemStructureFolder(x, $scope.userFolderSelection.folder_items);
            taskFactory.updateFolder(final_items, $scope.userFolderSelection.folder_name, $scope.userFolderSelection.account_id, function(err, response) {
                if (err) {
                  $ionicLoading.hide();
                  showPopupFunc('Failure', 'Existing Folder Was Not Successfully Updated', 'OK');
                  return;
                } else {
                  $ionicLoading.hide();
                  showPopupFunc('Success', 'Existing Folder Successfully Updated', 'OK');
                  getFolders();
                }
              });
              final_submit_formatting();
          }
        }

        var final_submit_formatting = function () {
          document.getElementById("folder_card").style.display = "none";
          document.getElementById("main_content_receipt").style.filter = "blur(0px)";
          $scope.newFolderName = "";
          document.getElementById("actionMenuItems").style.display = "none";
        }

        var return_selected_items = function () {
          var x = {};
          for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].state == 1) {
              x[i] = $scope.items[i];
              $scope.items[i].state = 0;
              $scope.items[i].class = "button receipt_item_button";
              allSelectedTracker -= 1;
            }
          }
          return x;
        }

        var find_folder = function (fold_name) {
          for (var i = 0; i < $scope.folders.length; i++) {
            if ($scope.folders[i].folder_name == fold_name) {
              return $scope.folders[i];
            }
          }
        }

        /* Constructs an object that can be resubmitted to AWS folders table.
           Current_items are items that currently exist in a folder.
           New_items are items that are to be added to a folder.
        */
        var createItemStructureFolder = function (current_items, new_items) {
          var return_item = {
            "items" : []
          };
          if (new_items) {
            new_items_post_json = JSON.parse(new_items);
            for (var key in new_items_post_json) {
              return_item.items.push({key : new_items_post_json[key]});
            }
          }
          for (var key in current_items) {
            return_item.items.push({key : current_items[key]});
          }
          return return_item;
        }

        // Tracks item clicks, if more than one or zero return initiation is not allowed.
        $scope.itemActionClick = function (item) {
          if (item.state == 0) {
            item.state = 1;
            item.class = "button receipt_item_button_selected";
            allSelectedTracker += 1;
            document.getElementById("actionMenuItems").style.display = "list-item";
          } else {
            item.state = 0;
            item.class = "button receipt_item_button";
            allSelectedTracker -= 1;
            if (allSelectedTracker == 0) {
              document.getElementById("actionMenuItems").style.display = "none";
            }
          }
        }

        var get_item_status = function (item_id, user_id) {
          taskFactory.item_status_webservice(5, item_id, function(err, items) {
              if (err) {
                showPopupFunc('Failure', 'Could Not Retrieve Item Status', 'OK');
                return;
              }
              $scope.current_items_status.push({"item_id" : item_id, "item_status" : items.status});
          });
        }

        // Loads all items associated with the receipt in question into scope.
        var loadItems = function() {
            $scope.items = [];
            $scope.current_items_status = [];
            $ionicLoading.show();
            taskFactory.receipt_items_webservice(5, $scope.receipt.transactionNumber, function(err, items) {
                if (err) {
                  $ionicLoading.hide();
                  showPopupFunc('Failure', 'Could Not Load Items Associated With This Receipt', 'OK');
                  return;
                }
                var x = 0;
                for (var key in items) {
                  // The first JSON key corresponds to the merchant details JSON object.
                  // After the first key, all following are items other than the final "success" key - 1 or 0.
                  if (x == 0) {
                    $scope.merchant_details = items[key];
                    x += 1;
                  } else if (key == "success") {
                    continue;
                  } else  {
                    $scope.items.push(items[key]);
                  }
                }
                for (var i = 0; i < $scope.items.length; i++) {
                  $scope.items[i]["class"] = "button receipt_item_button";
                  $scope.items[i]["state"] = 0;
                  get_item_status($scope.items[i].id);
                }
                $ionicLoading.hide();
            });
        }

        // Function called when a user wants to initiate a return.
        var initiateReturnFunc = function(item_id, user_id, type, started_by, qty) {
            $ionicLoading.show();
            // taskFactory.return_item_webservice(item_id, user_id, type, started_by, qty, function(err, response) {
            taskFactory.return_item_webservice(item_id, 5, type, started_by, qty, function(err, response) {
                if (err) {
                  $ionicLoading.hide();
                  showPopupFunc('Failure', 'Could Not Initiate A Return For This Item', 'OK');
                  return;
                }
                $ionicLoading.hide();
                loadItems();
                var resp = 'Response: ' + response.about;
                showPopupFunc('Request for Return Sent', resp, 'OK');
            });
        }

        var getFolders = function () {
          taskFactory.getFolders(function(err, response) {
              if (err) {
                $ionicLoading.hide();
                showPopupFunc('Failure', 'Could Not Return Folders For This User', 'OK');
                return;
              }
              $ionicLoading.hide();
              $scope.folders = response.Items;
            });
        }

        loadItems();
        getFolders();
    });
