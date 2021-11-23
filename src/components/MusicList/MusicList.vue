<template lang="html">
  <transition name="showRouter">
    <div v-if="isLoading" class="loading">
      <i class="icon-loading"></i>
    </div>
    <div v-else class="music-list">
      <div
        v-for="(item, index) of songStoreVos"
        :key="index"
        class="music-item"
      >
        <div v-if="isMobile">
          <img v-bind:src="item.psrc" class="music-img" />
          <span class="music-name">{{
            index + 1 + '.&nbsp; ' + item.name
          }}</span>
          <span>
            <button @touchstart="toggleMusic(index)" class="download2">
              点击播放
            </button></span
          >
        </div>
        <div v-else>
          <img v-bind:src="item.psrc" class="music-img" />
          <span class="music-name">{{
            index + 1 + '.&nbsp; ' + item.name
          }}</span>
          <span>
            <button @click="toggleMusic(index)" class="download2">
              点击播放
            </button></span
          >
        </div>
        <span v-on:click="del(index)" class="del-icon"></span>
      </div>

      <div class="tips">没有更多歌曲了～</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { myClollectSongStoreModule } from '@/store/modules/my-collect-song-store';
import { SongStoreVo } from '@/store/vo/music-song-vo';

import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon, Audio } from '@/store/vo/app-common';
import { songDetailStoreModule } from '@/store/modules/song-detail-store';
import {
  SongDetailStoreVo,
  SongDetailRequestVo,
} from '@/store/vo/music-song-detail-vo';
const baseUrl = process.env.VUE_APP_BASE_API;
@Component({
  name: 'MusicList',
  components: {},
})
export default class MusicList extends Vue {
  private baseUrl: string = baseUrl;
  private songStoreVos: SongStoreVo[] =
    myClollectSongStoreModule.getMyCollectSongs;
  private isLoading = false;
  private beforeCreate() {
    // this.$store.commit('showMiniMusic', true);
  }

  private async beforeMount() {
    // if (!appCommonStoreModule.getAppCommon) {
    // this.initAppCommon();
    // }
    // console.log('execute MusicList');
    // await myClollectSongStoreModule.exeGetMySongsApi();
    // this.songStoreVos = myClollectSongStoreModule.getMyCollectSongs;
  }

  private async mounted() {
    // if (!appCommonStoreModule.getAppCommon) {
    // this.initAppCommon();
    // }
    // console.log('execute MusicList');
    // await myClollectSongStoreModule.exeGetMySongsApi();
    this.songStoreVos = myClollectSongStoreModule.getMyCollectSongs;
  }
  // 点击切换音乐
  private async toggleMusic(index: number): Promise<void> {
    this.isLoading = true;
    if (this.songStoreVos[index]) {
      let songStoreVo: SongStoreVo = this.songStoreVos[index];
      //点击相同的音乐直接返回
      let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
      // if (
      //   appCommonStoreModule.getAppCommon.audioCommon.src === songStoreVo.tmpsrc
      // ) {
      //   console.log(
      //     '点击相同的音乐' + JSON.stringify(this.songStoreVos[index])
      //   );
      //   this.isLoading = false;
      //   // if (!appCommon.isPlaying) {
      //   //   appCommon.isPlaying = true;
      //   //   appCommonStoreModule.setAppCommon(appCommon);
      //   // }
      //   return;
      // }
      // console.log('点击切换音乐' + JSON.stringify(this.songStoreVos[index]));
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
    //Auto play music effect, solve the problem of browser or app auto play
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
  // 删除音乐
  private del(index: number): void {
    if (this.songStoreVos[index]) {
      let songStoreVo: SongStoreVo = this.songStoreVos[index];
      myClollectSongStoreModule.exeDelSongfromMyCollectApi(songStoreVo);
      this.songStoreVos = myClollectSongStoreModule.getMyCollectSongs;
    }
  }

  private isMobile(): boolean {
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isiOS;
  }
}
</script>

<style lang="scss">
.showRouter-enter-active {
  transition: all 0.4s ease;
}
.showRouter-leave-active {
  transition: all 0 ease;
}
.showRouter-enter,
.showRouter-leave-active {
  transform: translateX(-150px);
  opacity: 0;
}
.music-list {
  padding-top: 4px;
  padding-left: 4px;
  padding-right: 4px;
  // padding-bottom: 40px;
  flex: 8;
  overflow: auto;
  .music-item + .music-item {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
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
    span.music-name {
      display: inline-block;
      width: 65%;
      vertical-align: top;
      margin-top: 15px;
      margin-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;

      padding-bottom: 20px;
    }

    span.del-icon {
      display: inline-block;
      position: absolute;
      right: 10px;
      top: 20px;
      width: 20px;
      height: 20px;
      background: url('./del.svg');
      background-size: contain;
      cursor: pointer;
    }
  }
  .tips {
    text-align: center;
    margin: 12px auto;
    width: 200px;
    font-size: 80%;
    color: gray;
  }
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
</style>
