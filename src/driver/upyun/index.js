import Promise from 'promise';
import Upyun from 'upyun';
import Utils from '../../utils';
import fs from 'fs';

export default class UpyunDriver {

  constructor(options) {
    this.options = options;
    this.options.upyun.options = this.options.upyun.options || {};

    const service = new Upyun.Service(this.options.upyun.service, this.options.upyun.name, this.options.upyun.password)
    this.client = new Upyun.Client(service, this.options.options);

  }

  uploader(remotePath, localFile) {
    let _this = this;
    return new Promise((resolve, reject) => {

      _this.client.putFile(remotePath, fs.createReadStream(localFile)).then(res => {
        let url = _this.options.upyun.domain + '/' + remotePath;
        resolve(Utils.responeCdn(url, res));
      }).catch(e => {
        reject(e);
      });
    });
  }

}
