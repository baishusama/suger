'use strict';

angular.module('app').directive('appArticleContentEditor', ['ArticleManageService', function(ArticleManageService) {
  return {
    restrict: 'A',
    // replace: true,
    // templateUrl: 'view/template/articleContentEditor.html',
    scope: {
      appNgModel: '=',
      onImgDrop: '&'
    },
    link: function(scope, element) { // , attrs , controller
      // At the very beginning,
      //   When replace === true ,element is <textarea>
      //   When replace === false ,element is <textarea>'s parent
      // Now, (after changed the caller even with replace === false),
      // element is <textarea>
      var area = element[0];

      area.addEventListener('dragover', function(e) {
        if (e.preventDefault) e.preventDefault();
      }, false);

      area.addEventListener('dragenter', function(e) {
        if (e.preventDefault) e.preventDefault();
      }, false);

      area.addEventListener('dragleave', function(e) {
        if (e.preventDefault) e.preventDefault();
      }, false);

      area.addEventListener('drop', function(event) {
        event.preventDefault();

        scope.$apply(function() { // ???
          var params = {
            'files': event.dataTransfer.files
          };
          scope.onImgDrop({
            params: params
          });
        });

        return false;
      }, false);
    }
  };
}]);
