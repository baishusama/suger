'use strict';

angular.module('app').controller('VerifyCtrl', VerifyCtrl);

VerifyCtrl.resolve = {
  _verifyInfo: ['$state', '$stateParams', 'AuthenticationService', '$q', function($state, $stateParams, AuthenticationService, $q) {
    var email = $stateParams.email;
    var hash = $stateParams.hash;
    return AuthenticationService.verify(email, hash)
      .then(function(resp) {
        if (resp.status === 200) {
          return {
            msg: resp.data,
            icon: 'icon-ok-circle'
          };
        }
      })
      .catch(function(err) {
        if (err.status === 404) {
          return $q.reject({
            is404: true
          }); // 可行么???
        } else if (err.status === 400) {
          return {
            msg: err.data,
            icon: 'icon-remove-circle'
          };
        }
      });
  }]
};

VerifyCtrl.$inject = ['$scope', '_verifyInfo'];

function VerifyCtrl($scope, _verifyInfo) {
  $scope.verifyInfo = _verifyInfo;
}
