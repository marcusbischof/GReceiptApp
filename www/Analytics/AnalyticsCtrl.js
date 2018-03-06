
angular.module('greceipt.analytics', ['greceipt.service.auth', 'chart.js', 'ion-floating-menu', 'display-pie'])
    .controller('AnalyticsCtrl', function($rootScope, $scope, $state, $ionicScrollDelegate, $ionicModal, $ionicLoading, $ionicHistory, $stateParams, $ionicPopup,
        authService, taskFactory, displayFactory) {

        $ionicHistory.nextViewOptions({
            disableBack: false
        });

        console.log("ionic history is --> ", $ionicHistory);

        // Variables to be accessed in view.
        $scope.currentTaxonomyOne = [];
        $scope.currentTaxonomyTwoObj = {};
        $scope.receipts = [];
        // Keeps track of the id assigned to the currently viewed tax_one pie chart.
        $scope.currName = "";
        $scope.hiddenCardId = "";
        $scope.allSelectClass = "box check_box_span color-unchecked";
        $scope.currentCustomStats = {
          "total_tax" : 0,
          "total_shipping": 0,
          "total" : 0,
          "current_categories" : [],
          "number_selected": 0
        };
        $scope.data = {
            showDelete: false
        };
        $scope.keys_tax_two = [];
        $scope.counts_tax_two = [];

        // Called when user clicks floating button to display analytics for Taxonomy Level 2.
        $scope.callDisplayTwo = function () {
          $ionicScrollDelegate.scrollTop();
          document.getElementById($scope.hiddenCardId).style.display = "block";
          document.getElementById($scope.hiddenCustomAnalyticsCard).style.display = "none";
          displayFactory.displayChartTaxonomyTwo($scope, $state, $scope.keys_tax_two, $scope.counts_tax_two, $scope.currName);
        }

        // Called when user clicks  floating button corresponding to custom analytics choice.
        // Will need to crunch current statistics on selected receipts, and update model.
        $scope.callCustomAnalyticsDisplay = function () {
          $ionicScrollDelegate.scrollTop();
          document.getElementById($scope.hiddenCustomAnalyticsCard).style.display = "block";
          document.getElementById($scope.hiddenCardId).style.display = "none";
          for (var j = 0; j < finalReceipts.length; j++) {
            if (finalReceipts[j].state == 1) {
              $scope.currentCustomStats.total_tax += parseFloat(finalReceipts[j].tax);
              $scope.currentCustomStats.total_shipping += parseFloat(finalReceipts[j].shipping);
              $scope.currentCustomStats.total += parseFloat(finalReceipts[j].total);
              $scope.currentCustomStats.current_categories.push(finalReceipts[j].taxonomy_level2);
              $scope.currentCustomStats.number_selected += 1;
            }
          }
          $scope.currentCustomStats.current_categories = $scope.currentCustomStats.current_categories.filter( function( item, index, inputArray ) {
             return inputArray.indexOf(item) == index;
          });
        }

        $scope.clearCustomAnalytics = function () {
          $scope.currentCustomStats = {
            "total_tax" : 0,
            "total_shipping": 0,
            "total" : 0,
            "current_categories" : [],
            "number_selected": 0
          };
        }

        /* Records a new state for a receipt when a user selects or unselected the checkbox
           next to the receipt. This data is used to determine which receipts the user wants
           to operate on when he/she decides to take action with floating buttons in bottom right.
        */
        $scope.toggleState = function (tax_1, order_d) {
          for (var i = 0; i < ($scope.receipts).length; i++) {
            if ($scope.receipts[i].order_date == order_d && $scope.receipts[i].taxonomy_level1 == tax_1) {
              if ($scope.receipts[i].state == 0) {
                $scope.receipts[i].class = "box check_box_span color-checked";
                $scope.receipts[i].state = 1;
              } else {
                $scope.receipts[i].class = "box check_box_span color-unchecked";
                $scope.receipts[i].state = 0;
              }
            }
          }
        }

        $scope.goToTaxOne = function (tax_one) {
            $state.transitionTo('app.receipts_detailed', {taxonomyOne: tax_one});
        }

        $scope.toggleStateFull = function (title) {
          var all_state = "";
          if ($scope.allSelectClass == "box check_box_span color-unchecked") {
            $scope.allSelectClass = "box check_box_span color-checked";
            all_state = "on";
          } else {
            $scope.allSelectClass = "box check_box_span color-unchecked";
            all_state = "off";
          }
          if (title.localeCompare("Health") == 0) {
            changeState("Health", all_state);
          } else if (title.localeCompare("Education") == 0) {
            changeState("Education", all_state);
          } else if (title.localeCompare("Lifestyle") == 0) {
            changeState("Lifestyle", all_state);
          } else if (title.localeCompare("Services") == 0) {
            changeState("Services", all_state);
          } else {
            changeState("Transportation", all_state);
          }
        }

        var changeState = function (tax_one, all_state) {
          for (var i = 0; i < $scope.receipts.length; i++) {
            if ($scope.receipts[i].taxonomy_level1 == tax_one) {
              if (all_state == "on") {
                $scope.receipts[i].class = "box check_box_span color-checked";
                $scope.receipts[i].state = 1;
              } else {
                $scope.receipts[i].class = "box check_box_span color-unchecked";
                $scope.receipts[i].state = 0;
              }
            }
          }
        }

        // Handles case where user intends to drill down on a single receipt.
        $scope.goReceipt = function(rec) {
          $state.transitionTo('app.receipt', {'receipt' : rec});
        }

        // Hides the card displaying Taxonomy Levl 2 analytics.
        $scope.hideDisplayTaxTwo = function () {
          document.getElementById($scope.hiddenCardId).style.display = "none";
        }

        // Hides custom analytics card.
        $scope.hideCustomAnalyticsTaxTwo = function() {
          document.getElementById($scope.hiddenCustomAnalyticsCard).style.display = "none";
        }

        // Global data needed by various functions
        var state = 0;
        var finalReceipts = [];

        $scope.finalPercentages = {
          "Health": 0,
          "Education": 0,
          "Services": 0,
          "Lifestyle": 0,
          "Transportation": 0
        }

        // Gets the background-color of floating button in bottom right.
        $scope.getColorButton = function (color) {
          if (color.localeCompare("Health") == 0) {
            return "#EF4373";
          } else if (color.localeCompare("Education") == 0) {
            return "#75C163";
          } else if (color.localeCompare("Lifestyle") == 0) {
            return "#0AE2DF";
          } else if (color.localeCompare("Services") == 0) {
            return "#673695";
          } else {
            return "#EAE611";
          }
        }

        /*
           Calculates averages for list of taxonomy_level1 receipts. This value
           will have been set on the analytics page when the user clicked a pie peice
           or a div corresponding to taxonomy level one.
        */
        $scope.calculateAverages = function () {
          var counter_total = 0.0;
          for (var i = 0; i < ($scope.currentTaxonomyOne).length; i++) {
            counter_total += parseFloat(($scope.currentTaxonomyOne[i].Total).split("$")[1]);
          }
          return counter_total / (($scope.currentTaxonomyOne).length).toFixed(2);
        }

        // Removes the card when user hits the x button in top right.
        $scope.toggleCard = function () {
          if (state == 1) {
            document.getElementById("hidden_card").style.display = 'none';
            state = 0;
          } else {
            document.getElementById("hidden_card").style.display = 'inline';
            displayFactory.displayChart($scope, $state);
            state = 1;
          }
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

        // Used to determine percentages for taxonomy level one categories.
        var calculatePercentages = function() {
          var totalCount = 0;
          for (var i = 0; i < finalReceipts.length; i++) {
            console.log(finalReceipts[i].taxonomy_level1);
            $scope.finalPercentages[finalReceipts[i].taxonomy_level1] += 1;
            totalCount += 1;
          }
          for (var key in $scope.finalPercentages) {
            $scope.finalPercentages[key] = $scope.finalPercentages[key] / totalCount;
          }
        }

        // A utility function that creates a dynamic object with Taxonomy Level Two keys
        // with number of receipts in current view associated with these taxonomies.
        $scope.createTaxonomyTwoJSON = function () {
          var current_tax_two_obj = {};
          for (var i = 0; i < ($scope.currentTaxonomyOne).length; i++) {
            if (current_tax_two_obj[$scope.currentTaxonomyOne[i].taxonomy_level2]) {
              current_tax_two_obj[$scope.currentTaxonomyOne[i].taxonomy_level2]["count"] += 1;
              current_tax_two_obj[$scope.currentTaxonomyOne[i].taxonomy_level2]["total_spent"] += parseFloat($scope.currentTaxonomyOne[i].total);
            } else {
              current_tax_two_obj[$scope.currentTaxonomyOne[i].taxonomy_level2] = { ["count"]: 0, ["total_spent"]: 0.0 };
              current_tax_two_obj[$scope.currentTaxonomyOne[i].taxonomy_level2]["count"] += 1;
              current_tax_two_obj[$scope.currentTaxonomyOne[i].taxonomy_level2]["total_spent"] += parseFloat($scope.currentTaxonomyOne[i].total);
            }
          }
          $scope.currentTaxonomyTwoObj = current_tax_two_obj;
          console.log("current taxonomy two obj is --> ", $scope.currentTaxonomyTwoObj);
          var keys = [];
          var counts = [];
          for (var key in $scope.currentTaxonomyTwoObj) {
            keys.push(key);
            counts.push($scope.currentTaxonomyTwoObj[key].count);
          }
          $scope.keys_tax_two = keys;
          $scope.counts_tax_two = counts;
        }

        // A utility function for returning receipts that match the taxonomy level
        // one passed as a state params.
        var getTaxonomyOneReceipts = function () {
          $scope.currentTaxonomyOne = [];
          for (var i = 0; i < finalReceipts.length; i++) {
            if (finalReceipts[i].taxonomy_level1 == $stateParams.taxonomyOne) {
              $scope.currentTaxonomyOne.push(finalReceipts[i]);
            }
          }
          $scope.createTaxonomyTwoJSON();
          $scope.currName = "pie_analytics_" + $stateParams.taxonomyOne;
          $scope.hiddenCardId = "hidden_card_" + $stateParams.taxonomyOne;
          $scope.hiddenCustomAnalyticsCard = "hidden_custom_analytics_" + $stateParams.taxonomyOne;
          console.log("right now currName is --> " , $scope.currName);
        }

        $scope.receipts = $rootScope.receipts;
        finalReceipts = $rootScope.receipts;
        if ($state.current.name == "app.receipts_detailed") {
          getTaxonomyOneReceipts();
        }
        calculatePercentages();

        /* We want to clear the states so that there is no selection carry over from
           other pages (in the current state of the app, this entails carry over from
           the search page).
        */
        var clearStates = function() {
          for (var i = 0; i < $rootScope.receipts.length; i++) {
            $rootScope.receipts[i].state = 0;
            $rootScope.receipts[i].class = "box check_box_span color-unchecked";
          }
        }

        clearStates();

    });

var showErrorPopup = function(ionicPopup) {
    return ionicPopup.alert({
        title: 'Oops!',
        template: "Something happended that we should have avoided!?!"
    });
};
