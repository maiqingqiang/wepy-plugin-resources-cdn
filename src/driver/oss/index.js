import OSS from 'ali-oss';
import Promise from 'promise';
import Utils from '../../utils';
import fs from 'fs';

export default class OssDriver {

  constructor(options) {
    this.options = options;

    this.options.oss = Object.assign({
      internal: false,
      secure: false,
      endpoint: null,
      cname: false,
      timeout: 60000
    }, this.options.oss);

    this.options.oss.timeout = this.options.oss.timeout || 60000;

    this.client = new OSS({
      region: this.options.oss.region,
      accessKeyId: this.options.oss.accessKeyId,
      accessKeySecret: this.options.oss.accessKeySecret,
      bucket: this.options.oss.bucket,
      internal: this.options.oss.internal,
      secure: this.options.oss.secure,
      endpoint: this.options.oss.endpoint,
      cname: this.options.oss.cname,
      timeout: this.options.oss.timeout
    });
  }

  uploader(remotePath, localFile) {
    let _this = this;
    return new Promise((resolve, reject) => {
      try {
        _this.client.put(remotePath, localFile).then(res => {
          resolve(Utils.responeCdn(res.url, res));
        }).catch(err => {
          reject(err);
        });
      } catch (e) {
        reject(e)
      }
    });
  }

}
