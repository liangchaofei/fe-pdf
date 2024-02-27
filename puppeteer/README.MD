# 使用

1. 项目启动

```js
npm start
```

2. 输入 url 进行下载 pdf

# 难点

如果遇到下面情况：

## 图片懒加载

由于需生成 PDF 的页面是文章类型的页面，包含大量图片，且图片引入了懒加载，导致生成的 PDF 会带有很多懒加载兜底图

解决方法是跳转到页面后，将页面滚动到底部，所有图片资源都会得到请求，waitUntil 设置为 networkidle2，图片就能加载成功了。

```js
await autoScroll(page) // 因为文章图片引入了懒加载，所以需要把页面滑动到最底部，保证所有图片都加载出来

/**
 * 控制页面自动滚动
 * */
function autoScroll (page) {
  return page.evaluate(() => {
    return new Promise<void>(resolve => {
      let totalHeight = 0
      const distance = 100
      // 每200毫秒让页面下滑100像素的距离
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 200)
    })
  })
}

```

## CSS 打印样式

根据官网说明，page.pdf() 生成 PDF 文件的样式是通过 print css media 指定的，因此可以通过 css 来修改生成的 PDF 的样式，以本文需求为例，生成的 PDF 需要隐藏头部、底部，以及其他和文章主体无关的部分，代码如下：

```css
@media print {
  .other_info,
  .authors,
  .textDetail_comment,
  .detail_recTitle,
  .detail_rec,
  .SuspensePanel {
    display: none !important;
  }

  .Footer,
  .HeaderSuctionTop {
    display: none;
  }
}
```

## 登录态

由于存在一部分文章不对外部用户公开，需要鉴权用户身份，符合要求的用户才能看到文章内容，因此跳转到指定文章页后，需要在生成的浏览器窗口中注入登录态，符合条件的登录用户才能看到这部分文章的内容。
采用注入 cookie 的方式来获取登录态，使用 page.evaluate() 设置 cookie，代码如下：

```js
async function simulateLogin(page, cookies, domain) {
  return await page.evaluate(
    (sig, sess, domain) => {
      let date = new Date();
      date = new Date(date.setDate(date.getDate() + 1));
      let expires = "";
      expires = `; expires=${date.toUTCString()}`;
      document.cookie = `koa:sess.sig=${sig}${expires}; domain=${domain}; path=/`;
      document.cookie = `koa:sess=${sess}=${expires}; domain=${domain}; path=/`; // =是这个cookie的value
      document.cookie = `is_login=true${expires}; domain=${domain}; path=/`;
    },
    cookies["koa:sess.sig"],
    cookies["koa:sess"],
    domain
  );
}

await simulateLogin(page, cookies, config.domain.split("//")[1]);
```

## Docker 部署

参考 docerfile 文件
