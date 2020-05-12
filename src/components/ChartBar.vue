<template>
    <div class='chart-bar'>
        <div class="chart-outer">
            <div class="chart-template" id="ct" v-show="show">
                <div class="chart-line" v-for="(li, index) in chart" :key="index">
                    <img :src="li.avatar"/>
                    <span style="font-size: 12px">{{li.name}}:</span>
                    {{li.msg}}
                </div>
            </div>
            <div class="input-template" v-show="show">
                <input v-model="msg"/><span style="transform: translateX(50%);" @click="sendMessage">确认</span>
            </div>
        </div>


        <div class="tool-out" @click="show = !show">
            {{show ? '《' : '》'}}
        </div>
    </div>
</template>

<script lang="ts">
  import {Component, PropSync, Vue, Watch} from 'vue-property-decorator'

  @Component({
    components: {},
  })
  export default class ChartBar extends Vue {
    @PropSync('cd', { type: Array }) private chart!: chartMsgType[]
    private show: boolean = true
    private msg: string = ''
    private lock: boolean = false

    @Watch('chart')
    private scrollToBottom() {
      setTimeout(() => {
        document.getElementById('ct')?.scrollTo(0, 99999)
      }, 1000)
    }

    private sendMessage() {
      if (this.lock) {
        return
      }

      this.lock = true
      window.$ws.send(JSON.stringify({
        from: 'client',
        data: {
          msg: this.msg,
          status: 11009,
        },
      }))
      this.msg = ''
      setTimeout(() => {
        this.lock = false
      }, 2000)
    }
  }
</script>

<style scoped lang="scss">
    .chart-bar {
        opacity: 0.7;
        border-radius: 4px;
        position: absolute;
        left: 0px;
        bottom: 120px;
        z-index: 1;
        display: flex;
        align-items: center;
        min-height: 120px;
        .chart-outer {
            box-sizing: border-box;
            padding: 10px;
            background: rgba(0, 0, 0, 0.6);
            .input-template {
                display: flex;
                color: #fff;
                input {
                    outline: none;
                    border: none;
                    color: #fff;
                    box-sizing: border-box;
                    padding: 0px 10px;
                    width: 80%;
                    background: rgba(255, 255, 255, 0.38);
                }
            }
        }
        .chart-template {
            font-size: 10px;
            height: 100%;
            overflow-y: scroll;
            min-width: 30px;
            .chart-line {
                line-height: 14px;
                max-height: 30px;
                overflow: hidden;
                img {
                    border-radius: 3px;
                    width: 14px;
                    height: 14px;
                }
                margin-bottom: 10px;
            }

            color: #fff;
            text-align: left;
            width: 300px;
            height: 120px;
            // box-shadow: 0px 0px 4px 4px rgba(255, 255, 255, 0.36);
        }

        .tool-out {
            width: 10px;
            border-radius: 10px;
            opacity: 1;
            color: rgba(255, 255, 255, 0.7);
            // margin-left: 20px;
        }
    }

</style>
