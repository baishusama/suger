'use strict';

angular.module('app').factory('ArticleManageService', ArticleManageService);

ArticleManageService.$inject = ['$http', '$q'];

function ArticleManageService($http, $q) {
  var ROOT = "http://localhost/blog/build/";

  // 新建文章
  function addArticle(uid, bid) {
    var data = {
      'uid': uid,
      'bid': bid
    };

    var deferred = $q.defer();

    $http.post(ROOT + 'api/article/new.php', data)
      .then(function(resp) {
        deferred.resolve(resp);
      })
      .catch(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  // 更新（保存）文章
  function updateArticle(aid, title, content) {
    var data = {
      'aid': aid,
      'title': title,
      'content': content
    };

    var deferred = $q.defer();
    var msg = "";

    $http.post(ROOT + 'api/article/update.php', data)
      .then(function(resp) {
        // if (resp.status === 200) {
        //   msg = "保存成功 :P";
        // } else if (resp.status === 204) {
        //   msg = "已是最新 :)";
        // }
        msg = "保存成功 :P";
        deferred.resolve(msg);
      })
      .catch(function(err) {
        msg = "保存失败 XO";
        deferred.reject(msg);
      });

    return deferred.promise;
  }

  // 发布/取消发布文章
  function publishArticle(aid, published) {
    var data = {
      'aid': aid,
      'published': published
    };

    var deferred = $q.defer();

    $http.post(ROOT + 'api/article/publish.php', data)
      .then(function(resp) {
        deferred.resolve(resp);
      })
      .catch(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  // 文章放入废纸箱
  function abandonArticle(aid, abandoned) {
    var data = {
      'aid': aid,
      'abandoned': abandoned
    };

    return $http.post(ROOT + 'api/article/abandon.php', data);
  }

  // 文章取消放入废纸箱
  function recoverArticle(aid) {
    return abandonArticle(aid, 0);
  }

  // 彻底删除文章
  function deleteArticle(aid) {
    var data = {
      'aid': aid
    };

    return $http.post(ROOT + 'api/article/deleteDevOnly.php', data);
  }

  // 上传图片
  function uploadImage(uploadImgData) {
    var data = uploadImgData;

    var deferred = $q.defer();

    $http.post(ROOT + 'api/image/uploadDevOnly.php', data, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
        // headers: {
        //   (x) 'Content-Type': 'multipart/form-data; charset=utf-8'
        // }
      })
      .then(function(resp) {
        deferred.resolve(resp);
      })
      .catch(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  return {
    addArticle: addArticle,
    updateArticle: updateArticle,
    publishArticle: publishArticle,
    abandonArticle: abandonArticle,
    recoverArticle: recoverArticle,
    deleteArticle: deleteArticle,
    uploadImage: uploadImage
  };
}
