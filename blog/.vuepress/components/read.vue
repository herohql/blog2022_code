<template>
  <div>
    <headphones-icon size="1.5x" class="custom-class icon" @click="read()" :class="{active:active}"></headphones-icon>
    <el-dialog
      title="是否需要朗读代码?"
      :visible.sync="dialogVisible"
      width="25%"
      :modal-append-to-body="false"
      @close="close()"
    >
      <div class="btns">
        <el-button @click="playWithCode()">需要</el-button>
        <el-button @click="playWithoutCode()">跳过代码</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>
import { HeadphonesIcon } from 'vue-feather-icons'
export default {
  name: '',
  data() { 
    return {
      key:'',
      active:false,
      speechInstance:null,
      voiceData:[],
      dialogVisible:false,
      contextWithoutCode:''
    }
  },
  props: {

  },
  components:{
    HeadphonesIcon
  },
  watch:{
    '$page.key':{
      handler(newValue, oldValue) {
      // console.log(newValue,oldValue)
       this.onCancle()
      },
      deep: true
    }
  },
  mounted() {
   
    let timer = setInterval(() => {
        if(!this.voiceData.length) {
            //获取语言包
            this.voiceData = this.getVoices();
        } else {
            clearInterval(timer);
        }
    }, 500);

    this.contextWithoutCode = this.$page.context.trim().replace(/`[\s\S]*?`/g,'代码部分省略')
    

  },
  methods:{
    read(){
     
      console.log(this.$page.context)
      if(!this.active){
        this.dialogVisible = true
      }else{
        this.onCancle()
      }
     
     
      
    },
    onSpeak (context) {
        this.speechInstance = new SpeechSynthesisUtterance();
        this.speechInstance.text = context?context:this.$page.context
        speechSynthesis.speak(this.speechInstance);

        //监听播放结束时间
        this.speechInstance.addEventListener('end',(e)=>{
          this.active = false
          console.log(e.elapsedTime)
        })
    },
    onCancle(){
      speechSynthesis.cancel()
    },
    onResume(){
      speechSynthesis.resume() //恢复暂停
    },
    onPause(){
      speechSynthesis.pause() //暂停
    },
    getVoices(){
      return speechSynthesis.getVoices()
    },
    playWithCode(){
      this.active = true
      this.onSpeak()
      this.dialogVisible = false
    },
    playWithoutCode(){
      this.active = true
      this.onSpeak(this.contextWithoutCode)
      this.dialogVisible = false
    },
    close(){
      console.log('close')
    }
  },
 }
</script>

<style scoped lang='stylus'>
.icon 
  vertical-align text-top
  cursor pointer
  color #4e4e4e
  &.active
    color #2cbb30
    animation colorChange 1s 0.1s linear infinite alternate
    -webkit-animation colorChange 1s 0.1s linear infinite alternate
    
@-webkit-keyframes colorChange {
  0%{
    color #2cbb30
  }
    
  100%{
    color #2580df
  }
}
@keyframes colorChange {
  0%{
    color #2cbb30
  }
    
  100%{
    color #2580df
  }
}
.dark .icon
  color #dadfe7

</style>