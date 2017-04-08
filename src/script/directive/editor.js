'use strict';

angular.module('app').directive('appEditor', ['AuthenticationService', 'ArticleManageService', '$timeout', function(AuthenticationService, ArticleManageService, $timeout) {
  return {
    restrict: 'A',
    // replace: true,
    templateUrl: 'view/template/editor.html',
    scope: {
      article: '='
    },
    link: function(scope, element) {
      // 获取输入框
      var inputElem = element.find('input');
      var textareaElem = element.find('textarea');
      var inputs = [inputElem, textareaElem];
      var saveTimeout = null;

      // 为输入框绑定 keydown 事件
      inputs.forEach(function(elem) {
        elem.on('keydown', function(event) {
          // console.log(event);
          var keyCode = event.keyCode;
          if ([16, 17, 18, 20, 91].indexOf(keyCode) !== -1) { // 分别对应 shift,ctrl,alt,CapsLock,cmd
            // 如果只是输入功能键，什么也不会发生
          } else if (event.ctrlKey && keyCode === 83 || event.metaKey && keyCode === 83) { // Ctrl + S || Cmd + S
            // 用户的手动保存
            event.preventDefault();
            scope.save();
          } else {
            // 系统的自动保存
            $timeout.cancel(saveTimeout);
            saveTimeout = $timeout(function() {
              scope.autoSave();
            }, 1500);
          }
        });
      });

      // 用户信息（主要是图片上传存放路径需要：e.g. image/$uid/$aid/*.jpg）
      scope.user = AuthenticationService.getLoggedInCache();

      // “保存”相关的提示信息
      scope.saveMsg = "";

      // 清除“保存”相关的提示信息
      scope.clearSaveMsg = function() {
        $timeout(function() {
          scope.saveMsg = "";
        }, 1000);
      };

      // 保存文章（手动）
      scope.save = function(auto) {
        scope.saveMsg = "正在保存..";
        var prefix = auto ? "自动" : "";
        var aid = scope.article.aid;
        var title = scope.article.title;
        var content = scope.article.content;

        ArticleManageService.updateArticle(aid, title, content)
          .then(function(okMsg) {
            scope.saveMsg = prefix + okMsg;
            scope.clearSaveMsg();
          })
          .catch(function(errMsg) {
            scope.saveMsg = prefix + errMsg;
            scope.clearSaveMsg();
          });
      };
      // 保存文章（自动）
      scope.autoSave = function() {
        scope.save(true);
      };

      // 改变文章的发布状态
      scope.changePublish = function() {
        var aid = scope.article.aid;
        var published = (scope.article.published === '0') ? '1' : '0';
        ArticleManageService.publishArticle(aid, published)
          .then(function(resp) {
            console.log("In appEditor.publish, resp : ", resp);
            scope.article.published = published;
          })
          .catch(function(err) {
            console.log("In appEditor.publish, err : ", err);
          });
      };

      // 当发生 drop 事件的时候，上传图片
      scope.uploadImgFile = function(params) {
        // fortest
        console.log('uploadImgFile func...');
        console.log('uploadImgFile\'s params: ', params);

        var files = params.files;
        var uid = scope.user.uid;
        var aid = scope.article.aid;

        // 准备 formdata 和 appendText
        var uploadFormData = new FormData();
        var tmpContent = scope.article.content;
        var appendUploadingText = "";
        var appendFinishedText = "";
        // uploadFormData.append('file', files[0]);
        if (files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            // 这里要先判断文件的类型：
            // 如果不是图片（png,jpg,gif）的话直接退出函数
            if (files[i].type.indexOf('image') !== -1) {
              uploadFormData.append('file' + i, files[i]);
              appendUploadingText += ("\n\n![图片 " + files[i].name + " 上传中..]");
            } else {
              alert("请上传图片，而不是其他文件！");
              return false;
            }
          }
        } else {
          alert("files.length === 0 OAO..");
          return false;
        }
        uploadFormData.append('uid', uid);
        uploadFormData.append('aid', aid);

        // Display the key/value pairs
        // for (var pair of uploadFormData.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }

        // 在文章内容中添加“图片上传中”字样
        // 简单起见，暂时放在最末尾吧
        scope.article.content += appendUploadingText;

        // 上传图片
        ArticleManageService.uploadImage(uploadFormData)
          .then(function(resp) {
            console.log('In appEditor.uploadImgFile, resp : ', resp);

            // 在文章内容中将“图片上传中”字样替换为对应的 url 或者提示信息
            // 简单起见，暂时放在最末尾吧
            for (var i = 0; i < files.length; i++) {
              var piece = resp.data[i];
              appendFinishedText += ("\n\n![" + piece.name + "](" + piece.url + ")");
            }
            scope.article.content = tmpContent + appendFinishedText;
            scope.autoSave();
          })
          .catch(function(err) {
            console.log('In appEditor.uploadImgFile, err : ', err);

            // 在文章内容中将“图片上传中”字样替换为对应的 url 或者提示信息
            // 简单起见，暂时放在最末尾吧
            for (var i = 0; i < files.length; i++) {
              var piece = err.data[i];
              appendFinishedText += ("\n\n![" + piece.name + "](" + piece.url + ")");
            }
            scope.article.content = tmpContent + appendFinishedText;
            scope.autoSave();
          });
      };
    }
  };
}]);
