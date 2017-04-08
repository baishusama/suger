'use strict';

angular.module('app').factory('MarkdownRenderService', [function() {
  // 生成含类名的 HTML 标签
  var wrapTextIn = function(tagname, classname) {
    var clsn = classname || '';
    var openingTag = '<' + tagname + ' class="' + clsn + '">';
    var closingTag = '</' + tagname + '>';
    return openingTag + this + closingTag;
  };

  // 生成图片及说明文字
  var toImgTag = function(line) {
    var img = line.replace(/^\!\[(.*)\]\((.+)\)$/,
      '<div class="image-wrapper">' +
      '<img alt="$1" src="$2" />' +
      // '<br />' +
      '<div class="image-caption">' +
      '$1' +
      '</div></div>');
    return img;
  };

  // 生成链接
  var toAnchor = function(line) {
    var a = line.replace(/\[(.+?)\]\((.+?)\)/,
      '<a href="$2">' +
      '$1' +
      '</a>');
    return a;
  };

  // 生成有序和无序列表
  var toList = function(line) {
    function toNestedList(item, hier) {
      // When hier === 0, re = /(?:^[*] )|(?:\n[*] )/
      // When hier === 1, re = /(?:^[ ]{4}[*] )|(?:\n[ ]{4}[*] )/

      // 当前的层级（缩进）
      var spaceNum = hier * 4;

      // ul 和 ol 的正则
      var ure = new RegExp("(?:^[ ]{" + spaceNum + "}[*+-] )|(?:\\n[ ]{" + spaceNum + "}[*+-] )");
      var ore = new RegExp("(?:^[ ]{" + spaceNum + "}[0-9]+[.] )|(?:\\n[ ]{" + spaceNum + "}[0-9]+[.] )");

      var list = null;
      if (ure.test(item)) {
        // ul
        list = item.split(ure).map(function(item, index) {
          if (index === 0) {
            return item;
          } else {
            return '<li class="hierarchy-' + hier + '">' + toNestedList(item, hier + 1) + '</li>';
          }
        });
        return list[0] + '<ul class="hierarchy-' + hier + '">' + list.slice(1).join('') + '</ul>';
      } else if (ore.test(item)) {
        // ol
        list = item.split(ore).map(function(item, index) {
          if (index === 0) {
            return item;
          } else {
            return '<li class="hierarchy-' + hier + '">' + toNestedList(item, hier + 1) + '</li>';
          }
        });
        return list[0] + '<ol class="hierarchy-' + hier + '">' + list.slice(1).join('') + '</ol>';
      }

      return item;
    }

    // Way 1. 第一层展开写，后代层使用递归函数 toNestedList
    // var listContent = line.split(/(?:^[*] )|(?:\n[*] )/).map(function(item) {
    //   return '<li class="hierarchy-0">' + toNestedList(item, 1) + '</li>';
    // });
    // return '<ul class="hierarchy-0">' + listContent.slice(1).join('') + '</ul>';

    // Way 2. 全使用递归函数 toNestedList
    return toNestedList(line, 0);
  };

  // 渲染函数：将 MD 格式的文本转成 HTML
  function renderToHtml(string) {
    var result = "";

    // 1. 换行符 & 空格
    //   1.1. 保留单个换行符
    //   1.2. 多个换行符视为两个换行
    //   1.3. 首尾的空格会被去除
    //   1.4. ~~行内的多个空格（包括 Tab）视为一个空格~~
    var lines = string.replace(/\n{2,}/, '\n\n')
      .split('\n\n')
      .map(function(line) {
        return line.trim(); // .replace(/[ \t]+/, ' ')
      });

    // 2. 先检查行内 HTML 标签
    lines = lines.map(function(line) {
      // 删除线
      while (/[~]{2}.+[~]{2}/.test(line)) {
        line = line.replace(/[~]{2}(.+?)[~]{2}/, "<del>$1</del>");
      }
      // 加粗
      while (/[*]{2}.+[*]{2}/.test(line)) {
        line = line.replace(/[*]{2}(.+?)[*]{2}/, "<strong>$1</strong>");
      }
      // 斜体
      while (/[*]{1}.+[*]{1}/.test(line)) {
        line = line.replace(/[*]{1}(.+?)[*]{1}/, "<em>$1</em>");
      }
      // 行内代码
      while (/`.+`/.test(line)) {
        line = line.replace(/`(.+?)`/, "<code>$1</code>");
      }

      return line;
    });

    // 3. 添加非行内的 HTML 标签
    lines = lines.map(function(line) {
      if (/^> /.test(line)) {
        var quoteArr = line.split(/(?:^> )|(?:\n> )/).slice(1);
        quoteArr = quoteArr.map(function(elem) {
          if (elem.length === 0) {
            return '\n';
          }
          return elem;
        });
        // 引言中的部分视为一个新的 string （递归使用 render 进行渲染）
        var quoteStr = quoteArr.join('\n'); // quoteStr 相当于去掉了最左侧的一层'> '
        return '<blockquote>' + renderToHtml(quoteStr) + '</blockquote>';
      }

      if (/^\!\[.*\]\(.+\)$/.test(line)) {
        // 图片
        line = toImgTag(line);
      } else if (/^#/.test(line)) {
        // 标题（h1-h6）
        var sharpNum = line.match(/^#+/)[0].length;
        sharpNum = Math.min(sharpNum, 6);
        var text = line.replace(/^#+\s*/, '');
        line = wrapTextIn.call(text, 'h' + sharpNum);
      } else if (/(?:^[*] )|(?:^1\. )/.test(line)) {
        // 无序列表/有序列表
        line = toList(line);
      } else {
        // 段落
        line = wrapTextIn.call(line, 'p');
      }

      // 链接（严格说算行内，但是在图片后判断相对会更简单）
      while (/\[.+\]\(.+\)/.test(line)) {
        line = toAnchor(line);
      }

      return line;
    });

    // result += "<div>" + lines.join('') + "</div>";
    result += lines.join('');

    return result;
  }

  function renderToText(string) {
    var html = renderToHtml(string);
    // todo..不知道下面的 dom 操作有没有更 NG 的写法（估计是用 jqLite）
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.innerText;
  }

  function renderCover(string) {
    var html = renderToHtml(string);
    // todo..不知道下面的 dom 操作有没有更 NG 的写法（估计是用 jqLite）
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var firstImg = wrapper.getElementsByTagName('img')[0];
    var cover = firstImg && firstImg.src || "";

    return cover;
  }

  return {
    renderToHtml: renderToHtml,
    renderToText: renderToText,
    renderCover: renderCover
  };
}]);
