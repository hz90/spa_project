<template lang="html">
  <transition name="showRouter">
    <div class="find">
      <div class="search-input">
        <div class="input">
          <i class="icon-search"></i>
          <input
            v-model="keywords"
            @keyup.enter="toSearch(keywords)"
            @focus="inputFocus"
            v-bind:class="{ 'input-focus': !isShowHot }"
            type="text"
            placeholder="搜索歌曲"
          />
          <i
            @click="keywords = ''"
            v-show="keywords !== '' && !isShowHot"
            class="icon-cancel"
          ></i>
          <div v-show="!isShowHot" @click="isShowHot = true" class="cancel-btn">
            取消
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="loading">
        <i class="icon-loading"></i>
      </div>
      <div v-else>
        <!-- 热门搜索 -->
        <div v-if="songStoreVos.length < 0" class="hot">
          热门搜索
          <div class="keywords">
            <!-- <div
            v-for="item of hotKeywords"
            v-text="item"
            @click="toSearch(item)"
            class="keyword"
          ></div> -->
          </div>
        </div>
        <!-- @touchmove="$store.commit('showMiniMusic', false)" -->
        <div v-else class="search-list d-flex">
          <div
            v-for="(item, index) of songStoreVos"
            :key="index"
            class="music-item"
          >
            <div @click="toggleMusic(index)">
              <img v-bind:src="item.psrc" class="music-img" />
              <span class="music-name">{{
                index + 1 + '.&nbsp; ' + item.name
              }}</span>
            </div>
            <div v-if="existsMysongs(index)">
              <button
                @click="deal2MyCollection(index, 'add')"
                class="download2"
              >
                加入收藏
              </button>
            </div>
            <div v-else>
              <button @click="deal2MyCollection(index, 'del')" class="download">
                取消收藏
              </button>
            </div>
          </div>

          <div
            v-show="isShowHistory && searchHistory.length"
            @click="searchHistory = []"
            class="tips"
          >
            清除搜索记录
          </div>

          <!-- <div v-if="isLoading" class="loading">
          <i class="icon-loading"></i>搜索中...
        </div> -->
          <div v-show="songStoreVos.length" class="tips">没有更多结果了～</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { songStoreModule } from '@/store/modules/song-store';
import { SongStoreVo, SongRequestVo } from '@/store/vo/music-song-vo';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon, Audio } from '@/store/vo/app-common';
import { songDetailStoreModule } from '@/store/modules/song-detail-store';
import { myClollectSongStoreModule } from '@/store/modules/my-collect-song-store';
import {
  SongDetailStoreVo,
  SongDetailRequestVo,
} from '@/store/vo/music-song-detail-vo';
const baseUrl = process.env.VUE_APP_BASE_API;
@Component({
  name: 'Find',
  components: {},
})
export default class Find extends Vue {
  private baseUrl: string = baseUrl;
  private songStoreVos: SongStoreVo[] = songStoreModule.getSongs;
  private myCollectionSongs: SongStoreVo[] =
    myClollectSongStoreModule.getMyCollectSongs;
  private beforeCreate() {
    // this.$store.commit('showMiniMusic', true);
  }
  private created() {
    // this.axios.get('/api/hot').then((res) => {
    //   this.hotKeywords = res.data;
    // });
  }
  private mounted() {
    //初始化清空前一次搜索
    // this.songStoreVos = [];
  }

  private keywords = '';
  private hotKeywords = [];
  private isShowHot = true;
  private musicList = [];
  private playIndex = '';
  private isLoading = false;
  private isShowHistory = false;
  private searchHistory =
    (localStorage.searchHistory && JSON.parse(localStorage.searchHistory)) ||
    [];

  private async toSearch(keywords: string): Promise<void> {
    if (keywords.trim()) {
      this.songStoreVos = [];
      this.isShowHistory = false;
      this.isShowHot = false;
      this.playIndex = '';
      this.isLoading = true;
      this.keywords = keywords;
      this.songStoreVos = [];
      let songRequestVo: SongRequestVo = {
        name: keywords,
      };
      await songStoreModule.exeGetSongsApi(songRequestVo);
      this.songStoreVos = songStoreModule.getSongs;
      this.isLoading = false;
    }
  }

  // 点击切换音乐
  private async toggleMusic(index: number): Promise<void> {
    this.isLoading = true;
    if (this.songStoreVos[index]) {
      let songStoreVo: SongStoreVo = this.songStoreVos[index];
      //点击相同的音乐直接返回
      let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
      if (
        appCommonStoreModule.getAppCommon.audioCommon.src === songStoreVo.tmpsrc
      ) {
        console.log(
          '点击相同的音乐' + JSON.stringify(this.songStoreVos[index])
        );
        this.isLoading = false;
        // if (!appCommon.isPlaying) {
        //   appCommon.isPlaying = true;
        //   appCommonStoreModule.setAppCommon(appCommon);
        // }
        return;
      }
      console.log('点击切换音乐' + JSON.stringify(this.songStoreVos[index]));
      let audioCommon: Audio = appCommonStoreModule.getAppCommon.audioCommon;

      //获取音乐详细信息
      this.songStoreVos[index].tmpsrc = await this.getMusicDetail(
        this.songStoreVos[index]
      );

      if (songStoreVo.tmpsrc.indexOf('https') > -1) {
        console.log('cloud music');
        audioCommon.src = songStoreVo.tmpsrc;
      } else {
        audioCommon.src = 'http://localhost:8081' + songStoreVo.tmpsrc;
      }
      audioCommon.name = songStoreVo.name;
      if (songStoreVo.psrc.indexOf('https') > -1) {
        console.log('cloud music');
        audioCommon.musicImgSrc = songStoreVo.psrc;
      } else {
        audioCommon.musicImgSrc = 'http://127.0.0.1:8081' + songStoreVo.psrc;
      }
      audioCommon.index = 0;
      appCommon.audioCommon = audioCommon;
      appCommon.isPlaying = true;
      appCommonStoreModule.setAppCommon(appCommon);
      this.playVideo(appCommon);
    }
  }
  private playVideo(appCommon: AppCommon): void {
    console.log('appCommon.localAudio' + appCommon.localAudio);
    appCommon.localAudio.src =
      appCommonStoreModule.getAppCommon.audioCommon.src;
    appCommon.localAudio.load();
    // this.nativeAudio.canplay=true;
    //this.totalTime = this.transformTime(this.nativeAudio.duration);
    let promise = appCommon.localAudio.play();
    //解决Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
    if (promise !== undefined) {
      promise
        .then(() => {
          // Autoplay started
          console.log('Autoplay started music find');
        })
        // eslint-disable-next-line
        .catch((error: any) => {
          console.log(error);
          // Autoplay was prevented.
          //this.nativeAudio.muted = true;
          // this.nativeAudio.play();
        });
    }
    this.isLoading = false;
  }

  private async getMusicDetail(songStoreVos: SongStoreVo): Promise<string> {
    let songDetailRequestVo: SongDetailRequestVo = Object.create(
      null
    ) as SongDetailRequestVo;
    songDetailRequestVo = Object.assign(songDetailRequestVo, songStoreVos);
    let songDetailRequestVos: SongDetailRequestVo[] = [];
    songDetailRequestVos.push(songDetailRequestVo);
    await songDetailStoreModule.exeGetSongsDetailApi(songDetailRequestVos);
    let songDetailStoreVo: SongDetailStoreVo[] =
      songDetailStoreModule.getSongsDetail;
    if (songDetailStoreVo && songDetailStoreVo.length > 0) {
      return songDetailStoreVo[0].tmpsrc;
    } else {
      return '';
    }
  }

  private inputFocus() {
    if (this.keywords.trim()) {
      return;
    } else {
      this.isShowHot = false;
      this.isShowHistory = true;
      this.musicList = [];
    }
  }

  private deal2MyCollection(index: number, deal: string): void {
    if (this.songStoreVos[index]) {
      let songStoreVo: SongStoreVo = this.songStoreVos[index];
      if (deal === 'add') {
        let allcollections: SongStoreVo[] =
          myClollectSongStoreModule.getMyCollectSongs;
        let exists: SongStoreVo[] = allcollections.filter(
          (x) => x.msrc === songStoreVo.msrc
        );
        if (exists.length > 0) {
          console.log('该歌曲已经添加');
        } else {
          myClollectSongStoreModule.exeAddSong2MyCollectApi(songStoreVo);
        }
      }
      if (deal === 'del') {
        let allcollections: SongStoreVo[] =
          myClollectSongStoreModule.getMyCollectSongs;
        let exists: SongStoreVo[] = allcollections.filter(
          (x) => x.msrc === songStoreVo.msrc
        );
        if (exists.length > 0) {
          myClollectSongStoreModule.exeDelSongfromMyCollectApi(songStoreVo);
        } else {
          console.log('该歌曲已经被取消收藏');
        }
      }
    }
  }

  private existsMysongs(index: number): boolean {
    if (this.songStoreVos[index]) {
      let songStoreVo: SongStoreVo = this.songStoreVos[index];
      let allcollections: SongStoreVo[] =
        myClollectSongStoreModule.getMyCollectSongs;
      let exists: SongStoreVo[] = allcollections.filter(
        (x) => x.msrc === songStoreVo.msrc
      );
      return exists.length <= 0;
    } else {
      return true;
    }
  }

  // 解码
  // private strDecode(str: any): any {
  //   return str.replace(
  //     /&#(x)?([^&]{1,5});?/g,
  //     function ($: any, $1: any, $2: any) {
  //       return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
  //     }
  //   );
  // }
}
</script>

<style lang="scss" scoped>
.showRouter-enter-active {
  transition: all 0.3s ease;
}
.showRouter-leave-active {
  transition: all 0 ease-out;
}
.showRouter-enter,
.showRouter-leave-active {
  transform: translateX(250px);
  opacity: 0;
}
.find {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 10;
  overflow: auto;

  .search-input {
    position: relative;
    background-color: rgba(0, 0, 0, 0.1);
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .input {
      position: relative;
      width: 90%;
      height: 35px;
      margin: 20px auto;
      text-align: left;
      i.icon-search {
        position: absolute;
        top: 7px;
        left: 6px;
        display: inline-block;
        height: 20px;
        width: 20px;
        background: url('./find.svg') no-repeat;
        background-size: contain;
      }
      input {
        border-radius: 3px;
        border: none;
        padding: 0 34px;
        width: 100%;
        height: 100%;
        font-size: 1rem;
        outline: none;
      }
      i.icon-cancel {
        position: absolute;
        top: 7px;
        right: 21%;
        display: inline-block;
        height: 20px;
        width: 20px;
        background: url('./cancel.svg') no-repeat;
        background-size: contain;
      }
      .input-focus {
        width: 80%;
      }
      .cancel-btn {
        vertical-align: top;
        padding: 7px 10px;
        height: 100%;
        background-color: none;
        display: inline-block;
      }
    }
  }

  .hot {
    flex: 8;
    padding: 10px;
    .keywords {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      padding-left: 16px;
      .keyword:hover {
        border: 1px solid orange;
      }
      div {
        text-align: center;
        width: 25%;
        padding: 5px;
        border: 1px solid gray;
        margin-right: 8%;
        margin-bottom: 10px;
        border-radius: 20px;
        cursor: pointer;
      }
      div:nth-of-type(1) {
        border-color: red;
        box-shadow: none;
        color: red;
      }
    }
  }
  .search-list {
    flex: 9;
    overflow: auto;
    .history + .history {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    .history {
      display: flex;
      width: 100%;
      height: 50px;
      justify-content: center;
      align-items: center;

      .icon {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .icon-history {
        display: inline-block;
        width: 23px;
        height: 23px;
        background: url('./history.svg') no-repeat;
        background-size: contain;
      }
      .icon-del {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('./del.svg') no-repeat;
        background-size: contain;
      }
      .word {
        flex: 5;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .tips {
      text-align: center;
      margin: 12px auto;
      width: 200px;
      font-size: 80%;
      color: gray;
    }
    .loading {
      padding-top: 10px;
      text-align: center;

      .icon-loading {
        display: inline-block;
        margin: auto;
        width: 22px;
        height: 22px;
        background: url('./loading.svg') no-repeat;
        background-size: contain;
        animation: loading 0.6s linear infinite;
        vertical-align: text-top;
        margin-right: 10px;
      }
    }

    .music + .music {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    .music {
      display: flex;
      width: 100%;
      height: 60px;
      cursor: pointer;
      .icon-music {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 60px;
        height: 60px;
        img {
          display: inline-block;
          width: 90%;
          height: 90%;
          background: url(./music.svg) no-repeat;
          background-size: contain;
        }
      }
      .music-info {
        position: relative;

        flex: 1;
        padding: 8px 10px;
        .music-name {
          width: 250px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .music-singer {
          padding-top: 3px;
          font-size: 50%;
          color: gray;
        }
        i {
          position: absolute;
          display: inline-block;
          width: 13px;
          height: 13px;
        }
        i.icon-listening {
          background: url('./listening.svg') no-repeat;
          background-size: contain;
          right: 20px;
          top: 22px;
          animation: listening 1s linear infinite;
        }
        i.icon-love {
          background: url('./love.svg') no-repeat;
          background-size: contain;
          right: 40px;
          top: 20px;
        }
      }
    }
    .music-item {
      // box-shadow: 0 0 1px #DD2C00;
      padding: 4px 6px 0 6px;
      position: relative;
      margin-bottom: 4px;
      border-radius: 5px;
      cursor: pointer;
      border: none;

      .music-img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }
    }
  }
  .loading {
    flex: 20;
    overflow: auto;
    padding-top: 5px;
    text-align: center;

    .icon-loading {
      display: inline-block;
      margin: auto;
      width: 100px;
      height: 100px;
      background: url('./loading.gif') no-repeat;
      background-size: contain;
      animation: loading 0.6s linear infinite;
      vertical-align: text-top;
      margin-right: 10px;
    }
  }
}
@keyframes listening {
  0% {
    transform: scale(1);
  }
  33% {
    transform: scale(1.3);
  }
  66% {
    transform: scale(1);
  }
}
// @keyframes loading {
//   from {
//     transform: rotate(0);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }
.download2 {
  display: inline-block;
  margin-right: 5px;
  background: #339dff;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  line-height: 20px;
  border-radius: 20px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  width: 70px;
  text-align: center;
}

// .download2:hover {
//   background: #fff;
//   color: #339dff;
//   box-shadow: 0 4px 4px rgba(83, 100, 255, 0.32);
// }
.download {
  display: inline-block;
  text-decoration: none;
  border: 2px solid #d9edff;
  color: #339dff;
  font-size: 13px;
  text-align: center;
  line-height: 20px;
  border-radius: 30px;
  padding: 0 0px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  background: #fff;
  width: 70px;
  margin-right: 40px;
}

// .download:hover {
//   box-shadow: 0 2px 4px rgba(83, 100, 255, 0.45);
// }
</style>
