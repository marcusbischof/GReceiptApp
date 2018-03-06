angular.module('greceipt.search', ['greceipt.service.auth', 'rzModule', 'ion-floating-menu'])
    .controller('SearchCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory) {

          var finalReceipts = [];
          // Keeps track of users most recent selected action (export, category group).
          var mostRecentAction = "";

          $scope.currentMin;
          $scope.currentMax;
          $scope.sliderDates;
          // Slider options for date filter.
          $scope.slider;
          $scope.receipts = [];
          $scope.data = {
              showDelete: false
          };
          $scope.rating = 0;
          $scope.userChoice = "";
          $scope.newCategoryInput = "";
          $scope.actionHeader = "";
          $scope.actionOptionsTitle = "";
          $scope.optionsKey = "";
          $scope.sliderRowVisible = 0;
          $scope.searchRowVisible = 0;
          $scope.submitActionText = "";
          $scope.taxonomyThreeKeys = [];
          $scope.currentFiltered = [];
          $scope.allSelectClass = "box check_box_span color-unchecked";
          $scope.options = {
            "export": ["JSON", "CSV", "XLS"],
            "category": $scope.taxonomyThreeKeys
          }

          // Tests whether the user has indicated that they want to add a newT axonomy Level 3.
          $scope.testIfNew = function () {
            if ($scope.userChoice == "New Category") {
              document.getElementById("newCatInput").style.display = "inline";
              document.getElementById("cardInnerItem").style.height = "275px";
            } else {
              document.getElementById("newCatInput").style.display = "none";
              document.getElementById("cardInnerItem").style.height = "240px";
            }
          }

          // Called when the user submits the form that he/she filled out regarding category update
          // or addition OR data export.
          $scope.submitAction = function() {
            if (mostRecentAction == "group_category") {
              if (($scope.newCategoryInput).length == 0) {
                changeTaxThree($scope.userChoice);
                determineTaxonomyLevelThreeArray();
                $scope.toggleCard();
              } else {
                changeTaxThree($scope.newCategoryInput);
                determineTaxonomyLevelThreeArray();
                $scope.toggleCard();
              }
            } else {
              // Code that handles export submission.
            }
          }

          // Changes the third taxonomy level for receipts that are selected,
          // selection being indicated by a state of 1.
          var changeTaxThree = function (taxThree) {
            for (var i = 0; i < finalReceipts.length; i++) {
              if (finalReceipts[i].state == 1) {
                finalReceipts[i].taxonomy_level3 = taxThree;
              }
            }
          }

          // Handles case where user intends to drill down on a single receipt.
          $scope.goReceipt = function(rec) {
            $state.transitionTo('app.receipt', {'receipt' : rec});
          }

          $scope.showDateRange = function() {
            if ($scope.sliderRowVisible == 0) {
              document.getElementById("rangeSliderRow").style.display = "flex";
              $scope.sliderRowVisible = 1;
            } else {
              document.getElementById("rangeSliderRow").style.display = "none";
              $scope.sliderRowVisible = 0;
            }
          }

          // Closes the card, user clicks x in top right of hidden card.
          $scope.toggleCard = function () {
            $scope.newCategoryInput = "";
            document.getElementById("actionCard").style.display="none";
            document.getElementById("newCatInput").style.display = "none";
            document.getElementById("cardInnerItem").style.height = "240px";
          }

          // Determins the values that user needs to see if intention is category update/change.
          $scope.groupSelected = function() {
            mostRecentAction = "group_category";
            // Reset hidden field of unique category input to hidden since user could have clicked
            // directly on category button once they are viewing the input new category box.
            document.getElementById("newCatInput").style.display = "none";
            document.getElementById("cardInnerItem").style.height = "240px";
            $scope.newCategoryInput = "";
            $scope.options.category = $scope.taxonomyThreeKeys;
            $scope.actionHeader = "Move Selected Items:";
            $scope.actionOptionsTitle = "Category Level Two";
            $scope.optionsKey = "category";
            $scope.submitActionText = "Submit Category Change";
            document.getElementById("actionCard").style.display="inline";
            $scope.testIfNew();
          }

          // Determins the values that user needs to see if intention is data export.
          $scope.exportSelected = function() {
            mostRecentAction = "group_export";
            // Reset hidden field of unique category input to hidden since user could have clicked
            // directly on export button once they are viewing the input new category box.
            document.getElementById("newCatInput").style.display = "none";
            document.getElementById("cardInnerItem").style.height = "240px";
            $scope.newCategoryInput = "";
            $scope.actionHeader = "Export Selected Items:";
            $scope.actionOptionsTitle = "Format:"
            $scope.optionsKey = "export";
            $scope.submitActionText = "Export";
            document.getElementById("actionCard").style.display="inline";
          }

          /* Records a new state for a receipt when a user selects or unselected the checkbox
             next to the receipt. This data is used to determine which receipts the user wants
             to operate on when he/she decides to take action with floating buttons in bottom right.
          */
          $scope.toggleState = function (tax_1, order_d) {
            for (var i = 0; i < ($scope.receipts).length; i++) {
              if ($scope.receipts[i].order_date == order_d && $scope.receipts[i].taxonomy_level1 == tax_1) {
                if ($scope.receipts[i].state == 0) {
                  setState("on", $scope.receipts[i]);
                } else {
                  setState("off", $scope.receipts[i]);
                }
              }
            }
          }

          // Filters the receipts based strictly on the day in the receipt order date.
          $scope.dayFilter = function (receipt) {
            if ($scope.currentMin) {
              var day_of_receipt;
              if (ionic.Platform.isIOS()) {
                day_of_receipt = new Date(receipt.order_date.replace(' ', 'T')).getTime();
                // if (day_of_receipt >= $scope.currentMin.getTime() && day_of_receipt <= $scope.currentMax.getTime()) {
                if (day_of_receipt >= new Date($scope.slider.min.replace(' ', 'T')).getTime() && day_of_receipt <= new Date($scope.slider.max.replace(' ', 'T')).getTime()) {
                  return true;
                } else {
                  return false;
                }
              } else {
                day_of_receipt = new Date(receipt.order_date).getTime();
                // if (day_of_receipt >= $scope.currentMin.getTime() && day_of_receipt <= $scope.currentMax.getTime()) {
                if (day_of_receipt >= new Date($scope.slider.min).getTime() && day_of_receipt <= new Date($scope.slider.max).getTime()) {
                  return true;
                } else {
                  return false;
                }
              }
            }
          }

          $ionicHistory.nextViewOptions({
              disableBack: false
          });

          // Determines the icon associated with each Taxonomy Level 1.
          $scope.determineIconOrColor = function(taxonomy_level_one) {
            if (taxonomy_level_one.localeCompare("Lifestyle") == 0) {
              return "icon ion-wineglass";
            } else if (taxonomy_level_one.localeCompare("Services") == 0) {
              return "icon ion-settings";
            } else if (taxonomy_level_one.localeCompare("Transportation") == 0) {
              return "icon ion-android-car";
            } else if (taxonomy_level_one.localeCompare("Health") == 0) {
              return "icon ion-medkit";
            } else {
              return "icon ion-calculator";
            }
          }

          // Function that handles filtering receipts.
          $scope.filterReceipts = function(filter_val, cat) {
            // if cat is 0 then we are not solely filtering by category
            $scope.currentFiltered = [];
            if (cat == 0) {
              $scope.receipts = _.filter(finalReceipts, function(n) {
                 if ((n.order_date).toLowerCase().includes(filter_val.toLowerCase())
                        || (n.name).toLowerCase().includes(filter_val.toLowerCase())
                        || (n.total).toLowerCase().includes(filter_val.toLowerCase())) {
                          $scope.currentFiltered.push(n);
                        }
                 return (n.order_date).toLowerCase().includes(filter_val.toLowerCase())
                        || (n.name).toLowerCase().includes(filter_val.toLowerCase())
                        || (n.total).toLowerCase().includes(filter_val.toLowerCase());
              });
            } else {
              $scope.receipts = _.filter(finalReceipts, function(n) {
                if ((n.taxonomy_level1).toLowerCase().includes(filter_val.toLowerCase())) {
                  $scope.currentFiltered.push(n);
                }
                 return (n.taxonomy_level1).toLowerCase().includes(filter_val.toLowerCase());
              });
            }
          }

          $scope.changeStateAll = function () {
            var on = 0;
            // If variable 'on' == 1, then all receipts need to be selected no matter what.
            if ($scope.allSelectClass == "box check_box_span color-unchecked") {
              $scope.allSelectClass = "box check_box_span color-checked";
              on = 1;
            } else {
              $scope.allSelectClass = "box check_box_span color-unchecked";
              on = 0;
            }
            if ($scope.currentFiltered.length != 0) {
              loopThroughReceiptsState($scope.currentFiltered, on);
            } else {
              loopThroughReceiptsState($scope.receipts, on);
            }
          }

          var loopThroughReceiptsState = function (receipts, on) {
            for (var i = 0; i < receipts.length; i++) {
              if (on == 1) {
                setState("on", receipts[i]);
              } else {
                setState("off", receipts[i]);
              }
            }
          }

          // Sets the state and class for a given receipt.
          var setState = function (state, receipt) {
            if (state == "on") {
              receipt.class = "box check_box_span color-checked";
              receipt.state = 1;
            } else {
              receipt.class = "box check_box_span color-unchecked";
              receipt.state = 0;
            }
          }

          var determineTaxonomyLevelThreeArray = function () {
            $scope.taxonomyThreeKeys = [];
            var tempKeys = {};
            for (var i = 0; i < finalReceipts.length; i++) {
              if (finalReceipts[i].taxonomy_level3 != "") {
                tempKeys[finalReceipts[i].taxonomy_level3] = "";
              }
            }
            for (var key in tempKeys) {
              ($scope.taxonomyThreeKeys).push(key);
            }
            ($scope.taxonomyThreeKeys).push("New Category");
          }

          determineTaxonomyLevelThreeArray();
          finalReceipts = $rootScope.receipts;
          $scope.receipts = $rootScope.receipts;

          var getStepsArray = function () {
            var start = $scope.currentMin;
            var end = $scope.currentMax;
            var range = [];
            var mil = 86400000 * 7; //24h
            for (var i = start.getTime(); i < end.getTime(); i = i + mil) {
              range.push(new Date(i).toLocaleDateString());
            }
            $scope.slider = {
               min: range[0],
               max: range[range.length - 1],
               options: {
                 floor: range[0],
                 ceil: range[range.length - 1],
                 stepsArray: range,
                 getSelectionBarColor: function(value) {
                     return '#808080';
                 }
               }
           };
          }

          var setDateSliderRange = function () {
            if (ionic.Platform.isIOS()) {
              for (var i = 0; i < finalReceipts.length; i++) {
                if (i == 0) {
                  $scope.currentMin = new Date(finalReceipts[i].order_date.replace(' ', 'T'));
                  $scope.currentMax = new Date(finalReceipts[i].order_date.replace(' ', 'T'));
                } else {
                  if ((new Date(finalReceipts[i].order_date.replace(' ', 'T')).getTime() - $scope.currentMin.getTime()) < 0) {
                    $scope.currentMin = new Date(finalReceipts[i].order_date.replace(' ', 'T'));
                  }
                  if ((new Date(finalReceipts[i].order_date.replace(' ', 'T')).getTime() - $scope.currentMax.getTime()) > 0) {
                    $scope.currentMax = new Date(finalReceipts[i].order_date.replace(' ', 'T'));
                  }
                }
              }
            } else {
              for (var i = 0; i < finalReceipts.length; i++) {
                if (i == 0) {
                  $scope.currentMin = new Date(finalReceipts[i].order_date);
                  $scope.currentMax = new Date(finalReceipts[i].order_date);
                } else {
                  if ((new Date(finalReceipts[i].order_date).getTime() - $scope.currentMin.getTime()) < 0) {
                    $scope.currentMin = new Date(finalReceipts[i].order_date);
                  }
                  if ((new Date(finalReceipts[i].order_date).getTime() - $scope.currentMax.getTime()) > 0) {
                    $scope.currentMax = new Date(finalReceipts[i].order_date);
                  }
                }
              }
            }
            getStepsArray();
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

          clearStates();
          setDateSliderRange();
    });

var showErrorPopup = function(ionicPopup) {
    return ionicPopup.alert({
        title: 'Oops!',
        template: "Something happended that we should have avoided!?!"
    });
};
