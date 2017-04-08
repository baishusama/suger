'use strict';

angular.module('app').controller('UserCtrl', UserCtrl);

UserCtrl.resolve = {
  // _userInfo: ['$stateParams', 'FetchInfoService', '$q', function($stateParams, FetchInfoService, $q) {
  //   var uid = $stateParams.uid;
  //
  //   return FetchInfoService.getAuthor(uid)
  //     .then(function(resp) {
  //       return resp;
  //     })
  //     .catch(function(err) {
  //       if (err.status === 404) {
  //         return $q.reject({
  //           is404: true
  //         });
  //       }
  //     });
  // }],
  _allArticlesWithUser: ['$stateParams', 'FetchInfoService', 'MarkdownRenderService', '$q', function($stateParams, FetchInfoService, MarkdownRenderService, $q) {
    var uid = $stateParams.uid;

    console.log('uid : ', uid);
    console.log('typeof uid : ', typeof uid);

    return FetchInfoService.getArticlesPublishedWithAuthor(uid)
      .then(function(resp) {
        var articles = resp.articles.map(function(elem) {
          elem.contentText = MarkdownRenderService.renderToText(elem.content);
          elem.cover = MarkdownRenderService.renderCover(elem.content);
          return elem;
        });
        return {
          author: resp.author,
          articles: articles
        };
      })
      .catch(function(err) {
        if (err.status === 404) {
          return $q.reject({
            is404: true
          });
        } else {
          console.log("_allArticlesWithUser ERRR : ", err);
          return err;
        }
      });
  }]
};

UserCtrl.$inject = ['$scope', '_allArticlesWithUser'];

function UserCtrl($scope, _allArticlesWithUser) {
  // $scope.user = ;
  $scope.userInfo = _allArticlesWithUser.author;
  $scope.articles = _allArticlesWithUser.articles;
  console.log('UserCtrl INIT, _allArticlesWithUser : ', _allArticlesWithUser);
}
