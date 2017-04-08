'use strict';

angular.module('app').factory('FetchInfoService', FetchInfoService);

FetchInfoService.$inject = ['$http', '$q'];

function FetchInfoService($http, $q) {
  // var ROOT = "http://localhost/blog/build/";

  // 获取某个作者的所有文集（过滤暂时放在 resolve 部分）
  function getAllBooksBy(uid) {
    var deferred = $q.defer();

    $http.get('api/book/byuser.php?uid=' + uid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某个文集的所有文章（过滤暂时放在 resolve 部分）
  function getAllArticlesFrom(bid) {
    var deferred = $q.defer();

    $http.get('api/article/frombook.php?bid=' + bid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某篇已发布的文章的信息
  function getPublishedArticle(aid) {
    var deferred = $q.defer();

    $http.get('api/article/single.php?aid=' + aid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取全部已发布的文章的信息（包含首图和作者信息）
  function getAllPublishedArticles() {
    var deferred = $q.defer();

    $http.get('api/article/allPublished.php').then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某个作者全部已发布的文章的信息（包含首图和作者信息）
  function getArticlesPublishedWithAuthor(uid) {
    var deferred = $q.defer();

    $http.get('api/article/publishedWithUser.php?uid=' + uid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  // 获取某个作者全部已丢弃的文章的信息
  function getArticlesAbandonedByUser(uid) {
    return $http.get('api/article/abandonedByUser.php?uid=' + uid);
  }

  // 获取某篇文章的作者信息
  function getAuthor(uid) {
    var deferred = $q.defer();

    $http.get('api/user/author.php?uid=' + uid).then(function(resp) {
      deferred.resolve(resp.data);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  return {
    getAllBooksBy: getAllBooksBy,
    getAllArticlesFrom: getAllArticlesFrom,
    getPublishedArticle: getPublishedArticle,
    getAllPublishedArticles: getAllPublishedArticles,
    getArticlesPublishedWithAuthor: getArticlesPublishedWithAuthor,
    getArticlesAbandonedByUser: getArticlesAbandonedByUser,
    getAuthor: getAuthor
  };
}
