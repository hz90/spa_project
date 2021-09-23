<template>
  <div>
    <transition name="showAbout">
      <div class="about">
        <i @click="showAbout()" class="close"></i>
        <div class="about-content">
          <h1>关于</h1>
          <p class="skill"><b>技术栈</b>：</p>
          <div>
            Vue2<br />Vuex<br />TypeScript<br />vue-router<br />axios<br />SASS(SCSS)<br />Webpack<br />ES6<br />localStorage(HTML5)<br />CSS3
          </div>
          <p class="url">
            <b>源码地址</b>：<a
              @touchstart="isHover = true"
              @touchEnd="isHover = false"
              :class="{ hover: isHover }"
              href="https://github.com/microzz/vue-music-player"
              target="_blank"
              >GitHub</a
            >
          </p>
          <p class="url">
            <b>个人网站</b>：<a
              @touchstart="isHover = true"
              @touchEnd="isHover = false"
              :class="{ hover: isHover }"
              href="https://zhz.com/"
              target="_blank"
              >zhaohaizhou</a
            >
          </p>
          <p>
            <br />&nbsp;&nbsp;&nbsp;专属圆圆，倾心之作～～如果你觉得该项目不错，还可以请我吃辣条😄↓↓↓
          </p>
          <div class="help">
            <img src="./help.png" alt="zhaohaizhou.com" />
          </div>
          <p class="copyright">
            <b>【声明】</b
            >：本项目仅供学习使用，请不要用作任何商业用途。有任何疑问请联系作者↓
            <br />📩：<a href="mailto:kaisyu.chou@gmail.com"
              >kaisyu.chou@gmail.com</a
            >
          </p>
        </div>
        <div @click="showAbout()" class="mask"></div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon } from '@/store/vo/app-common';
@Component({
  name: 'AboutVue',
  components: {},
})
export default class AboutVue extends Vue {
  private isHover = false;
  private created(): void {
    console.log('create');
  }
  private mounted(): void {
    console.log('mounted');
  }
  private isShowAbout(): boolean {
    return false;
  }

  private showAbout(): void {
    let appCommon: AppCommon = appCommonStoreModule.getAppCommon;
    appCommon.isShowAbout = false;
    appCommonStoreModule.setAppCommon(appCommon);
  }
}
</script>

<style lang="scss" scoped>
a {
  color: #3f51b5;
}

.about {
  display: flex;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  // background-color: rgba(0, 0, 0, .5);
  .close {
    position: absolute;
    z-index: 3;
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url('./close.svg') no-repeat;
    background-size: contain;
    top: 11%;
    right: 12%;
  }
  .about-content {
    position: relative;
    z-index: 2;
    width: 80%;
    height: 80%;
    background-color: white;
    border-radius: 10px;
    padding: 30px 10px;
    box-shadow: 0 0 20px gray;
    overflow: auto;

    h1 {
      text-align: center;
      font-size: 1.2rem;
      color: #31c27c;
      transition: 0.3s ease-in-out;
    }
    h1:hover {
      transform: rotate(15deg);
      transition: 0.3s ease-in-out;
    }

    p {
      text-indent: 1em;
      word-break: break-all;
      margin-top: 6px;

      b {
        display: inline-block;
        transition: 0.3s ease-in-out;
      }
      b:hover {
        transform: rotate(-10deg);
        transition: 0.3s ease-in-out;
      }
    }
    p.copyright {
      text-indent: 0;
    }
    div {
      // letter-spacing: 1px;
      padding-left: 50px;
    }
    .help {
      padding: 0;
      width: 100%;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .mask {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: none;
  }
}
.showAbout-enter-active {
  transition: all 0.4s ease-in-out;
}
.showAbout-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.showAbout-enter,
.showAbout-leave-active {
  transform: rotateZ(180deg);
  opacity: 0;
}
</style>
