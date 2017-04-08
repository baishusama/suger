'use strict';

angular.module('app').directive('appArticleContentRender', ['MarkdownRenderService', function(MarkdownRenderService) {
  return {
    restrict: 'A',
    // replace: true,
    // templateUrl: 'view/template/articleContentRender.html',
    scope: {
      appNgModel: '='
    },
    link: function(scope, element) {
      element.html(MarkdownRenderService.renderToHtml(scope.appNgModel));
    }
  };
}]);
