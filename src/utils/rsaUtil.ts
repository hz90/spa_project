import JsEncrypt from 'jsencrypt';
/* eslint-disable */
export default class rsaUtil {
  //RSA 位数，这里要跟后端对应
  private static bits = '1024';
  //当前JSEncrypted对象
  private static thisKeyPair = rsaUtil.genKeyPair();
  //前台公钥
  public static getFpublicKey(): string {
    return rsaUtil.thisKeyPair.publicKey;
  }
  //前台私钥
  public static getFprivateKey(): string {
    return rsaUtil.thisKeyPair.privateKey;
  }
  //生成密钥对(公钥和私钥)
  private static genKeyPair(): any {
    const genKeyPair = { privateKey: '', publicKey: '' };
    const jsEncryptObj = new JsEncrypt({ default_key_size: this.bits });

    //获取私钥
    genKeyPair.privateKey = jsEncryptObj.getPrivateKey();

    //获取公钥
    genKeyPair.publicKey = jsEncryptObj.getPublicKeyB64();
    console.log('前台公钥'+genKeyPair.publicKey)
    console.log('前台私钥'+ genKeyPair.privateKey)
    return genKeyPair;
  }
  /**
   * RSA加密算法，
   * 使用服务器的公钥加密
   * @param {*} pas
   * @returns
   */
  public static RSAencrypt(pas: any, publickey: string): any {
    const jse = new JsEncrypt();
    jse.setPublicKey(publickey);
    return jse.encrypt(pas);
  }
  //私钥解密
  //使用自己生成的私钥解密
  public static decrypt(ciphertext: any, privateKey: string): string {
    let jse = new JsEncrypt();
    jse.setPrivateKey(privateKey);
    let decString = '';
    let decStringtmp=jse.decrypt(ciphertext);
    if(decStringtmp)
   
    if (decStringtmp.charAt(0) === '{' || decStringtmp.charAt(0) === '[') {
      //JSON.parse
      decString = JSON.parse(decStringtmp);
    }else{
      decString=decStringtmp;
    }
    return decString;
  }
}
