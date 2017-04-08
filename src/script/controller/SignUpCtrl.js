'use strict';

angular.module('app').controller('SignUpCtrl', SignUpCtrl);

SignUpCtrl.$inject = ['$scope', 'ShowInfoService', 'CheckInfoService', 'AuthenticationService'];

function SignUpCtrl($scope, ShowInfoService, CheckInfoService, AuthenticationService) {
  $scope.signUpInfo = {
    username: "",
    email: "",
    password: "",
    repeatpwd: ""
  };

  $scope.warningInfo = {
    username: "",
    email: "",
    password: "",
    repeatpwd: ""
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

  // 检查每一项
  $scope.check = function($event) {
    var id = $event.target && $event.target.id;

    CheckInfoService.check(id, $scope.signUpInfo[id], $scope.signUpInfo.password)
      .then(function() {
        // 检查通过，清空提示信息
        $scope.warningInfo[id] = "";
      })
      .catch(function(err) {
        // 检查未通过，显示提示信息
        $scope.warningInfo[id] = err.msg;
      });
  };

  // 点击“注册”按钮提交表单
  $scope.signUserUp = function() {
    CheckInfoService.checkAll($scope.signUpInfo)
      .then(function() {
        var username = $scope.signUpInfo.username;
        var email = $scope.signUpInfo.email;
        var password = $scope.signUpInfo.password;
        for (var key in $scope.warningInfo) {
          $scope.warningInfo[key] = "";
        }
        ShowInfoService.popup("注册中，请稍候～");
        AuthenticationService.signup(username, email, password);
      })
      .catch(function(err) {
        $scope.warningInfo[err.name] = err.msg;
      });
  };
}
