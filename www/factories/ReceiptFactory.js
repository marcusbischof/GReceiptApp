angular.module('greceipt.factory.receipt', ['ngResource', 'greceipt.utils', 'greceipt.service.auth'])

.factory('receiptFactory', function($q, $http, $_, $localstorage, $resource, authService) {

    var factory = {};

    var get_receipts_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'receipts'].join('/');
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

    var update_receipt_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'update_receipt'].join('/');
      return $resource(_url, {
        userid: '@userid',
        receiptid: '@receiptid',
        billing_name: '@billing_name',
        transactionNumber: '@transactionNumber',
        cc_brand: '@cc_brand',
        cc_last_4: '@cc_last_4',
        merchantOrderID: '@merchantOrderID',
        name: '@name',
        order_date: '@order_date',
        shipping: '@shipping',
        shippingAddress: '@shippingAddress',
        status: '@status',
        subtotal: '@subtotal',
        tax: '@tax',
        taxonomy_level1: '@taxonomy_level1',
        taxonomy_level2: '@taxonomy_level2',
        taxonomy_level3: '@taxonomy_level3',
        total: '@total',
        type: '@type'
      }, {
          save: {
              method: 'PUT',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    var create_receipt_resource = function(token) {
      var _url = [APIG_ENDPOINT, 'create_receipt'].join('/');
      return $resource(_url, {
        userid: '@userid',
        billing_name: '@billing_name',
        transactionNumber: '@transactionNumber',
        cc_brand: '@cc_brand',
        cc_last_4: '@cc_last_4',
        merchantOrderID: '@merchantOrderID',
        name: '@name',
        order_date: '@order_date',
        shipping: '@shipping',
        shippingAddress: '@shippingAddress',
        status: '@status',
        subtotal: '@subtotal',
        tax: '@tax',
        taxonomy_level1: '@taxonomy_level1',
        taxonomy_level2: '@taxonomy_level2',
        taxonomy_level3: '@taxonomy_level3',
        total: '@total',
        type: '@type'
      }, {
          save: {
              method: 'POST',
              headers: {
                  'Authorization': token
              }
          }
      });
    }

    factory.getReceipts = function(cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _user = {
                userid: data.username
            };
            get_receipts_resource(data.token.jwtToken).save({
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

    factory.createReceipt = function(billing_name, transactionNumber, cc_brand, cc_last_4, merchantOrderID, name, order_date, shipping, shippingAddress, status, subtotal, tax, taxonomy_level1, taxonomy_level2, taxonomy_level3, total, type, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _receipt_obj = {
                userid: data.username,
                billing_name: billing_name,
                transactionNumber: transactionNumber,
                cc_brand: cc_brand,
                cc_last_4: cc_last_4,
                merchantOrderID: merchantOrderID,
                name: name,
                order_date: order_date,
                shipping: shipping,
                shippingAddress: shippingAddress,
                status: status,
                subtotal: subtotal,
                tax: tax,
                taxonomy_level1: taxonomy_level1,
                taxonomy_level2: taxonomy_level2,
                taxonomy_level3: taxonomy_level3,
                total: total,
                type: type
            };
            create_receipt_resource(data.token.jwtToken).save({
              userid: data.username,
              billing_name: billing_name,
              transactionNumber: transactionNumber,
              cc_brand: cc_brand,
              cc_last_4: cc_last_4,
              merchantOrderID: merchantOrderID,
              name: name,
              order_date: order_date,
              shipping: shipping,
              shippingAddress: shippingAddress,
              status: status,
              subtotal: subtotal,
              tax: tax,
              taxonomy_level1: taxonomy_level1,
              taxonomy_level2: taxonomy_level2,
              taxonomy_level3: taxonomy_level3,
              total: total,
              type: type
            }, _receipt_obj, function(data) {
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

    factory.updateReceipt = function(receiptid, billing_name, transactionNumber, cc_brand, cc_last_4, merchantOrderID, name, order_date, shipping, shippingAddress, status, subtotal, tax, taxonomy_level1, taxonomy_level2, taxonomy_level3, total, type, cb) {
        authService.getUserAccessTokenWithUsername().then(function(data) {
            var _receipt_obj = {
                userid: data.username,
                receiptid: receiptid,
                billing_name: billing_name,
                transactionNumber: transactionNumber,
                cc_brand: cc_brand,
                cc_last_4: cc_last_4,
                merchantOrderID: merchantOrderID,
                name: name,
                order_date: order_date,
                shipping: shipping,
                shippingAddress: shippingAddress,
                status: status,
                subtotal: subtotal,
                tax: tax,
                taxonomy_level1: taxonomy_level1,
                taxonomy_level2: taxonomy_level2,
                taxonomy_level3: taxonomy_level3,
                total: total,
                type: type
            };
            update_receipt_resource(data.token.jwtToken).save({
              userid: data.username,
              receiptid: receiptid,
              billing_name: billing_name,
              transactionNumber: transactionNumber,
              cc_brand: cc_brand,
              cc_last_4: cc_last_4,
              merchantOrderID: merchantOrderID,
              name: name,
              order_date: order_date,
              shipping: shipping,
              shippingAddress: shippingAddress,
              status: status,
              subtotal: subtotal,
              tax: tax,
              taxonomy_level1: taxonomy_level1,
              taxonomy_level2: taxonomy_level2,
              taxonomy_level3: taxonomy_level3,
              total: total,
              type: type
            }, _receipt_obj, function(data) {
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
