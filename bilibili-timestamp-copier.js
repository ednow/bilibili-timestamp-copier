// ==UserScript==
// @name         bilibili timestamp copier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include      https://www.bilibili.com/video/*
// @description  try to take over the world!
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @author       ednow
// @grant        none
// ==/UserScript==

(function() {
    var TEXT_COPY_BUTTON = "复制时间轴";
    var TEXT_OPEN_BUTTON = "打开复制功能";
    var div = document.createElement('span'),openDiv = document.createElement('div');
    var openDivCss = `left: 0;
	position: fixed;
	bottom: 0;
	width: 100%;
    z-index: 100;
   `
    openDiv.setAttribute('style', openDivCss);
    openDiv.addEventListener('mousedown', function () {
      load()
    });
    openDiv.textContent = TEXT_OPEN_BUTTON;
    openDiv.setAttribute('class', "openMode");
    // 插入开启选项
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(openDiv);

    // https://blog.csdn.net/u010565174/article/details/46909351
    div.textContent = TEXT_COPY_BUTTON;
    // 添加class name，方便查找
    div.setAttribute('class', "copier");
        // 监听点击事件
    div.addEventListener('mousedown', function () {
      tempAlert("复制成功",1000)
      copyTextToClipboard(getTime())
    });
    //load();
    // 每三秒检查一次元素是否在页面上
   // var checkExist = setInterval(function(){
        //if($(".copier").length < 1){
            //load();
        //}
    //}, 3000);

    // 挂载脚本和元素
    function load(){
        // 将标签塞入到页面中,插入到点赞分享的位置后面
        var ops = document.getElementsByClassName('ops')[0]
        ops.appendChild(div);
        //$(".ops")[0].after(div);
    }

    function getTime(){
        var [minutes,seconds] = $(".bilibili-player-video-time-now")[0].textContent.split(":")

        // 拼接要复制的内容
        return "https://www.bilibili.com/video/" + /BV[a-zA-Z1-9]+/.exec(window.location.href) + `?t=${parseInt(minutes)*60 + parseInt(seconds)}`

    }

    function tempAlert(msg,duration)
    {
        var el = document.createElement("div");
        el.setAttribute("style","position:absolute;top:50%;left:50%;background-color:white;");
        el.innerHTML = msg;
        setTimeout(function(){
            el.parentNode.removeChild(el);
        },duration);
        document.body.appendChild(el);
    }

    // 复制内容到剪切板
    // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    function copyTextToClipboard(text) {
        var textArea = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if the element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a
        // flash, so some of these are just precautions. However in
        // Internet Explorer the element is visible whilst the popup
        // box asking the user for permission for the web page to
        // copy to the clipboard.
        //

        // Place in the top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of the white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }
})();