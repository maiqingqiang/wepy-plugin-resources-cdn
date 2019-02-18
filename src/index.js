import path from 'path';
import fs from 'fs';
import Utils from './utils/index';
import QiniuDriver from './driver/qiniu';
import UpyunDriver from './driver/upyun';
import CosDriver from './driver/cos';
import OssDriver from './driver/oss';
import S3Driver from './driver/s3';

export default class CloudStorage {
  constructor(options = {}) {
    this.options = options;

    this.options.config = Object.assign({
      prefix: 'cdn-wxapp',
      debugMode: true,
      time: true,
      delDistImg: true
    }, this.options.config);

    this.driver = null;

    switch (this.options.driver) {
      case 'qiniu':
        this.driver = new QiniuDriver(this.options);
        break;
      case 'upyun':
        this.driver = new UpyunDriver(this.options);
        break;
      case 'cos':
        this.driver = new CosDriver(this.options);
        break;
      case 'oss':
        this.driver = new OssDriver(this.options);
        break;
      case 's3':
        this.driver = new S3Driver(this.options);
        break;
      default:
        Utils.error('THE DRIVER NOT FOUND');
        return;
    }

  }

  apply(op) {
    const _this = this;
    const {code, type} = op;

    if ((type === 'wxml' || type === 'css' || type === 'page') && code) {
      const reg = /(\.{0,2}(\"|\'))+(\S+)\.(png|jpg|jpeg|gif|bmp|webp)/gi;
      const images = code.match(reg) || [];
      images.map(image => {
        try {
          image = image.replace(/(\"|\')/, '');
          if (!/http[s]{0,1}/.test(image)) {
            const remotePath = _this.options.config.prefix + image;
            const localFile = path.join(process.cwd(), 'src', image);

            _this.driver.uploader(remotePath, localFile)
              .then(res => {
                !_this.options.config.debugMode || Utils.success(res.original, '上传到CDN响应数据');

                let newUrl = _this.options.config.time ? res.url + '?t=' + new Date().getTime() : res.url;

                op.code = op.code.replace(image, newUrl);
                op.next();

                Utils.success(image + ' ----> ' + newUrl, '上传到CDN成功');

                !_this.options.config.delDistImg || fs.unlink(path.join(process.cwd(), 'dist', image), (err) => {

                  if (_this.options.config.debugMode && err) {
                    Utils.warn(err, '删除dist图片');
                  }

                  err || Utils.success(image, '删除dist图片成功');

                });

              }).catch(e => Utils.error(e, '上传到CDN失败'));
          }
        } catch (e) {
          Utils.error(e, '上传失败');
        }
      });
    }
    op.next();
  }
}
