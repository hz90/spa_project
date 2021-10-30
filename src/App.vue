<template>
  <div id="app">
    <!-- 主界面部分 -->
    <transition name="show">
      <div v-show="isShowIndex()" class="index">
        <!-- 侧边栏 -->
        <AsideMenu v-show="isShowAsideMenu()"></AsideMenu>

        <!-- 头部 -->
        <MusicHeader></MusicHeader>

        <!-- router控制的Tab页内容 -->
        <router-view></router-view>

        <!-- 尾部mini播放器 -->
        <Footer
          :is-playing="isPlayingCommon"
          :total-time="totalTime"
          :now.sync="now"
          :audio-common="audioCommon"
          :audio-duration="audioDuration"
          @fatherMethod="play()"
          @fatherMethodChangeTime="changeTime"
          @fatherMethodTouchMove="touchMove"
          @fatherMethodTouchEnd="touchEnd"
        ></Footer>
      </div>
    </transition>

    <!-- 播放界面 -->
    <transition name="showIndex">
      <Play v-show="!isShowIndex()"></Play>
    </transition>

    <!-- 隐藏的audio标签 -->
    <!--（1）属性：controls，preload（2）事件：canplay，timeupdate，ended（3）方法：play()，pause() -->
    <!--controls：向用户显示音频控件（播放/暂停/进度条/音量）-->
    <!--preload：属性规定是否在页面加载后载入音频-->
    <!--canplay：当音频/视频处于加载过程中时，会发生的事件-->
    <!--timeupdate：当目前的播放位置已更改时-->
    <!--ended：当目前的播放列表已结束时-->
    <!-- <audio v-bind:src="msrc" v-bind:autoplay="isPlaying" ref="audio"></audio> -->

    <audio :src="msrc" v-bind:autoplay="isPlaying" preload="true" ref="audio">
      <!--（1）属性：controls，preload（2）事件：canplay，timeupdate，ended（3）方法：play()，pause() -->
      <!--controls：向用户显示音频控件（播放/暂停/进度条/音量）-->
      <!--preload：属性规定是否在页面加载后载入音频-->
      <!--canplay：当音频/视频处于加载过程中时，会发生的事件-->
      <!--timeupdate：当目前的播放位置已更改时-->
      <!--ended：当目前的播放列表已结束时-->
    </audio>

    <!-- 关于界面 -->
    <AboutVue v-if="isShowAbout()"></AboutVue>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
import MusicHeader from '@/components/Header/MusicHeader.vue';
import Footer from '@/components/Footer/Footer.vue';
import AsideMenu from '@/components/AsideMenu/AsideMenu.vue';
import Play from '@/components/Play/Play.vue';
import AboutVue from '@/components/About/AboutVue.vue';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon, Audio } from '@/store/vo/app-common';
// import { AppCommon } from '@/store/vo/app-common';
import { songDetailStoreModule } from '@/store/modules/song-detail-store';
import {
  SongDetailStoreVo,
  SongDetailRequestVo,
} from '@/store/vo/music-song-detail-vo';
import { SongStoreVo } from '@/store/vo/music-song-vo';
@Component({
  name: 'App',
  components: { MusicHeader, Footer, AsideMenu, Play, AboutVue },
})
export default class App extends Vue {
  // private isPlayingCommon = appCommonStoreModule.getAppCommon.isPlaying;
  private now = 0;
  private msrc = appCommonStoreModule.getAppCommon.audioCommon.src;
  private audioCommon = appCommonStoreModule.getAppCommon.audioCommon;
  private totalTime = '0.00';
  private audioDuration = 0;
  private showAsideMenu = appCommonStoreModule.getAppCommon.isShowAsideMenu;

  @Ref('audio')
  private readonly audioRef!: HTMLAudioElement;
  private localAudio!: HTMLAudioElement;
  private beforeCreate() {
    console.log('app commponent is init');
    console.log('app commponent is init initAppCommon');
    console.log(appCommonStoreModule.getAppCommon);

    let appCommon: AppCommon = Object.create(null) as AppCommon;
    appCommon.isShowAsideMenu = false; //显示侧边栏
    appCommon.isShowMiniMusic = true; //
    appCommon.isShowAbout = false; //显示关于界面
    appCommon.isPlaying = false; //显示bofang
    let audioCommon: Audio = Object.create(null) as Audio;
    audioCommon.src = 'http://localhost:8081/song/001.mp3';
    // let songStoreVo: SongStoreVo = {
    //   name: '夜曲',
    //   msrc: '6Q0Pd53mojY',
    //   psrc: '',
    // };
    // let musicDetail = App.getMusicDetail(songStoreVo);

    // audioCommon.src = musicDetail;

    audioCommon.name = 'test';
    audioCommon.musicImgSrc =
      'https://i.ytimg.com/vi/6Q0Pd53mojY/hqdefault.jpg';
    audioCommon.index = 0;
    appCommon.audioCommon = audioCommon;
    if (appCommonStoreModule.getAppCommon.localAudio) {
      appCommon.localAudio = appCommonStoreModule.getAppCommon.localAudio;
    }
    appCommonStoreModule.setAppCommon(appCommon);

    console.log('app commponent is init createAudio' + this.audioRef);
    appCommon = appCommonStoreModule.getAppCommon;
    appCommon.localAudio = this.audioRef;
    if (!appCommon.localAudio) {
      appCommon.localAudio = this.audioRef;
    }
    appCommonStoreModule.setAppCommon(appCommon);
    console.log(
      '----app init---' + JSON.stringify(appCommonStoreModule.getAppCommon)
    );
  }

  private get isPlayingCommon() {
    return appCommonStoreModule.getAppCommon.isPlaying;
  }

  private get getAudioready(): boolean {
    if (this.msrc) {
      return true;
    } else {
      return false;
    }
  }
  private mounted() {
    console.log('mounted this.audioRef=' + this.audioRef);
    this.audioRef.src = appCommonStoreModule.getAppCommon.audioCommon.src;
    //this.audioRef.load();
    this.audioRef.addEventListener('play', () => {
      this.totalTime = this.transformTime(this.audioRef.duration);
      this.now = this.audioRef.currentTime;
      setInterval(() => {
        this.now = this.audioRef.currentTime;
      }, 1000);
    });
    this.audioRef.addEventListener('canplay', (event) => {
      console.log(
        'Video can start, but not sure it will play through.' + event
      );
      this.totalTime = this.transformTime(this.audioRef.duration);
      setInterval(() => {
        this.now = this.audioRef.currentTime;
      }, 1000);
      this.audioDuration = this.audioRef.duration;
      this.localAudio = this.audioRef;
      let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
      appCommon.localAudio = this.audioRef;
      // appCommon.isPlaying = false;
      appCommonStoreModule.setAppCommon(appCommon);
    });
  }

  private isShowAsideMenu(): boolean {
    if (appCommonStoreModule.getAppCommon.isShowAsideMenu) {
      return appCommonStoreModule.getAppCommon.isShowAsideMenu;
    } else {
      return false;
    }
  }
  public play(): void {
    console.log('fatcher method is called');
    let playing = this.isPlayingCommon;
    let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
    playing = !playing;
    appCommon.isPlaying = playing;
    appCommonStoreModule.setAppCommon(appCommon);
    !playing ? this.audioRef.pause() : this.audioRef.play();
  }
  // eslint-disable-next-line
  private changeTime(event: any, progressBarRef: any): void {
    console.log('changeTime');
    let progressBar = progressBarRef;
    let coordStart = progressBar.getBoundingClientRect().left;
    let coordEnd = event.pageX;
    this.audioRef.currentTime =
      ((coordEnd - coordStart) / progressBar.offsetWidth) *
      this.audioRef.duration;
    this.now = this.audioRef.currentTime;
    this.audioRef.play();
  }
  // eslint-disable-next-line
  private touchMove(event: any, progressBarRef: any, nowRef: any): void {
    console.log('touchMove');
    let progressBar = progressBarRef;
    let coordStart = progressBar.getBoundingClientRect().left;
    let coordEnd = event.touches[0].pageX;
    let nowstyle = nowRef;
    if (nowstyle) {
      if (nowstyle.style) {
        nowstyle.style.width =
          ((coordEnd - coordStart) / progressBar.offsetWidth.toFixed(3)) * 100 +
          '%';
      }
    }
  }
  // eslint-disable-next-line
  private touchEnd(event: any, progressBarRef: any): void {
    console.log('touchEnd');
    let nowstyle = progressBarRef;
    if (nowstyle) {
      this.audioRef.currentTime =
        (nowstyle.style.width.replace('%', '') / 100) * this.audioRef.duration;
    }
    this.now = this.audioRef.currentTime;
    this.audioRef.play();
  }
  private isPlaying(): boolean {
    return true;
  }
  private isShowIndex(): boolean {
    return true;
  }
  private isShowAbout(): boolean {
    if (appCommonStoreModule.getAppCommon.isShowAbout) {
      return appCommonStoreModule.getAppCommon.isShowAbout;
    } else {
      return false;
    }
  }
  private transformTime(seconds: number): string {
    let m: number = Math.floor(seconds / 60);
    let m1 = m.toString().length == 1 ? '0' + m : m;
    let s = Math.floor(seconds - 60 * Number(m1));
    let s1 = s.toString().length == 1 ? '0' + s : s;
    return m + ':' + s1;
  }
  private static getMusicDetail(songStoreVos: SongStoreVo): string {
    let songDetailRequestVo: SongDetailRequestVo = Object.create(
      null
    ) as SongDetailRequestVo;
    songDetailRequestVo = Object.assign(songDetailRequestVo, songStoreVos);
    let songDetailRequestVos: SongDetailRequestVo[] = [];
    songDetailRequestVos.push(songDetailRequestVo);
    songDetailStoreModule.exeGetSongsDetailApi(songDetailRequestVos);
    let songDetailStoreVo: SongDetailStoreVo[] =
      songDetailStoreModule.getSongsDetail;
    if (songDetailStoreVo && songDetailStoreVo.length > 0) {
      return songDetailStoreVo[0].msrc;
    } else {
      return '';
    }
  }
}
</script>
<style lang="scss">
@import './common/style/base.scss';

.showIndex-enter-active {
  transition: all 0.4s ease-out;
}
.showIndex-leave-active {
  transition: all 0 ease;
}
.showIndex-enter,
.showIndex-leave-active {
  transform: translateY(350px);
  opacity: 0;
}
.show-enter-active {
  transition: all 0.4s ease;
}
.show-leave-active {
  transition: all 0 ease-out;
}
.show-enter,
.show-leave-active {
  transform: translateX(-350px);
  opacity: 0;
}

.down-enter-active {
  transition: all 0.2s ease-in-out;
}
.down-leave-active {
  transition: all 0.4s ease-in-out;
}
.down-enter,
.down-leave-active {
  transform: translateY(-250px);
  opacity: 0;
}

#app,
.index {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  div.search-page {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    z-index: 1;
    // background-color: rgba(0, 0, 0, .5);

    .search-input {
      position: relative;
      flex: 1.1;
      width: 100%;
      background-color: white;
      border: none;
      input {
        width: 90%;
        height: 100%;
        padding: 0 55px 0 30px;
        outline: none;
        border: none;
        font-size: 1.2rem;
      }
      i.icon-search {
        position: absolute;
        top: 9px;
        right: 55px;
        display: inline-block;
        width: 25px;
        height: 25px;
        background: url('./assets/search.svg') no-repeat;
        background-size: contain;
      }
      span {
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 23px;
        height: 23px;
        background: url('./assets/close.svg') no-repeat;
        background-size: contain;
      }
    }
    .mask {
      flex: 15;
    }
  }
}
</style>
