'use strict';

angular.module('app').controller('HomeCtrl', HomeCtrl);

HomeCtrl.resolve = {
  _allArticles: ['FetchInfoService', 'MarkdownRenderService', function(FetchInfoService, MarkdownRenderService) {
    return FetchInfoService.getAllPublishedArticles()
      .then(function(resp) {
        var articles = (resp || []).map(function(elem) {
          elem.contentText = MarkdownRenderService.renderToText(elem.content);
          elem.cover = MarkdownRenderService.renderCover(elem.content);
          return elem;
        });
        return articles;
      })
      .catch(function(err) {
        return err;
      });
  }]
};

HomeCtrl.$inject = ['$scope', '_allArticles'];

function HomeCtrl($scope, _allArticles) {
  // fortest
  console.log('HomeCtrl INIT : ', _allArticles);

  $scope.articles = _allArticles;
}
