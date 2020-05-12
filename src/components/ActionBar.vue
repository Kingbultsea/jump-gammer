<template>
    <div class='action-bar'>
        <div class="tool-out" @click="showArrow = !showArrow">
            {{showArrow ? '》' : '《'}}
        </div>
        <div v-show="showArrow" class="arrow-template">
            <div @click="ia('up')" class="arrow-btn">↑</div>
            <div @click="ia('down')" class="arrow-btn">↓</div>
            <div @click="ia('left')" class="arrow-btn">←</div>
            <div @click="ia('right')" class="arrow-btn">→</div>
        </div>
    </div>
</template>

<script lang="ts">
  import {Component, Vue, Emit} from 'vue-property-decorator'

  @Component({
    components: {},
  })
  export default class ActionBar extends Vue {
    private showArrow: boolean = true

    private ia(front: string = '') { // 无法使用Emit 使用Emit后 this 为null
      // @ts-ignore
      this.$parent.interactAction(front)
      // return front
    }
  }
</script>

<style scoped lang="scss">
    .action-bar {
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100vw;
        height: 90px;
        color: #fff;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        $hover-shadow: 0px 0px 8px 1px #fff;
        .arrow-template {
            display: flex;
            justify-content: center;
            align-items: center;
            $bw: 1px solid rgba(255, 255, 255, 0.4);
            margin-bottom: 10px;
            .arrow-btn:hover {
                box-shadow: $hover-shadow;
            }
            .arrow-btn {
                border: $bw;
                border-right: unset ;
                width: 50px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .arrow-btn:last-of-type {
                border-right: $bw;
            }
        }

        .tool-out {
            width: 10px;
            border-radius: 10px;
            transform: rotate(90deg);
            opacity: 0.3;
            margin-bottom: 5px;
        }
    }
</style>
