<template>
  <div id="app">
    <router-view/>
    <transition name="fade">
      <div class="globalTips" v-if="showGlobalTipsConfig.show" style="padding: 5px 10px 5px 10px;border-radius: 10px;background: rgba(0, 0, 0, 0.3);color: #fff;position:fixed;z-index: 999;
      width: max-content;top:20%;left:50%;transform: translateX(-50%) translateY(-50%);
      display: flex;justify-content: center;align-items: center">
        <img v-if="showGlobalTipsConfig.showVisualAvatar && showGlobalTipsConfig.role === 1" style="width: 40px" src="./views/Game/role_assest/201201-avatar.png"/>
        <img v-if="showGlobalTipsConfig.showVisualAvatar && showGlobalTipsConfig.role === 2" style="width: 40px" src="./views/Game/role_assest/204301-avatar.png"/>
        <img v-if="showGlobalTipsConfig.showVisualAvatar && showGlobalTipsConfig.role === 3" style="width: 40px" src="./views/Game/role_assest/206301-avatar.png"/>
        <img v-if="showGlobalTipsConfig.showVisualAvatar && showGlobalTipsConfig.role === 4" style="width: 40px" src="./views/Game/role_assest/211201-avatar.png"/>
        {{showGlobalTipsConfig.tips}}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  interface GlobalTipsConfigType { // 全局提示
    showVisualAvatar: boolean,
    role: role,
    tips: string,
    show: boolean,
    debounceFuncName: any
  }

  @Component({
    components: {},
  })
  export default class App extends Vue {
    private showGlobalTipsConfig: GlobalTipsConfigType = { // 全局提示
      showVisualAvatar: false,
      role: 1,
      tips: '',
      show: false,
      debounceFuncName: undefined,
    }

    private tips(desc: string, visual: boolean = false, role: role = 1) {
      if (visual) {
        this.showGlobalTipsConfig.showVisualAvatar = true
        this.showGlobalTipsConfig.role = role
      } else {
        this.showGlobalTipsConfig.showVisualAvatar = false
      }

      if (this.showGlobalTipsConfig.debounceFuncName !== undefined) {
        clearTimeout(this.showGlobalTipsConfig.debounceFuncName)
      }

      this.showGlobalTipsConfig.show = true
      this.showGlobalTipsConfig.tips = desc

      this.showGlobalTipsConfig.debounceFuncName = setTimeout(() => {
        this.showGlobalTipsConfig.show = false
      }, 2000)
    }
  }
</script>

<style lang="scss">
  #app {
    position: relative;
    background: #000;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
 * {
   padding: 0px;
   margin: 0px;
   font-family: happy;
 }
 @font-face {
   font-family: 'happy';
   src: url("./assets/happy.ttf");
 }
</style>
