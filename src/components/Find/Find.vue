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

      <!-- 热门搜索 -->
      <div v-if="songStoreVos.length <= 0" class="hot">
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
      <div v-else class="search-list">
        <div
          v-for="(item, index) of songStoreVos"
          :key="index"
          class="music-item"
        >
          <img v-bind:src="baseUrl + item.psrc" class="music-img" />
          <span class="music-name">{{
            index + 1 + '.&nbsp; ' + item.name
          }}</span>
        </div>

        <div class="tips">没有更多歌曲了～</div>

        <div
          v-show="isShowHistory && searchHistory.length"
          @click="searchHistory = []"
          class="tips"
        >
          清除搜索记录
        </div>

        <div v-show="isLoading" class="loading">
          <i class="icon-loading"></i>搜索中...
        </div>
        <div v-show="songStoreVos.length" class="tips">没有更多结果了～</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { songStoreModule } from '@/store/modules/song-store';
import { SongStoreVo } from '@/store/vo/music-song-vo';
const baseUrl = process.env.VUE_APP_BASE_API;
@Component({
  name: 'Find',
  components: {},
})
/* eslint-disable */
export default class Find extends Vue {
    private baseUrl:string=baseUrl;
  private songStoreVos:SongStoreVo[]=songStoreModule.getSongs;
  private beforeCreate() {
    // this.$store.commit('showMiniMusic', true);
  }
  private created() {
    // this.axios.get('/api/hot').then((res) => {
    //   this.hotKeywords = res.data;
    // });
  }
  private mounted() {
    // this.$store.commit('changeLinkBorderIndex', 2);
  }
  private musicData(): any {
    return this.$store.state.musicData;
  }

  private keywords: string = '';
  private hotKeywords: any = [];
  private isShowHot: any = true;
  private musicList: any = [];
  private playIndex: any = '';
  private isLoading: any = false;
  private isShowHistory: any = false;
  private searchHistory: any =
    (localStorage.searchHistory && JSON.parse(localStorage.searchHistory)) ||
    [];

  private async toSearch(keywords: string):Promise<void> {
    if (keywords.trim()) {
      this.songStoreVos=[];
      this.isShowHistory = false;
      this.isShowHot = false;
      this.playIndex = null;
      this.isLoading = true;
    //  this.$store.commit('showMiniMusic', false);
      this.keywords = keywords;
    await  songStoreModule.exeGetSongsApi(keywords);
     this.songStoreVos=songStoreModule.getSongs;
      this.isLoading = false;
      // this.axios
      //   .get('/api/search/100/' + keywords)
      //   .then((res) => res.data.data.song)
      //   .then((song) => {
      //     this.musicList = song.list;
      //     this.isLoading = false;
      //     this.searchHistory.unshift(keywords);
      //   });
    }
  }
  // 搜索结果点击播放音乐
  private playMusic(index: any, name: any, src: any, imgSrc: any): void {
    src = 'http://ws.stream.qqmusic.qq.com/' + src + '.m4a?fromtag=46';
    this.$store.commit('playMusic', { name: name, src: src, imgSrc: imgSrc });
    this.$store.commit('addMusic', {
      name: name,
      src: src,
      musicImgSrc: imgSrc,
    });
    this.$store.commit('showMiniMusic', true);
    this.playIndex = index;
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

  // 解码
  private strDecode(str: any): any {
    return str.replace(/&#(x)?([^&]{1,5});?/g, function ($:any, $1:any, $2:any) {
      return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
    });
  }
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
