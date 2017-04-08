'use strict';

angular.module('app').controller('ArticleCtrl', ArticleCtrl);

ArticleCtrl.resolve = {
  _articleInfo: ['$stateParams', '_articlesInfo', '$q', function($stateParams, _articlesInfo, $q) {
    console.log('ArticleCtrl-RESO: _articlesInfo : ', _articlesInfo);

    var aid = $stateParams.aid;

    var curArticleObj = _articlesInfo.filter(function(elem) {
      return elem.aid === aid;
    })[0];

    if (curArticleObj === undefined) {
      // 如果当前文集（book）中没有文章的话，无法访问 writer.book.article 状态
      return $q.reject({
        is404: true
      });
    } else {
      return $q.when(curArticleObj);
    }
  }]
};

ArticleCtrl.$inject = ['$scope', '_articleInfo'];

function ArticleCtrl($scope, _articleInfo) {
  console.log("ARTICLE-Init: _articleInfo : ", _articleInfo);
  console.log("++++++++++++++++++++++++");

  $scope.articleInfo = _articleInfo;
}
