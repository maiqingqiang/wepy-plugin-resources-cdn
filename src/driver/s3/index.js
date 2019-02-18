import Promise from 'promise'
import AWS from 'aws-sdk'
import Utils from '../../utils'
import fs from 'fs'

export default class S3Driver {
  constructor(options) {
    this.options = options
    AWS.config.update({
      region: this.options.s3.region,
      signatureVersion: 'v4',
      accessKeyId: this.options.s3.accessKeyId,
      secretAccessKey: this.options.s3.secretAccessKey
    });
    this.client = new AWS.S3()
  }

  uploader(remotePath, localFile) {
    const _this = this
    const params = {
      Body: fs.createReadStream(localFile),
      Bucket: this.options.s3.bucket,
      Key: remotePath
    }

    return new Promise((resolve, reject) => {
      _this.client.upload(params, function (err, data) {
        if (err) {
          return reject(err)
        }

        if (data) {
          const url = _this.options.s3.domain + '/' + remotePath
          resolve(Utils.responeCdn(url, data))
        }
      })
    })
  }
}
