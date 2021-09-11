import JsEncrypt from 'jsencrypt';
export default class rsaUtil {
  /**
   * RSA加密算法
   * @param {*} pas
   * @returns
   */
  public RSAencrypt(pas: any, publickey: string): any {
    const jse = new JsEncrypt();
    jse.setPublicKey(publickey);
    return jse.encrypt(pas);
  }
}
