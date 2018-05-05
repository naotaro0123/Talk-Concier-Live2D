<template>
  <canvas id="glcanvas" class="glcanvas" ref="glcanvas"></canvas>
</template>

<script>
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines
let container
let Live2Dmodeler = []
let appUserId
let recognition
let nowRecognition = false
let inputText
let outputText

export default {
  name: 'Live2DView',
  mounted: function() {
    container = this.$refs.container
    // Live2Dモデルの生成
    this.create_Live2D(DEFINES.MODEL_PATH0, DEFINES.MODEL_JSON0,
      DEFINES.HARU_SUIT_SCALE, DEFINES.HARU_SUIT_POSX, DEFINES.HARU_SUIT_POSY)

    this.$store.watch(this.$store.getters.getAvatar, avatar => {
      this.change_Live2D(avatar)
    })
    this.$store.watch(this.$store.getters.getUserMessage, userMessage => {
      this.outputVoice(userMessage)
    })
    this.$store.watch(this.$store.getters.getInputVoice, inputVoice => {
      this.inputVoice(inputVoice)
    })
  },
  methods: {
    inputVoice(inputing){
      if(!inputing){
        recognition.stop()
        return
      }
      recognition = new webkitSpeechRecognition()
      // 言語指定
      recognition.lang = 'ja-JP'
      recognition.onresult = (e) => {
        if(e.results.length > 0){
          inputMsg.value = e.results[0][0].transcript
        }
      }
      recognition.start()
    },
    outputVoice(inputText){
      // Repl-AIからユーザID取得
      if(appUserId == null){
        this.get_ReplUserID(inputText)
      }else{
        // 2回目以降はユーザID必要なし
        this.start_Talk(inputText)
      }
    },
    get_ReplUserID(inputText){
      // リクエストボディ
      let JSONdata = {
        botId : DEFINES.BOT_ID,
      }
      this.postJson(DEFINES.USERID_REQUEST_URL, JSONdata, (json) => {
        if(typeof json.appUserId == "undefined"){
          appUserId = null
        }else{
          appUserId = json.appUserId
          this.start_Talk(inputText)
        }
      })
    },
    start_Talk(inputText){
      // リクエストボディ
      let JSONdata = {
        botId : DEFINES.BOT_ID,
        appUserId : appUserId,
        voiceText : inputText,
        initTalkingFlag : false,
        initTopicId : DEFINES.SCENARIO_ID,
      }
      this.postJson(DEFINES.TALK_REQUEST_URL, JSONdata, (json) => {
        if(typeof json.systemText.utterance == "undefined"){
          console.log("no data")
        }else{
          this.speechVoice(json.systemText.utterance)
        }
      })
    },
    stopVoice(){
      // ボイスを停止する
      speechSynthesis.cancel()
    },
    speechVoice(outputText){
      Live2Dmodeler[0].searchMotion(outputText)
      // ボイスを停止する
      speechSynthesis.cancel()
      // メッセージをチャットボードに追加
      this.$store.commit('changeAvatarMessage', outputText)

      let msg = new SpeechSynthesisUtterance()
      // 音量 min 0 ~ max 1
      msg.volume = 1
      // 速度 min 0 ~ max 10
      msg.rate = 1.2
      // 音程 min 0 ~ max 2
      msg.pitch = 1.5

      msg.text = outputText
      msg.lang = 'ja-JP'
      // speech開始
      msg.onstart = (event) => {
        speeching = true
      }
      // 終了した時の処理
      msg.onend = (event) => {
        speeching = false
      }
      // テキストスピーチ開始
      speechSynthesis.speak(msg)
    },
    postJson(url, param, callback) {
      let request = new XMLHttpRequest()
      request.open("POST", url)
      request.setRequestHeader("Content-Type", "application/json;")
      request.setRequestHeader("x-api-key", DEFINES.API_KEY)
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
          callback(JSON.parse(request.responseText))
        }
      }
      request.send(JSON.stringify(param))
    },
    create_Live2D(modelFilePath, modelFileJson, scale, posX, posY){
      Live2Dmodeler[0] = new Live2DRender(
        DEFINES.ROOT_PATH,
        DEFINES.KEYWORD_JSON,
        modelFilePath,
        modelFileJson,
        scale,
        posX,
        posY,
        DEFINES.CAN_ID,
        DEFINES.CAN_SIZE)
    },
    del_Live2D(){
      if(Live2Dmodeler[0]){
        Live2Dmodeler[0].cancelAnim()
        Live2Dmodeler[0].clear()
        delete Live2Dmodeler[0]
        // Live2D.deleteBuffer(0)
        // Live2D.frameBuffers.length = 0
      }
    },
    change_Live2DMotion(){
      Live2Dmodeler[0].setRandomMotion()
    },
    change_Live2D(avatar){
      this.del_Live2D()
      switch(avatar){
        case DEFINES.AVATAR_HARU_SUIT: // ハル（スーツ）
          this.create_Live2D(DEFINES.MODEL_PATH0, DEFINES.MODEL_JSON0,
            DEFINES.HARU_SUIT_SCALE, DEFINES.HARU_SUIT_POSX, DEFINES.HARU_SUIT_POSY)
          break
        case DEFINES.AVATAR_HARU_MEID: // ハル（メイド）
          this.create_Live2D(DEFINES.MODEL_PATH1, DEFINES.MODEL_JSON1,
            DEFINES.HARU_OTHER_SCALE, DEFINES.HARU_OTHER_POSX, DEFINES.HARU_OTHER_POSY)
          break
        case DEFINES.AVATAR_HARU_UNIFORM: // ハル（制服）
          this.create_Live2D(DEFINES.MODEL_PATH2, DEFINES.MODEL_JSON2,
            DEFINES.HARU_OTHER_SCALE, DEFINES.HARU_OTHER_POSX, DEFINES.HARU_OTHER_POSY)
          break
      }
    }
  }
}
</script>

<style scoped>
.glcanvas{
    position:absolute;
    top:10px;
    left:0;
    width:601px;
    height:878px;
    z-index: 3;
}
</style>
