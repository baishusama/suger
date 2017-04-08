'use strict';

angular.module('app').directive('appDraftEditor', ['ArticleManageService', 'ShowInfoService', '$state', function(ArticleManageService, ShowInfoService, $state) {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/draftEditor.html',
    scope: {
      article: '=',
      articles: '=',
      // updateArticlePanel: '&',
      recover: '&'
    },
    link: function(scope, element) {
      // console.log("In draftEditor, article : ", scope.article);

      scope.recover = function() {
        var aid = scope.article.aid;

        ArticleManageService.recoverArticle(aid)
          .then(function(resp) {
            var aid = resp.data.toString(); // => string
            var aids = scope.articles.map(function(elem) {
              return elem.aid;
            });
            var index = aids.indexOf(aid);
            scope.articles.splice(index, 1);

            // 显示提示信息
            ShowInfoService.popup("已恢复(,, ･∀･)ﾉ゛");

            // 去往父状态
            $state.go('writer.draft');
          })
          .catch(function(err) {
            console.log(err);
            // 显示提示信息
            ShowInfoService.popup("恢复失败 Orz。。\n错误码：" + err.status, 'warn');
          });
      };

      scope.delete = function() {
        var aid = scope.article.aid;
        console.log('In draftEditor.delete, aid : ', aid);

        ArticleManageService.deleteArticle(aid)
          .then(function(resp) {
            console.log(resp);
            var aid = resp.data.toString(); // => string
            var aids = scope.articles.map(function(elem) {
              return elem.aid;
            });
            var index = aids.indexOf(aid);
            scope.articles.splice(index, 1);

            // 显示提示信息
            ShowInfoService.popup("已删除=。=");

            // 去往父状态
            $state.go('writer.draft');
          })
          .catch(function(err) {
            console.log(err);
            ShowInfoService.popup("删除失败 Orz。。\n错误码：" + err.status, 'warn');
          });
      };
    }
  };
}]);
