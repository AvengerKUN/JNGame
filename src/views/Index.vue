<template>
  <div class="index">
    <div class="rooms">
      <div class="room" v-for="(item,index) in rooms" :key="index">
        <iframe src="http://192.168.2.227:7457/web-mobile/web-mobile/index.html" class="iframe"></iframe>
        <p class="tig">ID : {{item}}</p>
      </div>
    </div>
    <div class="control">
      <span>{{`CPU : ${info.cpu}% - RAM : ${info.ram}% - 服务器数量 : ${rooms.length}`}}</span>
    </div>
  </div>
</template>

<script>

  import {JGet} from "../axios";

  export default {
    name: "Index",
    data(){
      return{
        rooms:[],
        info:{
          cpu:100,
          ram:100
        },
        timer:{
          system:null,
          rooms:null,
        }
      }
    },
    mounted() {

      //创建任务定时器
      this.timer.system = setInterval(this.nSystemTimer.bind(this),1000);
      this.timer.rooms = setInterval(this.nRoomCreateTimer.bind(this),1000);

    },
    unmounted(){

      clearInterval(this.timer.system);
      clearInterval(this.timer.rooms);

    },
    methods:{

      //系统信息定时器
      async nSystemTimer(){
        Object.assign(this.info,(await JGet("/open/server")).data);
      },
      //任务创建定时器
      async nRoomCreateTimer(){

        let rooms = (await JGet("/open/cocos/state/room/list")).data;

        for (const key in rooms) {
          let roomId = rooms[key];
          if(this.rooms.indexOf(roomId) === -1){
            //创建房间
            this.rooms.push(roomId);
          }
        }

      }

    }
  }
</script>

<style scoped lang="scss">
  .rooms{
    width: 100vw;
    height: calc(100vh - 100px);
    overflow-y: scroll;
    overflow-x: hidden;
    .room{
      display: inline-block;
      .iframe{
        border: none;
        width: 400px;
        height: 200px;
        margin: 10px;
      }
      .tig{
        width: 400px;
        text-align: center;
        margin: 0 auto;
        font-size: 18px;
      }
    }
  }
  .control{
    width: 100vw;
    height: 100px;
    background-color: rgb(99,99,99);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #fff;
  }
</style>