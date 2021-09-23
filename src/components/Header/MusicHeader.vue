<template lang="html">
  <div :style="{ backgroundColor: skinColor }" class="header">
    <div class="name">
      <span @click="showAsideMenu()" class="func"
        ><i class="func-icon"></i
      ></span>
      <p>○○の云音乐</p>
      <span class="search"><i @click="toSearch" class="search-icon"></i></span>
    </div>
    <div class="tab">
      <div v-bind:class="{ link: linkBorderIndex == 1 }" class="item">
        <span @click="goMusic_list">我的</span>
      </div>
      <div v-bind:class="{ link: linkBorderIndex == 2 }" class="item">
        <span @click="toSearch">发现</span>
      </div>
      <div v-bind:class="{ link: linkBorderIndex == 3 }" class="item">
        <span @click="toSocial">一个</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon } from '@/store/vo/app-common';
@Component({
  name: 'MusicHeader',
  components: {},
})
export default class MusicHeader extends Vue {
  private linkBorderIndex = 1;
  private skinColor = '#B72712';

  private goMusic_list(): void {
    this.linkBorderIndex = 1;
    this.$router.push('/musicList');
  }
  private toSearch(): void {
    this.linkBorderIndex = 2;
    this.$router.push('/find');
  }
  private toSocial(): void {
    this.linkBorderIndex = 3;
    this.$router.push('/social');
  }
  private showAsideMenu(): void {
    let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
    appCommon.isShowAsideMenu = true;
    appCommonStoreModule.setAppCommon(appCommon);
  }
  // /* eslint-disable */
  // private beforeRouteLeave(to: any, from: any, next: any) {
  //   next();
  // }
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #b72712;
  color: white;
  flex: 1;
  width: 100%;

  .name {
    display: flex;
    justify-content: space-between;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    span.func {
      flex: 1;
      position: relative;

      i {
        display: inline-block;
        position: absolute;
        width: 20px;
        height: 20px;
        left: 15px;
        bottom: 0;
        background: url(./func.svg) no-repeat;
        background-size: contain;
        cursor: pointer;
      }
    }
    p {
      flex: 1;
    }
    span.search {
      position: relative;
      flex: 1;

      i {
        display: inline-block;
        position: absolute;
        width: 20px;
        height: 20px;
        right: 15px;
        bottom: 0;
        background: url(./search.svg) no-repeat;
        background-size: contain;
        cursor: pointer;
      }
    }
  }

  .tab {
    display: flex;
    border-bottom: 1px solid #9e9e9e;

    a {
      display: inline-block;
      width: 50%;
    }
    a::after {
      background-color: rgba(255, 255, 255, 0.2);
      height: 1px;
      bottom: -2px;
    }

    .item {
      display: inline-block;
      flex: 1;
      text-align: center;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .link {
    font-weight: bold;
    color: #bdbdbd;
    border-bottom: 1px solid #e0f2f1;
  }
}
</style>
