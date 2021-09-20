<template lang="html">
  <transition name="showRouter">
    <div class="music-list">
      <div
        v-for="(item, index) of songStoreVos"
        :key="index"
        class="music-item"
      >
        <img v-bind:src="baseUrl + item.psrc" class="music-img" />
        <span @click="toggleMusic(index)" class="music-name">{{
          index + 1 + '.&nbsp; ' + item.name
        }}</span>
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
import { AppCommon } from '@/store/vo/app-common';
const baseUrl = process.env.VUE_APP_BASE_API;
@Component({
  name: 'MusicList',
  components: {},
})
/* eslint-disable */
export default class MusicList extends Vue {
  private baseUrl:string=baseUrl;
    private initAppCommon() {
    let appCommon: AppCommon = Object.create(null) as AppCommon;
    appCommon.isShowAsideMenu = false;
    appCommon.isShowAbout = false;
    appCommonStoreModule.setAppCommon(appCommon);
  }
  private songStoreVos: SongStoreVo[] = [];
  private beforeCreate() {
    // this.$store.commit('showMiniMusic', true);
  }
  private async mounted() {}
  private async created() {
    this.initAppCommon();
    console.log('execute MusicList');
    await myClollectSongStoreModule.exeGetMySongsApi();
    this.songStoreVos = myClollectSongStoreModule.getMyCollectSongs;
  }

  // private DOM(): any {
  //   return this.$store.state.DOM;
  // }
  // private isPlaying(): any {
  //   return this.$store.state.isPlaying;
  // }

  // 点击切换音乐
  private toggleMusic(index: any): void {
    // if (this.$store.state.audio.index === index) {
    //   this.DOM.audio.paused ? this.DOM.audio.play() : this.DOM.audio.pause();
    //   this.$store.commit('play', !this.isPlaying);
    // } else {
    //   this.DOM.audio.play();
    //   this.$store.commit('play', true);
    // }
    // this.$store.commit('toggleMusic', index);
  }
  // 删除音乐
  private del(index: any): void {
    // this.$store.commit('del', index);
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
}
</style>
