import Promise from 'promise';
import Qiniu from 'qiniu';
import Utils from '../../utils'

export default class QiniuDriver {

  constructor(options) {
    this.options = options;
    this.mac = new Qiniu.auth.digest.Mac(options.qiniu.accessKey, options.qiniu.secretKey);

    let config = new Qiniu.conf.Config();
    if (options.qiniu.config) {
      config = Object.assign(options.qiniu.config, config);
    }

    this.formUploader = new Qiniu.form_up.FormUploader(config);
    this.putExtra = new Qiniu.form_up.PutExtra();
  }

  uploader(remotePath, localFile) {
    let _this = this;

    let putPolicy = new Qiniu.rs.PutPolicy({
      scope: this.options.qiniu.bucket + ":" + remotePath
    });

    let uploadToken = putPolicy.uploadToken(this.mac);

    return new Promise((resolve, reject) => {
      _this.formUploader.putFile(uploadToken, remotePath, localFile, _this.putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr)
        }

        let url = _this.options.qiniu.domain + '/' + respBody.key;

        resolve(Utils.responeCdn(url, [respBody, respInfo]));
      });
    });
  }

}
