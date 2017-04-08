'use strict';

angular.module('app', ['ui.router', 'ngCookies', 'validation']).run(RootCtrl);

RootCtrl.$inject = ['$rootScope', '$state', 'ShowInfoService'];

function RootCtrl($rootScope, $state, ShowInfoService) {
  $rootScope.submitInfo = {
    info: "",
    theme: "default",
    opacity: "opacity-one"
  };

  $rootScope.loggedIn = false;

  // fortest todo..
  // $rootScope.testInfo = {
  //   info: '竟然可以直接从 子 scope 中找到 $rootScope 中的',
  //   theme: 'default'
  // };

  // ui-router doc: https://github.com/angular-ui/ui-router/wiki

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    // do nothing..
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if (error.authenticated === false) {
      $state.go('signin');
      ShowInfoService.popup("请先登录！", "warn");
    } else if (error.is404) {
      $state.go('404');
    }
  });
}

// 别忘了 index.html 里的 ng-app="app" ！！
