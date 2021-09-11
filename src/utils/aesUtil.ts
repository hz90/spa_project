import CryptoJS from 'crypto-js';

export default class aesUtil {
  //获取key，
  private genKey(length = 16): string {
    const random =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
      str = str + random.charAt(Math.random() * random.length);
    }
    return str;
  }
  //加密
  public encrypt(plaintext: any, key: any): string {
    if (plaintext instanceof Object) {
      //JSON.stringify
      plaintext = JSON.stringify(plaintext);
    }
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plaintext),
      CryptoJS.enc.Utf8.parse(key),
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    return encrypted.toString();
  }

  //解密
  public decrypt(ciphertext: any, key: any): string {
    const decrypt = CryptoJS.AES.decrypt(
      ciphertext,
      CryptoJS.enc.Utf8.parse(key),
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    let decString = CryptoJS.enc.Utf8.stringify(decrypt).toString();
    if (decString.charAt(0) === '{' || decString.charAt(0) === '[') {
      //JSON.parse
      decString = JSON.parse(decString);
    }
    return decString;
  }
}
