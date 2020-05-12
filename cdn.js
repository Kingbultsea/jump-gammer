var qiniu = require("qiniu");
var glob= require("glob")
const key=''
const secret=''
console.log(
  qiniu.zone
)
class SiguoyaQiniu{
    constructor(ACCESS_KEY,SECRET_KEY,bucket){
        this.bucket=bucket
        this.initAuth(ACCESS_KEY,SECRET_KEY)
        this.initConfig()
        this.initFormUploader()
        this.initBucketManager()
    }

    initAuth(ACCESS_KEY,SECRET_KEY){
        this.mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
    }

    initConfig(){
        this.config = new qiniu.conf.Config();
        this.config.zone = qiniu.zone.Zone_z0
    }

    initFormUploader(){
        this.formUploader = new qiniu.form_up.FormUploader(this.config);
    }

    initBucketManager(){
        this.bucketManager=new qiniu.rs.BucketManager(this.mac, this.config);
    }

    getToken(key){
        var scope=this.bucket
        if(key){
            scope=this.bucket+':'+key
        }
        var options={
            scope,
            returnBody:'{"key":$(key),"ext":$(ext),"filename": $(fname), "filesize": $(fsize), "fileinfo" : $(imageInfo),"bucket":$(bucket),"etag":$(etag),"avinfo":$(avinfo)}'

        }
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var token = putPolicy.uploadToken(this.mac);
        return token;
    }

    ifExistFile(key,callback){
        this.bucketManager.stat(this.bucket, key, function(err, respBody, respInfo) {
            if (err) {
                console.log(err);
            } else {
                if (respInfo.statusCode == 200) {
                    console.log('文件已存在：',key);
                    return ;
                } else if(respInfo.statusCode==612){
                    callback();
                }else {
                    console.log(key,respBody)
                    return;
                }
            }
        });
    }

    uploadFile(localFile,key=''){
        this.ifExistFile(key,this.uploadNewFile.bind(this,localFile,key))
    }

    uploadNewFile(localFile,key){
        var extra = new qiniu.form_up.PutExtra();
        var uptoken=this.getToken(key);
        this.formUploader.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                console.log('上传成功:',ret['key']);
            } else {
                console.log('上传失败:',err);
            }
        });
    }
}

var sq=new SiguoyaQiniu(key,secret,'webres')

glob("dist/**/*", {nodir:true}, function (er, files) {
    if(!er){
        var file_list=files;
        file_list.forEach(function (value) {
            sq.uploadFile(value,'sgy/'+value)
        });
    }else {
        console.log(er);
    }
});
