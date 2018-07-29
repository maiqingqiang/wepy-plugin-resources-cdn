import COS from 'cos-nodejs-sdk-v5';
import Promise from 'promise';
import Utils from '../../utils';
import fs from 'fs';

export default class CosDriver {

  constructor(options) {
    this.options = options;

    this.client = new COS({
      SecretId: this.options.cos.secretId,
      SecretKey: this.options.cos.secretKey,
    });
  }

  uploader(remotePath, localFile) {
    let _this = this;
    return new Promise((resolve, reject) => {
      try {
        let bucket = _this.options.cos.bucket + '-' + _this.options.cos.appId;
        this.client.putObject({
          Bucket: bucket,
          Region: _this.options.cos.region,
          Key: remotePath,
          Body: fs.createReadStream(localFile),
          ContentLength: fs.statSync(localFile).size
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            let url = `${_this.options.cos.https ? 'https' : 'http'}://${data.Location}`;
            resolve(Utils.responeCdn(url, data));
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

}
