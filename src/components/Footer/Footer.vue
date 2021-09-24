<template lang="html">
  <transition name="fade">
    <div
      v-show="isShowMiniMusic()"
      :style="{ backgroundColor: skinColor }"
      class="footer"
    >
      <div class="mini-music">
        <div class="music-img">
          <img
            @click="showPlay"
            ref="img"
            v-bind:src="audioCommon.musicImgSrc"
            alt="zhz.com"
          />
        </div>
        <div class="music-name">
          <p @click="showPlay">
            {{ audioCommon.name }}
          </p>
          <div class="progress">
            <span class="start">{{ transformTime(now) }}</span>
            <div
              @click="changeTime($event)"
              @touchmove="touchMove($event)"
              @touchend="touchEnd($event)"
              ref="progressBar"
              class="progress-bar"
            >
              <div
                class="now"
                ref="now"
                :style="{
                  width: (now / audioDuration).toFixed(3) * 100 + '%',
                }"
              ></div>
            </div>
            <span class="end" v-text="totalTime"></span>
          </div>
        </div>
        <div class="music-control">
          <i
            @click="play()"
            v-bind:class="[isPlaying ? 'pause-icon' : 'play-icon']"
          ></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
// import { AppCommon, Audio } from '@/store/vo/app-common';
import { Audio } from '@/store/vo/app-common';
@Component({
  name: 'Footer',
  components: {},
})
/* eslint-disable */
export default class Footer extends Vue {
  @Prop({ default: false })
  private isPlaying!: boolean;
  @Prop({ default: '0.00' })
  private totalTime!: string;
  // @PropSync('now')
  @Prop({ default: 0 })
  private now!: number;
  @Prop({ default: {} })
  private audioCommon!: Audio;
  @Prop({ default: 0 })
  private audioDuration!: number;
  // @Prop({ default: {} })
  // private localAudio!: HTMLAudioElement;
  private playIcon = 'play-icon';
  private pauseIcon = 'pause-icon';
  private nativeAudio: HTMLAudioElement =
    appCommonStoreModule.getAppCommon.localAudio;
  //private audio: Audio = Object.create(null) as Audio;
  // private musicSrc: string = appCommonStoreModule.getAppCommon.audioCommon.src;
  private mounted() {
    // console.log('isplaying footer' + this.isPlaying);
    // if (appCommonStoreModule.getAppCommon.localAudio) {
    //   this.localAudio = appCommonStoreModule.getAppCommon.localAudio;
    // }
    // console.log(this.audioDuration);
    // this.isPlaying = appCommonStoreModule.getAppCommon.isPlaying;
    // this.nativeAudio = document.querySelector('audio');
    // console.log('Footer mounted' + this.nativeAudio);
    // this.nativeAudio.addEventListener('play', () => {
    //   this.totalTime = this.transformTime(this.nativeAudio.duration);
    //   this.now = this.nativeAudio.currentTime;
    //   setInterval(() => {
    //     this.now = this.nativeAudio.currentTime;
    //   }, 1000);
    // });
    // this.nativeAudio.addEventListener('canplay', () => {
    //   this.totalTime = this.transformTime(this.nativeAudio.duration);
    //   this.now = this.nativeAudio.currentTime;
    //   setInterval(() => {
    //     this.now = this.nativeAudio.currentTime;
    //   }, 1000);
    // });
    // this.audio = this.audioCommon();
    // let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
    // if (!appCommon.localAudio) {
    //   appCommon.localAudio = this.nativeAudio;
    // }
    // appCommonStoreModule.setAppCommon(appCommon);
  }

  private isShowMiniMusic(): boolean {
    return true;
  }
  // private audioCommon(): Audio {
  //   let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
  //   // appCommon.isShowAsideMenu = false;
  //   // appCommon.isShowAbout = false;
  //   appCommon.isPlaying = false;
  //   // appCommon.isShowAsideMenu = false; //显示侧边栏
  //   // appCommon.isShowMiniMusic = true; //
  //   // appCommon.isShowAbout = false; //显示关于界面
  //   console.log('footer init appCommon' + JSON.stringify(appCommon));
  //   if (!appCommon.audioCommon) {
  //     let audioCommon: Audio = Object.create(null) as Audio;
  //     audioCommon.src = 'http://localhost:8081/song/002.mp3';
  //     audioCommon.name = 'test';
  //     audioCommon.musicImgSrc = 'http://127.0.0.1:8081/img/songPic/HereIam.jpg';
  //     audioCommon.index = 0;
  //     appCommon.audioCommon = audioCommon;
  //   }
  //   appCommonStoreModule.setAppCommon(appCommon);
  //   return appCommon.audioCommon;
  // }
  private skinColor(): string {
    return this.$store.state.skinColor;
  }
  private defaultImg: string = '/assests/images/default.png';

  // private autoChangeMusic() {
  //   console.log('点击音乐发生变更');
  //   if (this.audio.src) {
  //     console.log('点击音乐发生变更');
  //     let isPlaying = appCommonStoreModule.getAppCommon.isPlaying;
  //     this.playVideo(isPlaying);
  //   }
  // }
  // private playVideo(isPlaying: boolean): void {
  //   if (isPlaying) {
  //     this.isPlaying = isPlaying;
  //     this.nativeAudio.src = appCommonStoreModule.getAppCommon.audioCommon.src;
  //     this.nativeAudio.load();
  //     // this.nativeAudio.canplay=true;
  //     //this.totalTime = this.transformTime(this.nativeAudio.duration);
  //     let promise = this.nativeAudio.play();
  //     //解决Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
  //     if (promise !== undefined) {
  //       promise
  //         .then(() => {
  //           // Autoplay started
  //           console.log('Autoplay started');
  //         })
  //         .catch((error: any) => {
  //           console.log(error);
  //           // Autoplay was prevented.
  //           //this.nativeAudio.muted = true;
  //           // this.nativeAudio.play();
  //         });
  //     }
  //   }
  // }
  private play(): void {
    console.log('called fatherMethod');
    // this.isPlaying = !this.isPlaying;
    // !this.isPlaying ? this.nativeAudio.pause() : this.nativeAudio.play();
    this.$emit('fatherMethod');
  }
  private showPlay(): void {
    // if (this.isShowAsideMenu()) {
    //   return;
    // }
    // this.$store.commit('showIndex', false);
    // this.$store.commit('showMiniMusic', false);
  }
  private changeTime(event: any): void {
    let progressBaRefr: any = this.$refs.progressBar;
    this.$emit('fatherMethodChangeTime', event, progressBaRefr);
  }
  private touchMove(event: any): void {
    let progressBaRefr: any = this.$refs.progressBar;
    let nowRef: any = this.$refs.now;
    this.$emit('fatherMethodTouchMove', progressBaRefr,nowRef);
  }
  private touchEnd(event: any): void {
    let progressBaRefr: any = this.$refs.now;
    this.$emit('fatherMethodTouchEnd', progressBaRefr);
  }
  // private changeTime(event: any): void {
  //   console.log('changeTime');
  //   let nativeAudio = appCommonStoreModule.getAppCommon.localAudio;
  //   let progressBar: any = this.$refs.progressBar;
  //   let coordStart = progressBar.getBoundingClientRect().left;
  //   let coordEnd = event.pageX;
  //   nativeAudio.currentTime =
  //     ((coordEnd - coordStart) / progressBar.offsetWidth) *
  //     nativeAudio.duration;
  //   this.now = nativeAudio.currentTime;
  //   nativeAudio.play();
  //   this.isPlaying = true;
  // }
  // private touchMove(event: any): void {
  //   console.log('touchMove');
  //   let progressBar: any = this.$refs.progressBar;
  //   let coordStart: any = progressBar.getBoundingClientRect().left;
  //   let coordEnd: any = event.touches[0].pageX;
  //   let nowstyle: any = this.$refs.now;
  //   if (nowstyle) {
  //     if (nowstyle.style) {
  //       nowstyle.style.width =
  //         ((coordEnd - coordStart) / progressBar.offsetWidth.toFixed(3)) * 100 +
  //         '%';
  //     }
  //   }
  // }
  // private touchEnd(event: any): void {
  //   console.log('touchEnd');
  //   let nativeAudio = appCommonStoreModule.getAppCommon.localAudio;
  //   let nowstyle: any = this.$refs.now;
  //   if (nowstyle) {
  //     nativeAudio.currentTime =
  //       (nowstyle.style.width.replace('%', '') / 100) * nativeAudio.duration;
  //   }
  //   this.now = nativeAudio.currentTime;
  //   nativeAudio.play();
  //   this.isPlaying = true;
  //   // this.play();
  //   //this.$store.commit('play', true);
  // }
  private transformTime(seconds: any): any {
    let m: any, s: any;
    m = Math.floor(seconds / 60);
    m = m.toString().length == 1 ? '0' + m : m;
    s = Math.floor(seconds - 60 * m);
    s = s.toString().length == 1 ? '0' + s : s;
    return m + ':' + s;
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-active {
  transform: translateY(50px);
  opacity: 0;
}
.footer {
  background: #b72712;
  width: 100%;
  height: 70px;
  text-align: center;
  // position: fixed;
  // bottom: 0;

  .mini-music {
    display: flex;
    height: 70px;
    line-height: 70px;

    .music-img {
      width: 70px;
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 70px;
        height: 70px;
        border-radius: 35px;
        background-size: contain;
        cursor: pointer;
      }
    }
    .music-name {
      flex: 5;
      color: white;
      overflow: hidden;
      position: relative;
      width: 100%;

      p {
        position: relative;
        z-index: 1;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        white-space: nowrap;
        // cursor: pointer;
      }
      .progress {
        position: absolute;
        width: 100%;
        top: 10px;
        left: 0;
        span.start {
          position: absolute;
          left: 6px;
          // padding-right: 5px;
        }
        span.end {
          position: absolute;
          right: 4px;
          // padding-left: 5px;
        }
        @media screen and(min-width: 600px) {
          span.start {
            position: absolute;
            left: 26px;
          }
          span.end {
            position: absolute;
            right: 30px;
          }
        }
        .progress-bar {
          position: relative;
          width: 50%;
          height: 5px;
          display: inline-block;
          background-color: rgba(255, 255, 255, 0.5);
          vertical-align: 2px;
          border-radius: 3px;
          cursor: pointer;

          .now {
            position: absolute;
            left: 0;
            display: inline-block;
            max-width: 100%;
            // width: 70%;
            height: 5px;
            background-color: #31c27c;
          }
          .now::after {
            content: '';
            position: absolute;
            left: 100%;
            width: 2px;
            height: 6px;
            background-color: white;
          }
        }
      }
    }
    .music-control {
      flex: 1.5;
      i {
        padding-right: 10px;
        width: 45px;
        height: 45px;
        margin-top: 13px;
        display: inline-block;
        cursor: pointer;
        border-radius: 22px;
      }
      .play-icon {
        background: url(./play.svg) no-repeat;
        background-size: contain;
      }
      .pause-icon {
        background: url(./pause.svg) no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>
