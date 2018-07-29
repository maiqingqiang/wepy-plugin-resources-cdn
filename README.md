# wepy-plugin-resources-cdn


[![npm](https://img.shields.io/npm/v/wepy-plugin-resources-cdn.svg)](https://www.npmjs.com/package/wepy-plugin-resources-cdn)

[![npm](https://img.shields.io/npm/l/wepy-plugin-resources-cdn.svg)](https://www.npmjs.com/package/wepy-plugin-resources-cdn)


## 介绍

由于小程序代码包限制2M，经常会因为代码包超出2M而无法上传代码。一般都是因为图片等资源用得太多而导致包太大，因此我们会把图片放到服务器或CDN中，从而减少包体积。

为了方便把代码包中的图片上传到CDN中，本人开发了`wepy-plugin-resources-cdn`插件，在打包小程序时会自动把代码中用到的图片上传到指定的CDN中。

## 特性

* 支持阿里云oss
* 支持腾讯云cos
* 支持又拍云
* 支持七牛
* 上传成功后，自动删除dist包中的图片,减少dist体积

## 注意

* 暂时只支持wepy

## 安装

```
npm i wepy-plugin-resources-cdn --save-dev
```

## 配置`wepy.config.js`

```
module.exports.plugins = {
    'resources-cdn': {
          driver: 'oss',   //选择使用的云存储
          qiniu: {          //七牛配置
            accessKey: 'xxxxx',
            secretKey: 'xxxxx',
            bucket: 'xxxxx',
            domain: 'http://xxxxx.com'
          },
          upyun: {          //又拍云配置
            service: 'xxxxx',
            name: 'xxxxx',
            password: 'xxxxx',
            domain: 'http://xxxxx.net'
          },
          cos: {            //cos配置
            appId: 'xxxxx',
            secretId: 'xxxxx',
            secretKey: 'xxxxx',
            bucket: 'xxxxx',
            region: 'ap-guangzhou',
            https: true     //开启https
          },
          oss: {            //oss配置
            accessKeyId: 'xxxxx',
            accessKeySecret: 'xxxxx',
            bucket: 'xxxxx',
            region: 'oss-cn-shenzhen',
            secure: true    //开启https
          },
          config: {
            prefix: 'cdn-wxapp',  //上传前缀
            debugMode: true,      //开启debug
            time: true            //给图片url后面加上`?t=time()`防止重新打包后，因为缓存导致图片没变化
          }
        }
};
```

[License MIT](https://github.com/xiaomak/wepy-plugin-resources-cdn/blob/master/LICENSE)
