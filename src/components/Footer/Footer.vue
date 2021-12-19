<template lang="html">
  <transition name="fade">
    <div
      v-show="isShowMiniMusic()"
      :style="{ backgroundColor: skinColor }"
      class="footer"
    >
      <div class="mini-music-bar">
        <div>
          <svg
            class="w-8 h-8 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="30"
            height="30"
          >
            <path
              d="M6.59 12.83L4.4 15c-.58.58-1.59 1-2.4 1H0v-2h2c.29 0 .8-.2 1-.41l2.17-2.18 1.42 1.42zM16 4V1l4 4-4 4V6h-2c-.29 0-.8.2-1 .41l-2.17 2.18L9.4 7.17 11.6 5c.58-.58 1.59-1 2.41-1h2zm0 10v-3l4 4-4 4v-3h-2c-.82 0-1.83-.42-2.41-1l-8.6-8.59C2.8 6.21 2.3 6 2 6H0V4h2c.82 0 1.83.42 2.41 1l8.6 8.59c.2.2.7.41.99.41h2z"
            />
          </svg>
        </div>
        <div class="text-grey-darker hover:bg-gray-300 rounded-full p-1">
          <svg
            class="w-8 h-8 cursor-pointer"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="30"
            height="30"
          >
            <path d="M4 5h3v10H4V5zm12 0v10l-9-5 9-5z" />
          </svg>
        </div>
        <div
          class="
            text-white
            p-4
            rounded-full
            bg-gradient-to-r
            from-red-500
            via-red-600
            to-red-700
            shadow-lg
          "
          width="30"
          height="30"
        >
          <svg
            id="touchwillplay"
            v-if="!isPlaying"
            @touchstart="play()"
            class="w-8 h-8 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="30"
            height="30"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            id="touchwillplay"
            v-else
            @touchstart="pause()"
            class="w-8 h-8 cursor-pointer"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="30"
            height="30"
          >
            <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
          </svg>
        </div>
        <div class="text-grey-darker hover:bg-gray-300 rounded-full p-1">
          <svg
            class="w-8 h-8 cursor-pointer"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="30"
            height="30"
          >
            <path d="M13 5h3v10h-3V5zM4 5l9 5-9 5V5z" />
          </svg>
        </div>
        <div class="text-grey-darker hover:bg-gray-300 rounded-full p-1">
          <svg
            class="w-8 h-8 cursor-pointer"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="30"
            height="30"
          >
            <path
              d="M5 4a2 2 0 0 0-2 2v6H0l4 4 4-4H5V6h7l2-2H5zm10 4h-3l4-4 4 4h-3v6a2 2 0 0 1-2 2H6l2-2h7V8z"
            />
          </svg>
        </div>
      </div>
      <div class="mini-music">
        <div class="music-img">
          <img ref="img" v-bind:src="audioCommon.musicImgSrc" alt="zhz.com" />
        </div>
        <div class="music-name">
          <p>{{ audioCommon.name }}</p>
          <div class="progress">
            <span class="start">{{ transformTimeIos(now) }}</span>
            <div
              @click="changeTime($event)"
              @touchmove="touchMove($event)"
              @touchend="touchEnd($event)"
              ref="progressBar"
              class="progress-bar"
            >
              <div
                class="now"
                ref="nowRef"
                :style="{
                  width: (now / audioDuration).toFixed(3) * 100 + '%',
                }"
              ></div>
            </div>
            <span class="end">{{ transformTimeIos(audioDuration) }}</span>
          </div>
        </div>
        <div class="music-control">
          <div class="w-3/12 md:w-2/12 hover:bg-gray-500 rounded-full md:p-1">
            <svg
              v-if="mutePlayer"
              class="w-6 h-6 m-auto text-red-500 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="10"
              height="10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                clip-rule="evenodd"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6 m-auto cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="30"
              height="30"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>
          <div class="w-9/12 md:w-10/12 m-auto relative">
            <div @click="volume($event)" ref="volBar" style="width: 100%">
              <div :style="{ width: volumeProgress + '%' }"></div>
            </div>
            <div
              class="flex justify-end h-1 rounded-full relative"
              :style="{ width: volumeProgress + '%' }"
            >
              <span id="progressButtonVolume"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import { AppCommon, Audio } from '@/store/vo/app-common';
import { SongStoreVo } from '@/store/vo/music-song-vo';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon, Audio } from '@/store/vo/app-common';
import { songDetailStoreModule } from '@/store/modules/song-detail-store';
import { myClollectSongStoreModule } from '@/store/modules/my-collect-song-store';
import { Howl } from 'howler';
import {
  SongDetailStoreVo,
  SongDetailRequestVo,
} from '@/store/vo/music-song-detail-vo';
@Component({
  name: 'Footer',
  components: {},
})
export default class Footer extends Vue {
  private mutePlayer = false;
  private volumeProgress = 10;
  @Prop({ default: false })
  private isPlaying!: boolean;
  @Prop({ default: {} })
  private audioCommon!: Audio;
  // @Prop({ default: {} })
  // private localAudio!: HTMLAudioElement;
  private playIcon = 'play-icon';
  private defaultimage = 'play-icon';
  private pauseIcon = 'pause-icon';
  @Prop({ default: 0 })
  private audioDuration!: number;
  @Prop({ default: 0 })
  private now!: number;
  private totalTime = 100;
  //private audio: Audio = Object.create(null) as Audio;
  private musicSrc: string = appCommonStoreModule.getAppCommon.audioCommon.src;
  private mounted() {
    //dosomething
  }

  private isShowMiniMusic(): boolean {
    return true;
  }

  // private seek(event: any) {
  //   let progressBaRefr = this.$refs.progressBar;
  //   let progressBar: any = progressBaRefr;
  //   let coordStart = progressBar.getBoundingClientRect().left;
  //   let coordEnd = event.pageX;
  //   this.now =
  //     ((coordEnd - coordStart) / progressBar.offsetWidth) * this.audioDuration;

  //   let sound = appCommonStoreModule.getAppCommon.audioCommon.howl;
  //   sound.seek(this.now);
  //   sound.play();
  // }
  // eslint-disable-next-line
  private changeTime(event: any): void {
    let progressBaRefr = this.$refs.progressBar;
    this.$emit('fatherMethodChangeTime', event, progressBaRefr);
  }
  // eslint-disable-next-line
  private touchMove(event: any): void {
    let progressBaRefr = this.$refs.progressBar;
    let nowRef = this.$refs.nowRef;
    this.$emit('fatherMethodTouchMove', progressBaRefr, nowRef);
  }
  // eslint-disable-next-line
  private touchEnd(event: any): void {
    let progressBarRef = this.$refs.nowRef;
    console.log('progressBaRefr=' + progressBarRef);
    this.$emit('fatherMethodTouchEnd', progressBarRef);
  }
  private skinColor(): string {
    return this.$store.state.skinColor;
  }
  private transformTimeIos(seconds: number): string {
    let m: number = Math.floor(seconds / 60);
    let m1 = m.toString().length == 1 ? '0' + m : m;
    let s = Math.floor(seconds - 60 * Number(m1));
    let s1 = s.toString().length == 1 ? '0' + s : s;
    return m + ':' + s1;
  }
  @Watch('appCommonStoreModule.getAppCommon.audioCommon.src')
  private watchMusicChange() {
    console.log('watch is change');
    this.play();
  }
  private pause(): void {
    let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
    if (appCommon.audioCommon.howl) {
      appCommon.isPlaying = !appCommon.isPlaying;
      appCommonStoreModule.setAppCommon(appCommon);
      appCommon.audioCommon.howl.pause();
    }
  }

  /**
   * 开始播放
   */
  private play(): void {
    //play
    let songStoreVos: SongStoreVo[] =
      myClollectSongStoreModule.getMyCollectSongs;
    let willPlayMusicSrc = '';
    let findindex = -1;
    let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
    if (appCommon.audioCommon.howl) {
      let sound = appCommon.audioCommon.howl;
      appCommon.isPlaying = !appCommon.isPlaying;
      appCommonStoreModule.setAppCommon(appCommon);
      sound.play();
      return;
    }
    if (songStoreVos && songStoreVos.length > 0) {
      //获取当前播放歌曲
      //查看当前歌曲是否在我的收藏里
      findindex = songStoreVos.findIndex(
        (x) => x.tmpsrc === appCommon.audioCommon.src
      );
    }
    //在收藏里
    if (findindex > -1) {
      //链接存在的时候
      if (songStoreVos[findindex + 1].tmpsrc) {
        //
        willPlayMusicSrc = songStoreVos[findindex + 1].tmpsrc;
      } else {
        this.getPlayMusicUrl(findindex + 1).then((val) => {
          willPlayMusicSrc = val;
          let sound = new Howl({
            src: [willPlayMusicSrc],
            html5: true,
            autoplay: true,
            preload: true,
            // loop: true,
          });
          appCommon.audioCommon.howl = sound;
          appCommon.audioCommon.name = songStoreVos[findindex + 1].name;
          appCommon.audioCommon.musicImgSrc = songStoreVos[findindex + 1].psrc;
          appCommon.audioCommon.src = songStoreVos[findindex + 1].tmpsrc;
          appCommon.isPlaying = !appCommon.isPlaying;
          appCommonStoreModule.setAppCommon(appCommon);
          sound.play();
        });
      }
    } else {
      //不在收藏里
      willPlayMusicSrc = appCommon.audioCommon.src;
    }
    // if (willPlayMusicSrc) {
    //   if (appCommon.audioCommon.howl) {
    //     let playnewsrc: Howl = appCommon.audioCommon.howl;
    //     playnewsrc.pause();
    //   }
    //   let sound = new Howl({
    //     src: [willPlayMusicSrc],
    //     html5: true,
    //     autoplay: true,
    //     preload: true,
    //     // loop: true,
    //   });
    //   appCommon.audioCommon.howl = sound;
    //   appCommon.isPlaying = !appCommon.isPlaying;
    //   appCommonStoreModule.setAppCommon(appCommon);
    //   sound.play();
    // }
  }
  // 点击切换音乐
  private async getPlayMusicUrl(indexInputType: number): Promise<string> {
    let musicUrl = '';
    let songStoreVos: SongStoreVo[] =
      myClollectSongStoreModule.getMyCollectSongs;
    if (songStoreVos[indexInputType]) {
      //获取音乐详细信息
      musicUrl = await this.getMusicDetail(songStoreVos[indexInputType]);
      console.log(musicUrl);
    }
    return musicUrl;
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
  // background: #b72712;
  width: 100%;
  height: 100px;
  text-align: center;
  // position: fixed;
  // bottom: 0;
  .mini-music-bar {
    display: flex;
    height: 30px;
    line-height: 30px;
  }
  .mini-music {
    background: #b72712;
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
  * {
    font-family: 'Poppins', sans-serif;
  }
  #journal-scroll::-webkit-scrollbar {
    width: 4px;
    cursor: pointer;
  }
  #journal-scroll::-webkit-scrollbar-track {
    background-color: rgba(229, 231, 235, var(--bg-opacity));
    cursor: pointer;
  }
  #journal-scroll::-webkit-scrollbar-thumb {
    cursor: pointer;
    background-color: #a0aec0;
  }
  .cd-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #f7fafc;
  }

  #progressButtonTimer,
  #progressButtonVolume {
    margin-top: -9px;
    right: -8px;
  }

  @media screen and (max-width: 768px) {
    #progressButtonTimer,
    #progressButtonVolume {
      margin-top: -8px;
      right: -7px;
    }
  }
}
</style>
