'use strict';

angular.module('app').controller('SignInCtrl', SignInCtrl);

SignInCtrl.$inject = ['$scope', 'AuthenticationService'];

function SignInCtrl($scope, AuthenticationService) {
  $scope.signInInfo = {
    account: "",
    password: ""
  };

  // 密码的显示/隐藏
  $scope.pwdInputType = "password";
  $scope.iconEyeWhich = "icon-eye-close";
  $scope.showEyeIcon = false;
  $scope.changePwdInputType = function() {
    if ($scope.pwdInputType === "password") {
      $scope.pwdInputType = "text";
      $scope.iconEyeWhich = "icon-eye-open";
    } else {
      $scope.pwdInputType = "password";
      $scope.iconEyeWhich = "icon-eye-close";
    }
  };

  // 点击“登录”按钮提交表单
  $scope.signUserIn = function() {
    var account = $scope.signInInfo.account;
    var password = $scope.signInInfo.password;
    AuthenticationService.signin(account, password);
  };
}
