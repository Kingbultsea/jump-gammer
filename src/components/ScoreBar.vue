<template>
    <div class='score-bar'>
        <div class="roles-template" v-show="show">
            <div class="role" v-for="(li, index) in rolesData" :key="index">
                <img v-if="li.role === 1" class="visual-avatar" src="../views/Game/role_assest/201201-avatar.png" />
                <img v-if="li.role === 2" class="visual-avatar" src="../views/Game/role_assest/204301-avatar.png" />
                <img v-if="li.role === 3" class="visual-avatar" src="../views/Game/role_assest/206301-avatar.png" />
                <img v-if="li.role === 4" class="visual-avatar" src="../views/Game/role_assest/211201-avatar.png" />
                <img class="avatar" :src="li.avatar"/>
                <p class="name">{{li.name}}</p>
                <p class="score">得分: {{li.score}}</p>
            </div>
        </div>

        <div class="tool-out" @click="show = !show">
            {{show ? '《' : '》'}}
        </div>

        <div class="score-template" v-show="showTemplate">
            <div class="score">
                <img class="score-bg" src="../assets/img/rankingBG.png"/>
                <div class="top-title">得分排行</div>
                <div class="content"><!-- .sort((a, b) => b.score - a.score) -->
                    <div v-for="(li, index) in sortRolesData(rolesData)" :key='index' style="display: flex;width: 100%;justify-content: space-around; align-items: center;">
                        <div class="user-avatar">
                            <img class="bg" v-if="index === 0" src="../assets/img/itemIconFrame10.png"/>
                            <img class="bg" v-if="index === 1" src="../assets/img/itemIconFrame9.png"/>
                            <img class="bg" v-if="index === 2" src="../assets/img/itemIconFrame8.png"/>
                            <img class="bg" v-if="index === 3" src="../assets/img/itemIconFrame7.png"/>
                            <img class="bg" v-if="index >= 4" src="../assets/img/itemIconFrame0.png"/>
                            <img class="avatar" :src="li.avatar"/>
                        </div>
                        <div class="name">{{li.name}}</div>
                        <!-- <div class="score"> </div> -->
                        <div class="win-rate">{{li.score}}</div>
                    </div>
                </div>
            </div>
            <div v-show="rolesData.length > 0">
                <div class="btn-enter" @click="showTemplate = false">确定</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import {Component, Vue, PropSync, Prop} from 'vue-property-decorator'

  @Component({
    components: {},
  })
  export default class ScoreBar extends Vue {
    @PropSync('cd', { type: Array }) private rolesData!: membersData[]
    // @PropSync('s', { type: Boolean }) private showTemplate!: boolean
    private showTemplate: boolean = false

    // private rolesData: any[] = [{
    //   name: '132',
    //   role: 1,
    //   avatar: 'https://res.psy-1.com/FskrtbwZ59DkAgSDSJPRUEuQXiqy',
    //   score: 0
    // }, {
    //   name: '132',
    //   role: 2,
    //   score: 0
    // }, {
    //   name: '132',
    //   role: 3,
    //   score: 0
    // }, {
    //   name: '132',
    //   role: 4,
    //   score: 0
    // }]

    private show: boolean = true

    private sortRolesData(data: membersData[]): membersData[] {
      const copy = JSON.parse(JSON.stringify(data)) as membersData[]
      return copy.sort((a, b) => b.score - a.score)
    }
  }
</script>

<style scoped lang="scss">
    .score-bar {
        z-index: 2;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100px;
        // box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 0.35);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .roles-template {
            display: flex;
            justify-content: center;
            align-items: center;
            color: rgb(255, 255, 255);
            margin-top: 20px;
            .role {
                width: 90px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                .visual-avatar {
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    width: 50px;
                }
                .avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 2px;
                    margin-bottom: 4px;
                }
                .name, .score {
                    font-size: 12px;
                    opacity: 0.6;
                    overflow: hidden;
                    max-width: 100%;
                }
            }
        }

        .tool-out {
            width: 10px;
            border-radius: 10px;
            transform: rotate(90deg);
            opacity: 1;
            color: rgba(255, 255, 255, 0.44);
        }
    }


    .score-template {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        color: #502813;
        position: fixed;
        left: 0px;
        top: 0px;
        z-index: 9999;
        opacity: 1;
        >.score {
            margin-top: 30px;
            width: 350px;
            height: 490px;
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: column;
            .score-bg {
                position: absolute;
                width: 100%;
                left: 0px;
                top: 0px;
            }
            .top-title {
                background: url("../assets/img/ParamaCell.png");
                background-size: 100% 100%;
                width: 80%;
                display: flex;
                justify-content: center;
                align-items: center;
                line-height: 10px;
                height: 40px;
                margin-top: 12px;
                position: relative;
                z-index: 1;
                font-size: 16px;
                color: #502813;
                padding-bottom: 2px;
            }
            .content {
                position: relative;
                z-index: 1;
                // background-color: red;
                height: 200px;
                width: 100%;
                color: #502813;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    >.bg {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0px;
                        top: 0px;
                    }
                    >.avatar {
                        width: 80%;
                        height: 80%;
                    }
                }
                .name {
                    overflow: hidden;
                    width: 90px;
                }
                .score, .win-rate {
                    width: 40px;
                }
                // .bottom-interval {
                //     top: 40px;
                //     position: absolute;
                //     width: 96%;
                // }
            }
        }
        .btn-enter {
            position: relative;
            top: -70px;
            background: url("../assets/img/specialResultFrame.png");
            background-size: 100% 100%;
            width: 100px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 15px;
            line-height: 15px;
        }
    }
</style>
