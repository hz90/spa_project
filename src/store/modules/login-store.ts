import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import { loginStoreVo } from '../vo/login-store-vo';
import ApiService from '@/api/serviceBase';
// 参数一：module名称，开启命名空间后会以name为命名空间
// 参数二：是否使用动态加载，简而言之只有在用到当前的module才会加载，详细可以看vuex官网。本篇博客必须选择true，
//        这也是为什么index.ts一直不用修改的原因，如果设置为false会有很大的变动，如果您真的需要这么做，可以自己研究一下，
//        或者私信我。
// 参数三：是否开启命名空间，如果你的模块很多，强烈建议开启
// 参数四：挂载的store目标
/**
 * 登录
 * @author hai
 */
@Module({
  name: 'loginStore',
  dynamic: true,
  namespaced: true,
  store,
})
class loginStore extends VuexModule {
  public name = '';

  /**
   *
   * @param name
   */
  @Action({ rawError: true })
  public async executeLoginApi(loginStoreVo: loginStoreVo): Promise<void> {
    const response = await ApiService.Post('/login', loginStoreVo);
    console.log(response);
  }

  /**
   *
   * @param name
   */
  @Mutation
  private setTokenToStore(name: string) {
    this.name = name;
  }

  public get getName(): string {
    return this.name;
  }
}
export const loginModule = getModule(loginStore);
