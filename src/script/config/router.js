'use strict';

// 隐式声明方式，
// 需要使用一个插件转换成显示声明的方式，
// 否则会对压缩造成影响
// angular.module('app').config(function(x,y) {});

// 显示声明方式
angular.module('app').config(Config);

Config.$inject = ['$stateProvider', '$urlRouterProvider'];

function Config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'view/signin.html',
      controller: 'SignInCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'view/signup.html',
      controller: 'SignUpCtrl'
    })
    .state('verify', {
      url: '/verify/:email/:hash',
      templateUrl: 'view/verify.html',
      controller: 'VerifyCtrl',
      resolve: VerifyCtrl.resolve
    })
    .state('home', {
      url: '/home',
      templateUrl: 'view/home.html',
      controller: 'HomeCtrl',
      resolve: HomeCtrl.resolve
    })
    .state('user', {
      url: '/user/:uid',
      templateUrl: 'view/user.html',
      controller: 'UserCtrl',
      resolve: UserCtrl.resolve
    })
    .state('writer', {
      // abstract: true,
      url: '/writer',
      templateUrl: 'view/writer.html',
      controller: 'WriterCtrl',
      resolve: WriterCtrl.resolve
    })
    // .state('writer.booklist', {
    //   url: '/book',
    //   templateUrl: 'view/writer.booklist.html'
    // })
    .state('writer.book', {
      url: '/book/:bid',
      templateUrl: 'view/writer.book.html',
      controller: 'BookCtrl',
      resolve: BookCtrl.resolve
    })
    .state('writer.book.article', {
      url: '/article/:aid',
      templateUrl: 'view/writer.book.article.html',
      controller: 'ArticleCtrl',
      resolve: ArticleCtrl.resolve
    })
    .state('writer.draft', {
      url: '/draft',
      templateUrl: 'view/writer.draft.html',
      controller: 'DraftCtrl',
      resolve: DraftCtrl.resolve
    })
    .state('writer.draft.article', {
      url: '/article/:aid',
      templateUrl: 'view/writer.draft.article.html',
      controller: 'ArticleCtrl',
      resolve: ArticleCtrl.resolve
    })
    .state('article', {
      url: '/article/:aid',
      templateUrl: 'view/article.html',
      controller: 'ArticlePageCtrl',
      resolve: ArticlePageCtrl.resolve
    })
    .state('404', {
      url: '/404',
      templateUrl: 'view/404.html'
    });

  // $urlRouterProvider.otherwise('home');
}
