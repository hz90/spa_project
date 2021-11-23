<template>
  <div id="app" @touchstart="iosinitpagetouche()">
    <!-- 主界面部分 -->
    <transition name="show">
      <div v-show="isShowIndex()" class="index">
        <!-- 侧边栏 -->
        <AsideMenu
          :login-username="loginUsername"
          v-show="isShowAsideMenu()"
        ></AsideMenu>

        <!-- 头部 -->
        <MusicHeader></MusicHeader>

        <!-- router控制的Tab页内容 -->
        <router-view></router-view>

        <!-- 尾部mini播放器 -->
        <Footer
          :is-playing="isPlayingCommon"
          :total-time="getTotalTime"
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

    <audio
      :src="msrc"
      v-bind:autoplay="isPlaying"
      preload="auto"
      ref="audio"
      @touchstart="play"
    >
      <!--（1）属性：controls，preload（2）事件：canplay，timeupdate，ended（3）方法：play()，pause() -->
      <!--controls：向用户显示音频控件（播放/暂停/进度条/音量）-->
      <!--preload：属性规定是否在页面加载后载入音频-->
      <!--canplay：当音频/视频处于加载过程中时，会发生的事件-->
      <!--timeupdate：当目前的播放位置已更改时-->
      <!--ended：当目前的播放列表已结束时-->
      您的浏览器不支持音频播放
      <!-- <source :src="msrc" type="audio/mpeg" /> -->
    </audio>

    <!-- 关于界面 -->
    <AboutVue v-if="isShowAbout()"></AboutVue>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator';
import MusicHeader from '@/components/Header/MusicHeader.vue';
import Footer from '@/components/Footer/Footer.vue';
import AsideMenu from '@/components/AsideMenu/AsideMenu.vue';
import Play from '@/components/Play/Play.vue';
import AboutVue from '@/components/About/AboutVue.vue';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon, Audio } from '@/store/vo/app-common';
// import { AppCommon } from '@/store/vo/app-common';
import { songDetailStoreModule } from '@/store/modules/song-detail-store';
import { loginModule } from '@/store/modules/login-store';
import {
  SongDetailStoreVo,
  SongDetailRequestVo,
} from '@/store/vo/music-song-detail-vo';
import { SongStoreVo } from '@/store/vo/music-song-vo';
import { myClollectSongStoreModule } from '@/store/modules/my-collect-song-store';
const baseUrl = process.env.VUE_APP_BASE_API;
function musicInBrowserHandler() {
  document.body.removeEventListener('touchstart', musicInBrowserHandler);
}

@Component({
  name: 'App',
  components: { MusicHeader, Footer, AsideMenu, Play, AboutVue },
})
export default class App extends Vue {
  // private isPlayingCommonAutoPlay = appCommonStoreModule.getAppCommon.isPlaying;
  private now = 0;
  private msrc = appCommonStoreModule.getAppCommon.audioCommon.src;
  private audioCommon = appCommonStoreModule.getAppCommon.audioCommon;
  private totalTime = '0.00';
  private audioDuration = 0;
  private showAsideMenu = appCommonStoreModule.getAppCommon.isShowAsideMenu;
  private loginUsername = '';
  private isInit = 0;
  private nowMusicIsEned = false;
  private nameSiteMapping = new Map();
  @Ref('audio')
  private readonly audioRef!: HTMLAudioElement;
  private localAudio!: HTMLAudioElement;
  private beforeCreate() {
    // console.log('app commponent is init');
    // console.log('app commponent is init initAppCommon');
    // console.log(appCommonStoreModule.getAppCommon);

    let appCommon: AppCommon = Object.create(null) as AppCommon;
    appCommon.isShowAsideMenu = false; //显示侧边栏
    appCommon.isShowMiniMusic = true; //
    appCommon.isShowAbout = false; //显示关于界面
    appCommon.isPlaying = false; //显示bofang
    let audioCommon: Audio = Object.create(null) as Audio;
    audioCommon.src = 'http://localhost:8081/song/001.mp3';
    audioCommon.src = 'http://52.140.206.46/song/001.mp3';
    // audioCommon.src = baseUrl + '/song/001.mp3';
    // audioCommon.src =
    //   'https://r6---sn-3qqp-ioqlr.googlevideo.com/videoplayback?expire=1635583174&ei=ZrB8Ydu5JarXs8IP24KX6As&ip=113.154.12.148&id=o-ABzauxyTnqWQvDXPL6rwCVc3Kr8_ayq5XFGFyWIeajsZ&itag=251&source=youtube&requiressl=yes&mh=OF&mm=31%2C29&mn=sn-3qqp-ioqlr%2Csn-oguelnsz&ms=au%2Crdu&mv=m&mvi=6&pcm2cms=yes&pl=19&initcwndbps=1293750&vprv=1&mime=audio%2Fwebm&ns=7UGGnKoG6ZiqSxDS9UagGQYG&gir=yes&clen=4133796&dur=233.921&lmt=1574712466405367&mt=1635561168&fvip=2&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=5531432&n=YV5SGQGhA3eAP928&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgBGXuEM4BD5xtFK-ODdTac3h6R1nr_Gv4lYCDWQdnFIICIQDQxmt04zwpkjv5i4Ad0x9YAOycgX0l4yrDFGF4ZXMeLQ%3D%3D&sig=AOq0QJ8wRAIgN0oG3UTLzW279NyA_A4QcZswTPZCbmAbuZS3_0qJVqsCIDjNNEZ_j-K3jO3guwNNLjonjsneaBJlibgJnLuns9f1';
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

    // console.log('app commponent is init createAudio' + this.audioRef);
    appCommon = appCommonStoreModule.getAppCommon;
    appCommon.localAudio = this.audioRef;
    if (!appCommon.localAudio) {
      appCommon.localAudio = this.audioRef;
    }
    appCommonStoreModule.setAppCommon(appCommon);

    // console.log(
    //   '----app init---' + JSON.stringify(appCommonStoreModule.getAppCommon)
    // );
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
    // console.log('mounted this.audioRef=' + this.audioRef);
    this.audioRef.src = appCommonStoreModule.getAppCommon.audioCommon.src;
    //this.audioRef.load();
    this.audioRef.addEventListener('play', () => {
      // console.log('play Video can start, but not sure it will play through.');
      this.totalTime = this.transformTime(this.audioRef.duration);
      this.now = this.audioRef.currentTime;
      setInterval(() => {
        this.now = this.audioRef.currentTime;
      }, 1000);
    });
    this.audioRef.addEventListener('canplay', (event) => {
      // console.log(
      //   'Video can start, but not sure it will play through.' + event
      // );
      this.totalTime = this.transformTime(this.audioRef.duration);
      if (!this.nowMusicIsEned) {
        // console.log('this.nowMusicIsEned=' + this.nowMusicIsEned);
        let interval = setInterval(() => {
          this.now = this.audioRef.currentTime;
          if (this.transformTimeIos(this.now) === this.totalTime) {
            // this.play();
            this.audioRef.pause();
            appCommonStoreModule.getAppCommon.isPlaying = false;
            clearInterval(interval);
            // this.toggleMusic(2).then(() => {
            //   this.audioRef.play();
            // });
            this.nowMusicIsEned = true;
            // return;
          }
        }, 1000);
        this.nameSiteMapping.set('canplay', interval);
      }
      this.audioDuration = this.isMobile()
        ? this.audioRef.duration / 2
        : this.audioRef.duration;
      this.localAudio = this.audioRef;
      let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
      appCommon.localAudio = this.audioRef;
      // appCommon.isPlaying = false;
      appCommonStoreModule.setAppCommon(appCommon);
    });
    this.audioRef.addEventListener('loadedmetadata', (event) => {
      // console.log(
      //   'loadedmetadata Video can start, but not sure it will play through.' +
      //     event
      // );
      this.totalTime = this.transformTime(this.audioRef.duration);
      if (!this.nowMusicIsEned) {
        // console.log('this.nowMusicIsEned=' + this.nowMusicIsEned);
        let interval = setInterval(() => {
          this.now = this.audioRef.currentTime;

          if (this.transformTimeIos(this.now) === this.totalTime) {
            // this.play();
            appCommonStoreModule.getAppCommon.isPlaying = false;
            this.audioRef.pause();
            clearInterval(interval);
            this.nowMusicIsEned = true;
            // return;
            // this.toggleMusic(2).then(() => {
            //   this.audioRef.play();
            // });
          }
        }, 1000);
        this.nameSiteMapping.set('loadedmetadata', interval);
      }

      this.audioDuration = this.isMobile()
        ? this.audioRef.duration / 2
        : this.audioRef.duration;
      this.localAudio = this.audioRef;
      let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
      appCommon.localAudio = this.audioRef;
      // appCommon.isPlaying = false;
      appCommonStoreModule.setAppCommon(appCommon);
    });
    document.body.addEventListener('touchstart', musicInBrowserHandler);
  }

  private isShowAsideMenu(): boolean {
    if (appCommonStoreModule.getAppCommon.isShowAsideMenu) {
      this.loginUsername = loginModule.getName;
      return appCommonStoreModule.getAppCommon.isShowAsideMenu;
    } else {
      return false;
    }
  }
  public play(): void {
    document.body.addEventListener('touchstart', musicInBrowserHandler);
    // console.log('fatcher method is called');
    let playing = this.isPlayingCommon;
    let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
    playing = !playing;
    appCommon.isPlaying = playing;
    appCommonStoreModule.setAppCommon(appCommon);
    if (!playing) {
      this.audioRef.pause();
    } else {
      let promise = this.audioRef.play();
      //解决Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
      if (promise !== undefined) {
        promise
          .then(() => {
            // Autoplay started
            // console.log('Autoplay started music find');
          })
          // eslint-disable-next-line
          .catch((error: any) => {
            // console.log(error);
            // Autoplay was prevented.
            //this.nativeAudio.muted = true;
            // this.audioRef.load();
            this.audioRef.play();
          });
      }
    }
    document.body.removeEventListener('touchstart', musicInBrowserHandler);
  }
  // eslint-disable-next-line
  private changeTime(event: any, progressBarRef: any): void {
    // console.log('changeTime');
    let progressBar = progressBarRef;
    let coordStart = progressBar.getBoundingClientRect().left;
    let coordEnd = event.pageX;
    this.audioRef.currentTime =
      ((coordEnd - coordStart) / progressBar.offsetWidth) *
      (this.isMobile() ? this.audioRef.duration / 2 : this.audioRef.duration);
    this.now = this.audioRef.currentTime;
    this.audioRef.play();
  }
  // eslint-disable-next-line
  private touchMove(event: any, progressBarRef: any, nowRef: any): void {
    // console.log('touchMove');
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
        (nowstyle.style.width.replace('%', '') / 100) *
        (this.isMobile() ? this.audioRef.duration / 2 : this.audioRef.duration);
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
  private transformTimeIos(seconds: number): string {
    let m: number = Math.floor(seconds / 60);
    let m1 = m.toString().length == 1 ? '0' + m : m;
    let s = Math.floor(seconds - 60 * Number(m1));
    let s1 = s.toString().length == 1 ? '0' + s : s;
    return m + ':' + s1;
  }
  private transformTime(seconds: number): string {
    if (this.isMobile()) {
      seconds = seconds / 2;
    }
    let m: number = Math.floor(seconds / 60);
    let m1 = m.toString().length == 1 ? '0' + m : m;
    let s = Math.floor(seconds - 60 * Number(m1));
    let s1 = s.toString().length == 1 ? '0' + s : s;
    return m + ':' + s1;
  }
  private getMusicDetail(songStoreVos: SongStoreVo): string {
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
  private iosinitpagetouche(): void {
    if (this.isInit === 0) {
      this.isInit = 1;
      let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
      appCommon.localAudio.src =
        appCommonStoreModule.getAppCommon.audioCommon.src;
      appCommon.localAudio.load();
      let promise = appCommon.localAudio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            // Autoplay started
            appCommon.localAudio.pause();
            console.log('ios init page touch');
          })
          // eslint-disable-next-line
          .catch((error: any) => {
            console.log(error);
            // Autoplay was prevented.
            //this.nativeAudio.muted = true;
            // this.nativeAudio.play();
          });
        // this.isInit++;
      }
      // this.play();
    }
  }
  private isMobile(): boolean {
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const isIos = !!u.match(/AppleWebKit.*Mobile.*/);
    return isiOS || isIos || u.indexOf('Safari') > -1;
  }
  private get getTotalTime(): string {
    if (this.totalTime && 'NaN:NaN' !== this.totalTime) {
      return this.totalTime;
    } else {
      return '0:00';
    }
  }
  @Watch('nowMusicIsEned')
  private async autoPlayNext() {
    console.log('自动监视是否播放完');
    if (this.nowMusicIsEned) {
      let i = 0;
      while (i < 10) {
        clearInterval(this.nameSiteMapping.get('loadedmetadata'));
        clearInterval(this.nameSiteMapping.get('canplay'));
        i++;
      }
      // this.nowMusicIsEned = false;
      console.log('自动监视是否播放完 next');
      let toggleMusic = this.toggleMusic(2).then(() => {
        //this.createTouchstartEventAndDispatch(this.audioRef);
      });
      setTimeout(function async() {
        toggleMusic;
      }, 1500);
      // appCommonStoreModule.getAppCommon.isPlaying = true;
      // this.audioRef.pause();
      this.nowMusicIsEned = false;
    }
    this.createTouchstartEventAndDispatch(this.audioRef);
  }
  private createTouchstartEventAndDispatch(el: any) {
    console.log('crate touch is run');

    let elem = document.querySelector('#nextmusic');
    if (elem) {
      // let elem1: EventTarget = elem;
      var touch = new Touch({
        identifier: 42,
        target: elem,
        clientX: 200,
        clientY: 200,
        screenX: 300,
        screenY: 300,
        pageX: 200,
        pageY: 200,
        radiusX: 5,
        radiusY: 5,
      });
      ////开始合成事件
      let event = document.createEvent('Events');
      // 初始化一个按下事件
      var touchEventStart = new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        composed: true,
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
      });
      // 触发按下事件
      elem.dispatchEvent(touchEventStart);
      event.preventDefault();
      // event.initEvent('touchstart', true, true);
      // el.dispatchEvent(event);
      // 初始化一个抬起事件
      let touchEventEnd = new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        composed: true,
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
      });
      // 触发点击抬起事件
      elem.dispatchEvent(touchEventEnd);
      event.preventDefault();
    }
  }
  // 点击切换音乐
  private async toggleMusic(indexInputType: number): Promise<void> {
    let songDetailStoreVo: SongDetailStoreVo[] =
      songDetailStoreModule.getSongsDetail;
    let songStoreVos: SongStoreVo[] =
      myClollectSongStoreModule.getMyCollectSongs;
    let index = 0;
    if (songDetailStoreVo && songDetailStoreVo.length > 0) {
      let musicSrc = songDetailStoreVo[0].msrc;
      let findindex = songStoreVos.findIndex((x) => x.msrc === musicSrc);

      if (findindex > -1) {
        if (indexInputType === 1) {
          index = findindex - 1;
        } else {
          index = findindex + 1;
        }
      }
    }
    if (index < 0) {
      index = songStoreVos.length - 1;
    }
    if (index > songStoreVos.length - 1) {
      index = 0;
    }
    if (songStoreVos[index]) {
      let songStoreVo: SongStoreVo = songStoreVos[index];
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
      // console.log('点击切换音乐' + JSON.stringify(songStoreVos[index]));
      let audioCommon: Audio = appCommonStoreModule.getAppCommon.audioCommon;

      //获取音乐详细信息
      songStoreVos[index].tmpsrc = await this.getMusicDetail(
        songStoreVos[index]
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
    // console.log('appCommon.localAudio' + appCommon.localAudio);
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
          // console.log(error);
          // Autoplay was prevented.
          //this.nativeAudio.muted = true;
          // this.nativeAudio.play();
        });
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
