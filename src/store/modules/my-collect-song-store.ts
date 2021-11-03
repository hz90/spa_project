import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import ApiService from '@/api/serviceBase';
import { SongStoreVo } from '@/store/vo/music-song-vo';
// 参数一：module名称，开启命名空间后会以name为命名空间
// 参数二：是否使用动态加载，简而言之只有在用到当前的module才会加载，详细可以看vuex官网。本篇博客必须选择true，
//        这也是为什么index.ts一直不用修改的原因，如果设置为false会有很大的变动，如果您真的需要这么做，可以自己研究一下，
//        或者私信我。
// 参数三：是否开启命名空间，如果你的模块很多，强烈建议开启
// 参数四：挂载的store目标
/**
 * 返回用户收藏的音乐API
 * @author hai
 */
@Module({
  name: 'myClollectSongStore',
  dynamic: true,
  namespaced: true,
  store,
})
class myClollectSongStore extends VuexModule {
  private songStoreVos: SongStoreVo[] = [];
  /**
   *
   * @param
   */
  @Action({ rawError: true })
  public async exeGetMySongsApi(): Promise<void> {
    const response = await ApiService.Post('/getMycollectSongs', null);
    this.setMySongsStore(response.data);
  }

  /**
   *
   * @param
   */
  @Action({ rawError: true })
  public async exeAddSong2MyCollectApi(
    songStoreVo: SongStoreVo
  ): Promise<void> {
    this.songStoreVos.push(songStoreVo);
    const response = await ApiService.Post(
      '/addSong2Mycollection',
      songStoreVo
    );
    // this.setMySongsStore(response.data);
  }

  /**
   *
   * @param
   */
  @Action({ rawError: true })
  public async exeDelSongfromMyCollectApi(
    songStoreVo: SongStoreVo
  ): Promise<void> {
    const songStoreVoTmp: SongStoreVo[] = this.songStoreVos.filter(
      (x) => x.msrc !== songStoreVo.msrc
    );
    this.setMySongsStore(songStoreVoTmp);
    const response = await ApiService.Post(
      '/delSongFromMycollect',
      songStoreVo
    );
    // this.setMySongsStore(response.data);
  }

  /**
   *
   * @param publickey
   */
  @Mutation
  private setMySongsStore(songStoreVos: SongStoreVo[]): void {
    this.songStoreVos = songStoreVos;
  }

  public get getMyCollectSongs(): SongStoreVo[] {
    return this.songStoreVos;
  }
  /**
   *
   * @param
   */
  @Action({ rawError: true })
  public async clear(): Promise<void> {
    this.clearStore();
  }
  /**
   *
   * @param publickey
   */
  @Mutation
  private clearStore(): void {
    this.songStoreVos = [];
  }
}
export const myClollectSongStoreModule = getModule(myClollectSongStore);
