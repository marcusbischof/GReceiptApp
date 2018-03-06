angular.module('greceipt.factory.task', ['ngResource', 'greceipt.utils', 'greceipt.service.auth'])

.factory('taskFactory', function($q, $http, $_, $localstorage, $resource, authService) {

    var factory = {};

    var receipts_resource = function(token) {
        var _url = [APIG_ENDPOINT, 'receipts'].join('/');
        return $resource(_url, {}, {
            query: {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            }
        });
    }

    var receipt_count_resource = function(token) {
        var _url = [APIG_ENDPOINT, 'receipt_count'].join('/');
        return $resource(_url, {}, {
            query: {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            }
        });
    }

    factory.receipts_web_service = function (id, callback) {
      var return_val = {};
      console.log(id);
      $http({
          method:"POST",
          url:"http://dev.worlddd.net/gr/getReceiptDetails.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {
            "id": id
            // "id": 1
          }
        }).then(function(response) {
                // success
                console.log("success");
                console.log(response);
                callback (null, response.data);
        },
        function(response) { // optional
                // failed
                console.log("failure");
                console.log(response);
                callback (response, null);
        });
    }

    factory.receipt_items_webservice = function (id, transaction_id, callback) {
      $http({
          method:"POST",
          url:"http://dev.worlddd.net/gr/getItemDetails.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {
            "id": id,
            "transaction_id": transaction_id
          }
        }).then(function(response) {
                // success
                console.log("success");
                console.log(response);
                callback (null, response.data);
        },
        function(response) { // optional
                // failed
                console.log("failure");
                console.log(response);
                callback (response, null);
        });
    }

    factory.return_item_webservice = function (item_id, user_id, type, started_by, qty, callback) {
      $http({
          method:"POST",
          url:"http://dev.worlddd.net/gr/returns.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {
            "item_id": item_id,
            "id": user_id,
            "type": type,
            "started_by": started_by,
            "qty": qty
          }
        }).then(function(response) {
                // success
                console.log("success");
                console.log(response);
                callback (null, response.data);
        },
        function(response) { // optional
                // failed
                console.log("failure");
                console.log(response);
                callback (response, null);
        });
    }

    factory.item_status_webservice = function (user_id, item_id, callback) {
      $http({
          method:"POST",
          url:"http://dev.worlddd.net/gr/getReturnStatus.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {
            "id": user_id,
            "item_id": item_id
          }
        }).then(function(response) {
                // success
                console.log("success");
                console.log(response);
                callback (null, response.data);
        },
        function(response) {
                // failed
                console.log("failure");
                console.log(response);
                callback (response, null);
        });
    }

    var single_receipt_resource = function(token) {
        var _url = [APIG_ENDPOINT, 'receipt'].join('/');
        return $resource(_url, {}, {
            query: {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            }
        });
    };

    var create_folder_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'create_folder'].join('/');
      return $resource(_url, {
        user_id_account: '@user_id_account',
        folder_items: '@folder_items',
        folder_name: '@folder_name'
      }, {
          save: {
              method: 'POST',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    var update_folder_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'update_folder'].join('/');
      return $resource(_url, {
        user_id_account: '@user_id_account',
        folder_items: '@folder_items',
        folder_name: '@folder_name',
        account_id: '@account_id'
      }, {
          save: {
              method: 'PUT',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    var get_folders_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'folders'].join('/');
      return $resource(_url, {
        user_id_account: '@user_id_account'
      }, {
          save: {
              method: 'GET',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    var create_update_receipt_count = function(token) {
      var _url = [APIG_ENDPOINT, 'update_receipt_count'].join('/');
      console.log("_url is --> ", _url);
      return $resource(_url, {
        user_id: '@user_id',
        receipt_count: '@receipt_count'
      }, {
          save: {
              method: 'PUT',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    factory.listReceipts = function(cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            receipts_resource(data.token.jwtToken).query({
                userid: data.username
            }, function(data) {
                return cb(null, data.Items);
            }, function(err) {
                return cb(err, null);
            });
        }, function(msg) {
            console.log("Unable to retrieve the user session.");
            $state.go('login', {});
        });
    };

    factory.getReceipt = function(receiptId, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            single_receipt_resource(data.token.jwtToken).query({
                userid: data.username,
                receiptid: receiptId
            }, function(data) {
                return cb(null, data.Items);
            }, function(err) {
                return cb(err, null);
            });
        }, function(msg) {
            console.log("Unable to retrieve the user session.");
            $state.go('login', {});
        });
    };

    factory.getReceiptCount = function(cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            receipt_count_resource(data.token.jwtToken).query({
                user_id: data.username
            }, function(data) {
                return cb(null, data.Items);
            }, function(err) {
                return cb(err, null);
            });
        }, function(msg) {
            console.log("Unable to retrieve the user session.");
            $state.go('login', {});
        });
    };

    factory.updateCreateReceiptCount = function(rec_count, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            console.log("data is now --> ", data);
            var _receiptCount = {
                user_id: data.username,
                receipt_count: rec_count
            };
            create_update_receipt_count(data.token.jwtToken).save({
              user_id_account: data.username,
              receipt_count: rec_count
            }, _receiptCount, function(data) {
                if ($_.isEmpty(data)) {
                    return cb(null, data);
                }
                return cb(null, data);
            }, function(err) {
                return cb(err, null);
            });
        }, function(msg) {
            console.log("Unable to retrieve the user session.");
            $state.go('login', {});
        });

    };

    factory.createFolder = function(items_folder, name_folder, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _folder_obj = {
                user_id_account: data.username,
                folder_items: items_folder,
                folder_name: name_folder
            };
            create_folder_resource(data.token.jwtToken).save({
              user_id_account: data.username,
              folder_items: items_folder,
              folder_name: name_folder
            }, _folder_obj, function(data) {
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

    factory.updateFolder = function(items_folder, name_folder, acc_id, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _folder_obj = {
                user_id_account: data.username,
                folder_items: items_folder,
                folder_name: name_folder,
                account_id: acc_id
            };
            update_folder_resource(data.token.jwtToken).save({
              user_id_account: data.username,
              folder_items: items_folder,
              folder_name: name_folder,
              account_id: acc_id
            }, _folder_obj, function(data) {
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

    factory.getFolders = function(cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _user = {
                user_id_account: data.username
            };
            get_folders_resource(data.token.jwtToken).save({
              user_id_account: data.username
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

    return factory;
});
