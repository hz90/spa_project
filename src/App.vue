<template>
  <div id="app">
    <!-- 主界面部分 -->
    <transition name="show">
      <div v-show="isShowIndex" class="index">
        <!-- 侧边栏 -->
        <AsideMenu v-show="isShowAsideMenu()"></AsideMenu>

        <!-- 头部 -->
        <MusicHeader></MusicHeader>

        <!-- router控制的Tab页内容 -->
        <router-view></router-view>

        <!-- 尾部mini播放器 -->
        <VFooter></VFooter>
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
    <About v-if="isShowAbout()"></About>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MusicHeader from '@/components/Header/MusicHeader.vue';
import VFooter from '@/components/Footer/Footer.vue';
import AsideMenu from '@/components/AsideMenu/AsideMenu.vue';
import Play from '@/components/Play/Play.vue';
import About from '@/components/About/About.vue';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
// import { AppCommon } from '@/store/vo/app-common';
@Component({
  name: 'App',
  components: { MusicHeader, VFooter, AsideMenu, Play, About },
})
/* eslint-disable */
export default class App extends Vue {
  private msrc = 'http://localhost:8081/song/002.mp3';
  private beforeCreate() {
    // this.$store.dispatch('getData');
  }
  private mounted() {
    // this.$store.commit('findDOM', { name: 'audio', dom: this.$refs.audio });
    // this.$refs.audio.addEventListener('ended', () => { this.next(); });
    // this.$refs.audio.addEventListener('error', () => { this.next(); });
    console.log(
      '%c Powered by Zhaohui - microzz.com',
      'background-image:-webkit-gradient( linear, left top,right top, color-stop(0, #00a419),color-stop(0.15, #f44336), color-stop(0.29, #ff4300),color-stop(0.3, #AA00FF),color-stop(0.4, #8BC34A), color-stop(0.45, #607D8B),color-stop(0.6, #4096EE), color-stop(0.75, #D50000),color-stop(0.9, #4096EE), color-stop(1, #FF1A00));color:transparent;-webkit-background-clip:text;font-size:13px;'
    );
  }
  private isShowAsideMenu(): boolean {
    if (appCommonStoreModule.getAppCommon.isShowAsideMenu) {
      return appCommonStoreModule.getAppCommon.isShowAsideMenu;
    } else {
      return false;
    }
  }
  // private get msrc(): string {
  //   //  if (appCommonStoreModule.getAppCommon.audioCommon.src) {
  //   //   return appCommonStoreModule.getAppCommon.audioCommon.src;
  //   // } else {
  //     return 'http://localhost:8081/song/002.mp3';
  //   // }
  // }
  private isPlaying(): any {
    return true;
  }
  private DOM(): any {
    return this.$store.state.DOM;
  }

  private isShowSearch(): any {
    return this.$store.state.isShowSearch;
  }
  private isShowIndex(): any {
    return true;
  }
  private isShowAbout(): any {
    if (appCommonStoreModule.getAppCommon.isShowAbout) {
      return appCommonStoreModule.getAppCommon.isShowAbout;
    } else {
      return false;
    }
  }
  private musicData(): any {
    return [];
  }

  private defaultSrc: string = 'http://localhost:8081/song/002.mp3';

  //  private   next():void {
  //       // this.audio.index = this.audio.index === this.musicData.length - 1 ? 0 : (++this.audio.index);
  //       // this.$store.commit('toggleMusic', this.audio.index);
  //     }
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
