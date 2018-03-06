    var displayModule = angular.module('display-pie', ['chart.js'])

    displayModule.factory('displayFactory', function() {
        return {
            displayChart: function(scope, state) {
              Chart.defaults.global.color = ['#EF4373', '#75C163', '#673695', '#0AE2DF', '#EAE611'];
              var pieData = {
                  labels : ["Health", "Education", "Services", "Lifestyle", "Transportation"],
                  datasets : [
                    {
                      label : ["Health", "Education", "Services", "Lifestyle", "Transportation"],
                      backgroundColor : ['#EF4373', '#75C163', '#673695', '#0AE2DF', '#EAE611'],
                      data : [scope.finalPercentages["Health"] * 100,
                      scope.finalPercentages["Education"] * 100,
                      scope.finalPercentages["Services"] * 100,
                      scope.finalPercentages["Lifestyle"] * 100,
                      scope.finalPercentages["Transportation"] * 100]
                    }
                  ]
              }
              var ctx = document.getElementById("analytics_pie_chart").getContext('2d');
              var myChart = new Chart(ctx, {
                type: 'pie',
                data: pieData,
                options: {
                  events: ["click"],
                  responsive: true,
                  legend: {
                    display: true,
                    position: 'top'
                  }
                }
              });

              // Onclick listener to determine if a user wants to dig deeper into the taxonomy
              // layer for a particular taxonomy displayed on the pie chart
              // (user clicks pie chart to fire this event).
              (ctx.canvas).onclick = function(evt) {
                var activePoints = myChart.getElementsAtEvent(evt);
                // let's say you wanted to perform different actions based on label selected
                if (activePoints[0]._model.label == "Health") {
                  state.transitionTo('app.receipts_detailed', {taxonomyOne: 'Health'});
                } else if (activePoints[0]._model.label == "Education") {
                  state.transitionTo('app.receipts_detailed', {taxonomyOne: 'Education'});
                } else if (activePoints[0]._model.label == "Services") {
                  state.transitionTo('app.receipts_detailed', {taxonomyOne: 'Services'});
                } else if (activePoints[0]._model.label == "Lifestyle") {
                  state.transitionTo('app.receipts_detailed', {taxonomyOne: 'Lifestyle'});
                } else {
                  state.transitionTo('app.receipts_detailed', {taxonomyOne: 'Transportation'});
                }
              }
            },
            displayChartTaxonomyTwo: function (scope, state, keys, counts, chartName) {
                var colors = ['#9370DB', '#00FA9A', '#FFE4E1', '#FFA500', '#FF4500', '#4169E1'];
                var temp_colors = [];
                var pieData = {
                    labels : keys,
                    datasets : [
                      {
                        label : keys,
                        backgroundColor: colors,
                        data : counts
                      }
                    ]
                }
                var ctx = document.getElementById(chartName).getContext('2d');
                var myChart = new Chart(ctx, {
                  type: 'pie',
                  data: pieData,
                  options: {
                    events: ["click"],
                    responsive: true,
                    legend: {
                      display: true,
                      position: 'top'
                    }
                  }
                });

                (ctx.canvas).onclick = function(evt) {
                  var activePoints = myChart.getElementsAtEvent(evt);
                  // let's say you wanted to perform different actions based on label selected
                  for (var i = 0; i < keys.length; i++) {
                    if (activePoints[0]._model.label == keys[i]) {
                      console.log("in this loop .. ");
                      state.transitionTo('app.taxonomy_two_analytics', {receipts: scope.receipts, taxonomy_two:keys[i]});
                    }
                  }
                }
              }
        };
    });
