<template lang="html">
  <div class="login-wrap">
    <div v-if="!isLoading && !error && !success" class="login-html">
      <input id="tab-1" type="radio" name="tab" class="sign-in" checked /><label
        for="tab-1"
        class="tab"
        >Sign In</label
      >
      <input id="tab-2" type="radio" name="tab" class="sign-up" /><label
        for="tab-2"
        class="tab"
        >Sign Up</label
      >
      <div class="login-form">
        <div class="sign-in-htm">
          <div class="group">
            <label for="user" class="label">Username</label>
            <input
              v-model="username"
              id="user"
              type="text"
              class="input"
              required=""
            />
          </div>
          <div class="group">
            <label for="pass" class="label">Password</label>
            <input
              v-model="password"
              id="pass"
              type="password"
              class="input"
              required=""
            />
          </div>
          <div class="group">
            <input id="check" type="checkbox" class="check" checked />
            <label for="check"
              ><span class="icon"></span> Keep me Signed in</label
            >
          </div>
          <div class="group">
            <input
              type="button"
              class="button"
              @click="login()"
              value="Sign In"
            />
          </div>
          <div class="hr"></div>
          <div class="foot-lnk">
            <span>Forgot Password?</span>
          </div>
        </div>
        <div class="sign-up-htm">
          <div class="group">
            <label for="user" class="label">Username</label>
            <input id="user" type="text" class="input" />
          </div>
          <div class="group">
            <label for="pass" class="label">Password</label>
            <input
              id="pass"
              type="password"
              class="input"
              data-type="password"
            />
          </div>
          <div class="group">
            <label for="pass" class="label">Repeat Password</label>
            <input
              id="pass"
              type="password"
              class="input"
              data-type="password"
            />
          </div>
          <div class="group">
            <label for="pass" class="label">Email Address</label>
            <input id="pass" type="text" class="input" />
          </div>
          <div class="group">
            <input type="submit" class="button" value="Sign Up" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="error">
      <!-- <b-toast id="example-toast" title="信息提示" static no-auto-hide>
        登录触发错误！！！！
        <BR />
        {{ error }}
      </b-toast> -->
      <span>
        登录出现错误！！！！
        <BR />
        {{ error }}</span
      >
      <BR />
      <b-button variant="primary" @click="goLogin()">重新登录</b-button>
    </div>
    <div v-if="success">
      登录成功
      <br />
      <b-button variant="primary" @click="goLogin()">重新登录</b-button>
    </div>
    <div v-if="isLoading" class="loading">
      <i class="icon-loading"></i>
    </div>
    <!-- <div v-if="isLoading" class="loading">
      <span></span>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { loginModule } from '@/store/modules/login-store';
import { publicKeyStoreModule } from '@/store/modules/publickey-store';
import { loginStoreVo } from '@/store/vo/login-store-vo';
import auth from '@/config/auth';
@Component({
  name: 'Login',
  components: {},
})
export default class Login extends Vue {
  private isLoading = false;
  private username = '';
  private password = '';
  private error = '';
  private success = false;
  private beforeCreate() {
    // this.$store.commit('showMiniMusic', false);
  }
  private created() {
    // this.getOne();
  }
  private mounted() {
    this.success = auth.getToken() ? true : false;
  }
  public async login(): Promise<void> {
    this.isLoading = true;

    await publicKeyStoreModule.exeGetPublicKeyApi();
    console.log('publickey:' + publicKeyStoreModule.getMypublicKey);
    let loginStoreVo: loginStoreVo = {
      username: this.username,
      password: this.password,
    };
    await loginModule
      .executeLoginApi(loginStoreVo)
      .then(() => {
        this.isLoading = false;
        this.success = true;
        loginModule.setLoginUsername(this.username);
      })
      // eslint-disable-next-line
      .catch((error: any) => {
        this.error = JSON.stringify(error.data);
        this.$bvToast.show('example-toast');
        this.isLoading = false;
        console.log('bbbbb' + error);
      })
      .finally(() => {
        this.isLoading = false;
        console.log('aa');
      });
  }
  private goLogin(): void {
    this.error = '';
    this.success = false;
    auth.removeToken();
    this.$router.push('/login');
  }
}
</script>

<style lang="scss" scoped>
.login-wrap {
  width: 100%;
  margin: auto;
  max-width: 525px;
  min-height: 650px;
  position: relative;
  //background: url(https://raw.githubusercontent.com/khadkamhn/day-01-login-form/master/img/bg.jpg) no-repeat center;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}
.loading {
  padding-top: 10px;
  text-align: center;

  .icon-loading {
    display: inline-block;
    margin: auto;
    width: 100px;
    height: 100px;
    background: url('./loading.gif') no-repeat;
    background-size: contain;
    animation: loading 0.6s linear infinite;
    vertical-align: text-top;
    margin-right: 10px;
  }
}
// .loading {
//   width: 150px;
//   height: 8px;
//   border-radius: 4px;
//   margin: 0 auto;
//   margin-top: 100px;
//   position: relative;
//   background: lightblue;
//   overflow: hidden;
// }
// .loading span {
//   display: block;
//   width: 100%;
//   height: 100%;
//   border-radius: 3px;
//   background: lightgreen;
//   animation: loading 0.6s linear infinite;
// }
// @keyframes loading {
//   0% {
//     -webkit-transform: translate(-150px);
//   }
//   50% {
//     -webkit-transform: translate(0);
//   }
//   100% {
//     -webkit-transform: translate(150px);
//   }
// }
// @keyframes loading {
//   from {
//     transform: rotate(0);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }
.login-html {
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 90px 70px 50px 70px;
  background: rgba(40, 57, 101, 0.9);
}
.login-html .sign-in-htm,
.login-html .sign-up-htm {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  transition: all 0.4s linear;
}
.login-html .sign-in,
.login-html .sign-up,
.login-form .group .check {
  display: none;
}
.login-html .tab,
.login-form .group .label,
.login-form .group .button {
  text-transform: uppercase;
}
.login-html .tab {
  font-size: 22px;
  margin-right: 15px;
  padding-bottom: 5px;
  margin: 0 15px 10px 0;
  display: inline-block;
  border-bottom: 2px solid transparent;
}
.login-html .sign-in:checked + .tab,
.login-html .sign-up:checked + .tab {
  color: #fff;
  border-color: #1161ee;
}
.login-form {
  min-height: 345px;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
}
.login-form .group {
  margin-bottom: 15px;
}
.login-form .group .label,
.login-form .group .input,
.login-form .group .button {
  width: 100%;
  color: #fff;
  display: block;
}
.login-form .group .input,
.login-form .group .button {
  border: none;
  padding: 15px 20px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
}
.login-form .group input[data-type='password'] {
  //text-security: circle;
  -webkit-text-security: circle;
}
.login-form .group .label {
  color: #aaa;
  font-size: 12px;
}
.login-form .group .button {
  background: #1161ee;
}
.login-form .group label .icon {
  width: 15px;
  height: 15px;
  border-radius: 2px;
  position: relative;
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
}
.login-form .group label .icon:before,
.login-form .group label .icon:after {
  content: '';
  width: 10px;
  height: 2px;
  background: #fff;
  position: absolute;
  transition: all 0.2s ease-in-out 0s;
}
.login-form .group label .icon:before {
  left: 3px;
  width: 5px;
  bottom: 6px;
  transform: scale(0) rotate(0);
}
.login-form .group label .icon:after {
  top: 6px;
  right: 0;
  transform: scale(0) rotate(0);
}
.login-form .group .check:checked + label {
  color: #fff;
}
.login-form .group .check:checked + label .icon {
  background: #1161ee;
}
.login-form .group .check:checked + label .icon:before {
  transform: scale(1) rotate(45deg);
}
.login-form .group .check:checked + label .icon:after {
  transform: scale(1) rotate(-45deg);
}
.login-html
  .sign-in:checked
  + .tab
  + .sign-up
  + .tab
  + .login-form
  .sign-in-htm {
  transform: rotate(0);
}
.login-html .sign-up:checked + .tab + .login-form .sign-up-htm {
  transform: rotate(0);
}

.hr {
  height: 2px;
  margin: 60px 0 50px 0;
  background: rgba(255, 255, 255, 0.2);
}
.foot-lnk {
  text-align: center;
}
</style>
