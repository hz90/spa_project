//localStorage 在同源的所有标签页和窗口之间共享数据  浏览器重启后数据仍然保留
//sessionStorage 在当前浏览器标签页中可见，包括同源的 iframe 页面刷新后数据仍然保留（但标签页关闭后数据则不再保留）
// setItem(key, value) —— 存储键/值对。
// getItem(key) —— 按照键获取值。
// removeItem(key) —— 删除键及其对应的值。
// clear() —— 删除所有数据。
// key(index) —— 获取该索引下的键名。
// length —— 存储的内容的长度。
// 使用 Object.keys 来获取所有的键。
// 我们将键作为对象属性来访问，在这种情况下，不会触发 storage 事件。
const public_Key = 'public_key';
export default {
  getPublicKey(): string {
    const token = localStorage.getItem(public_Key);
    if (token) {
      return token;
    } else {
      return '';
    }
  },
  setPublicKey(token: string): void {
    return localStorage.setItem(public_Key, token);
  },
  removePublicKey(): void {
    return localStorage.removeItem(public_Key);
  },
  clear(): void {
    return localStorage.clear();
  },
};
