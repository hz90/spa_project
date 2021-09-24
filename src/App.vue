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
@Component({
  name: 'App',
  components: { MusicHeader, Footer, AsideMenu, Play, AboutVue },
})
/* eslint-disable */
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
    let appCommon: AppCommon = Object.create(null) as AppCommon;
    appCommon.isShowAsideMenu = false; //显示侧边栏
    appCommon.isShowMiniMusic = true; //
    appCommon.isShowAbout = false; //显示关于界面
    appCommon.isPlaying = false; //显示bofang
    let audioCommon: Audio = Object.create(null) as Audio;
    audioCommon.src = 'http://localhost:8081/song/002.mp3';
    audioCommon.name = 'test';
    audioCommon.musicImgSrc = 'http://127.0.0.1:8081/img/songPic/HereIam.jpg';
    audioCommon.index = 0;
    appCommon.audioCommon = audioCommon;
    if (appCommonStoreModule.getAppCommon.localAudio) {
      appCommon.localAudio = appCommonStoreModule.getAppCommon.localAudio;
    }
    appCommonStoreModule.setAppCommon(appCommon);
    // this.audioRef.addEventListener('play', () => {
    //   this.totalTime = this.transformTime(this.audioRef.duration);
    //   this.now = this.audioRef.currentTime;

    //   setInterval(() => {
    //     this.now = this.audioRef.currentTime;
    //   }, 1000);
    // });
    // this.audioRef.addEventListener('canplay', () => {
    //   this.totalTime = this.transformTime(this.audioRef.duration);
    //   this.now = this.audioRef.currentTime;

    //   setInterval(() => {
    //     this.now = this.audioRef.currentTime;
    //   }, 1000);
    // });
    console.log('app commponent is init createAudio' + this.audioRef);
    appCommon = appCommonStoreModule.getAppCommon;
    appCommon.localAudio = this.audioRef;
    if (!appCommon.localAudio) {
      appCommon.localAudio = this.audioRef;
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
  // private get totalTime() {
  //   let totalTime = '0.00';
  //   if (this.audioRef) {
  //     this.audioRef.src = appCommonStoreModule.getAppCommon.audioCommon.src;
  //     this.audioRef.load();
  //     totalTime = this.transformTime(this.audioRef.duration);
  //   }
  //   return totalTime;
  // }
  private mounted() {
    // this.$store.commit('findDOM', { name: 'audio', dom: this.$refs.audio });
    // this.$refs.audio.addEventListener('ended', () => { this.next(); });
    // this.$refs.audio.addEventListener('error', () => { this.next(); });
    // console.log(
    //   '%c Powered by Zhaohui - microzz.com',
    //   'background-image:-webkit-gradient( linear, left top,right top, color-stop(0, #00a419),color-stop(0.15, #f44336), color-stop(0.29, #ff4300),color-stop(0.3, #AA00FF),color-stop(0.4, #8BC34A), color-stop(0.45, #607D8B),color-stop(0.6, #4096EE), color-stop(0.75, #D50000),color-stop(0.9, #4096EE), color-stop(1, #FF1A00));color:transparent;-webkit-background-clip:text;font-size:13px;'
    // );
    console.log('mounted this.audioRef=' + this.audioRef);
    this.audioRef.src = appCommonStoreModule.getAppCommon.audioCommon.src;
    this.audioRef.load();
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
      appCommonStoreModule.setAppCommon(appCommon);
    });
  }
  // private get localAudioTmp() {
  //   return this.localAudio ? this.localAudio : {};
  // }
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
  private changeTime(event: any, progressBarRef: any): void {
    console.log('changeTime');
    let progressBar: any = progressBarRef;
    let coordStart = progressBar.getBoundingClientRect().left;
    let coordEnd = event.pageX;
    this.audioRef.currentTime =
      ((coordEnd - coordStart) / progressBar.offsetWidth) *
      this.audioRef.duration;
    this.now = this.audioRef.currentTime;
    this.audioRef.play();
  }
  private touchMove(event: any, progressBarRef: any, nowRef: any): void {
    console.log('touchMove');
    let progressBar: any = progressBarRef;
    let coordStart: any = progressBar.getBoundingClientRect().left;
    let coordEnd: any = event.touches[0].pageX;
    let nowstyle: any = nowRef;
    if (nowstyle) {
      if (nowstyle.style) {
        nowstyle.style.width =
          ((coordEnd - coordStart) / progressBar.offsetWidth.toFixed(3)) * 100 +
          '%';
      }
    }
  }
  private touchEnd(event: any, progressBarRef: any): void {
    console.log('touchEnd');
    let nowstyle: any = progressBarRef;
    if (nowstyle) {
      this.audioRef.currentTime =
        (nowstyle.style.width.replace('%', '') / 100) * this.audioRef.duration;
    }
    this.now = this.audioRef.currentTime;
    this.audioRef.play();
    // this.isPlaying = true;
    // this.play();
    //this.$store.commit('play', true);
  }
  // private get msrc(): string {
  //   //  if (appCommonStoreModule.getAppCommon.audioCommon.src) {
  //   //   return appCommonStoreModule.getAppCommon.audioCommon.src;
  //   // } else {
  //     return 'http://localhost:8081/song/002.mp3';
  //   // }
  // }
  private isPlaying(): boolean {
    return true;
  }
  // private DOM(): any {
  //   return this.$store.state.DOM;
  // }

  // private isShowSearch(): any {
  //   return this.$store.state.isShowSearch;
  // }
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
