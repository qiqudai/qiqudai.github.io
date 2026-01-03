function build_url() {
    var rawUrl = document.querySelector('#url').value;
    if (rawUrl === "" || rawUrl.indexOf("http") === -1) {
        document.getElementById("b_url").innerHTML = `输入的不是链接或者未加http请求头！`;
    }
    else {
        // 1. 获取选中的模式 (direct 或 click)
        var mode = document.querySelector('input[name="mode"]:checked').value;

        // 2. 构造数据包 (使用短键名节省长度: t=target, m=mode)
        var payload = {
            t: rawUrl,
            m: mode
        };

        // 3. 转 JSON -> URI编码 -> Base64
        // 为什么要先 URI 编码？因为 Base64 处理中文直接 stringify 可能会乱码
        var jsonStr = JSON.stringify(payload);
        var encodedData = btoa(encodeURIComponent(jsonStr));

        // 获取当前页面的基础路径 (去掉 index.html 和末尾的 /)
        var limit = document.location.pathname.lastIndexOf('/') + 1;
        var path = document.location.pathname.substring(0, limit);
        var baseUrl = document.location.origin + path;

        var fullUrl = baseUrl + "api/?data=" + encodedData;

        // 生成显示的 HTML：链接 + 换行 + 大复制按钮
        var html = `
            <div style="margin-top: 20px;">
                <a href="${fullUrl}" target="_blank" style="word-break: break-all; font-size: 14px; color: #007aff;">${fullUrl}</a>
            </div>
            <button onclick="copyLink('${fullUrl}')" style="
                margin-top: 15px;
                padding: 12px 30px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(40, 167, 69, 0.2);
            ">📋 一键复制链接</button>
        `;
        document.getElementById("b_url").innerHTML = html;
    }
}

// 新增复制函数
function copyLink(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
            alert('复制成功！快去分享吧');
        }, function (err) {
            alert('复制失败，请手动复制');
        });
    } else {
        // 兼容旧浏览器
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        alert('复制成功！');
    }
}
