angular.module('greceipt.factory.report', ['ngResource', 'greceipt.utils', 'greceipt.service.auth'])

.factory('reportFactory', function($q, $rootScope, $http, $_, $localstorage, $resource, authService) {

    var factory = {};

    var get_reports_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'reports'].join('/');
      return $resource(_url, {
        userid: '@userid'
      }, {
          save: {
              method: 'GET',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    var update_report_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'update_report'].join('/');
      return $resource(_url, {
        userid: '@userid',
        end_date: '@end_date',
        receiptid_list: '@receiptid_list',
        receival_date: '@receival_date',
        report_tags: '@report_tags',
        report_name: '@report_name',
        start_date: '@start_date',
        reportid: '@reportid'
      }, {
          save: {
              method: 'PUT',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    var create_report_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'create_report'].join('/');
      return $resource(_url, {
        userid: '@userid',
        end_date: '@end_date',
        receiptid_list: '@receiptid_list',
        receival_date: '@receival_date',
        report_tags: '@report_tags',
        report_name: '@report_name',
        start_date: '@start_date'
      }, {
          save: {
              method: 'POST',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    factory.getreports = function(cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _user = {
                userid: data.username
            };
            get_reports_resource(data.token.jwtToken).save({
              userid: data.username
            }, _user, function(data) {
                if ($_.isEmpty(data)) {
                    return cb(null, data);
                }
                return cb(null, data);
            }, function(err) {
                return cb(err, null);
            });
        }, function(msg) {
            $state.go('login', {});
        });
    };

    factory.createreport = function(end_date, receiptid_list, receival_date, report_tags, report_name, start_date, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _report_obj = {
              userid: data.username,
              end_date: end_date,
              receiptid_list: receiptid_list,
              receival_date: receival_date,
              report_tags: report_tags,
              report_name: report_name,
              start_date: start_date
            };
            create_report_resource(data.token.jwtToken).save({
              userid: data.username,
              end_date: end_date,
              receiptid_list: receiptid_list,
              receival_date: receival_date,
              report_tags: report_tags,
              report_name: report_name,
              start_date: start_date
            }, _report_obj, function(data) {
                if ($_.isEmpty(data)) {
                    return cb(null, data);
                }
                return cb(null, data);
            }, function(err) {
                return cb(err, null);
            });
        }, function(msg) {
            $state.go('login', {});
        });
    };

    factory.updatereport = function(end_date, receiptid_list, receival_date, report_tags, report_name, start_date, reportid, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _report_obj = {
                userid: data.username,
                end_date: end_date,
                receiptid_list: receiptid_list,
                receival_date: receival_date,
                report_tags: report_tags,
                report_name: report_name,
                start_date: start_date,
                reportid: reportid
            };
            update_report_resource(data.token.jwtToken).save({
              userid: data.username,
              end_date: end_date,
              receiptid_list: receiptid_list,
              receival_date: receival_date,
              report_tags: report_tags,
              report_name: report_name,
              start_date: start_date,
              reportid: reportid
            }, _report_obj, function(data) {
                if ($_.isEmpty(data)) {
                    return cb(null, data);
                }
                return cb(null, data);
            }, function(err) {
                return cb(err, null);
            });
        }, function(msg) {
            $state.go('login', {});
        });
    };

    return factory;
});
