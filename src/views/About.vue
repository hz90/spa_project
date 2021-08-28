<template>
  <div class="about">
    <h1>This is an about page{{ msg }}</h1>
    <h1>{{ msg }}</h1>
    <h1>{{ getMsg + age }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class About extends Vue {
  private msg = '1test12xxxx';
  private age = 10;
  private get getMsg(): string {
    return 'getmsg11' + this.msg;
  }
  private test(): void {
    console.log('hello');
  }
}
</script>
