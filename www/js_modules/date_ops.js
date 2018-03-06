var displayModule = angular.module('date-ops', [])

displayModule.factory('dateFactory', function() {
    return {
        // Function that takes in an array of receipts along with a start and end date,
        // and returns a new array of receipts falling between these two dates.
        fallsBetween: function(start, end, receipts) {
          var finalReceipts = [];
          for (var i = 0; i < receipts.length; i++) {
            var start_compare = dateCompare(start, receipts[i].order_date);
            var end_compare = dateCompare(end, receipts[i].order_date);
            if ((start_compare == 0 || start_compare == 1) && (end_compare == 1 || end_compare == 2)) {
              finalReceipts.push(receipts[i]);
            }
          }
          return finalReceipts;
        },

        transformDateFormat: function (date) {
          return (date.split(" ")[3] + "-" + dates[date.split(" ")[1]] + "-" + date.split(" ")[2] + " " + date.split(" ")[4]);
        }
    };
});

/* Returns the day, month, or year
   year: index = 0
   month: index = 1
   day: index = 2
*/
var getDayMonthYear = function (date, index) {
  return parseInt(date.split(" ")[0].split("-")[index]);
}

/* Returns 0, 1, 2
   0: date1 < date2
   1: date1 == date2
   2: date1 > date2
*/
var dateCompare = function (date1, date2) {
  date1day = getDayMonthYear(date1, 2);
  date1month = getDayMonthYear(date1, 1);
  date1year = getDayMonthYear(date1, 0);
  date2day = getDayMonthYear(date2, 2);
  date2month = getDayMonthYear(date2, 1);
  date2year = getDayMonthYear(date2, 0);
  if (date1year < date2year) {
    return 0;
  } else if (date1year == date2year) {
    if (date1month < date2month) {
      return 0;
    } else if (date1month == date2month) {
      if (date1day < date2day) {
        return 0;
      } else if (date1day == date2day) {
        return 1;
      } else {
        return 2;
      }
    } else {
      return 2;
    }
  } else {
    return 2;
  }
}
var dates = {
  "Jan": "01",
  "Feb": "02",
  "Mar": "03",
  "Apr": "04",
  "May": "05",
  "Jun": "06",
  "Jul": "07",
  "Aug": "08",
  "Sep": "09",
  "Oct": "10",
  "Nov": "11",
  "Dec": "12"
};
