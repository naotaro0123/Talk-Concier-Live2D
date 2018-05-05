<template>
    <div class="talkUI">
        <!-- チャットボード -->
        <div id="chatBoard" class="chatBoard" ref="chatBoard">
            <div class="spacediv"></div>
        </div>

        <!-- キーボード入力UI -->
        <div id="keybordUI" class="keybordUI" ref="keybordUI">
            <!-- マイクボタン -->
            <div class="micImg" @click="micImgHidden"></div>
            <!-- 入力メッセージ -->
            <input type="text" id="inputMsg" class="inputMsg" ref="inputMsg" value="" placeholder="メッセージを入力して下さい"/>
            <!-- Sendボタン -->
            <div id="sendMsg" class="sendMsg" ref="sendMsg"></div>
        </div>

        <!-- マイク入力UI -->
        <div id="micUI" class="micUI" ref="micUI">
            <!-- キーボードボタン -->
            <div class="keybordImg" @click="keybordImgHidden"></div>
            <!-- マイク大ボタン -->
            <div id="micDaibtn" class="micDaibtn micDaibtnOff" ref="micDaibtn" @click="maicDaiInput"></div>
        </div>
    </div>
</template>

<script>
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines
let chatBoard
let keybordUI
let inputMsg
let sendMsg
let micUI
let micDaibtn
let micStatus = false

export default {
  name: 'TalkView',
  mixins: [ Define ],
  components: {
  },
  mounted: function() {

    chatBoard = this.$refs.chatBoard
    chatBoard.addEventListener(DEFINES.TOUCH_CLICK, (e) => {
        // テキストボックスのフォーカス外す
        inputMsg.blur()
        // チャットボードをクリックした時は、LookAtさせない処理
        e.stopPropagation()
    })

    keybordUI = this.$refs.keybordUI
    // アニメーション開始時
    keybordUI.addEventListener(DEFINES.ANIM_END, function(ev){
        if(ev.animationName === DEFINES.KEYBORDUI_ANIM_HIDE){
            keybordUI.style.opacity = DEFINES.OPACITY_ZERO
            keybordUI.style.zIndex = DEFINES.UI_HIDE_Z
        }
    })
    // アニメーション開始時
    keybordUI.addEventListener(DEFINES.ANIM_START, function(ev){
        // 自身のイベントのみ。再度アニメーション再生できるようにクリアする
        if(ev.target === this) {
            if(ev.animationName == DEFINES.KEYBORDUI_ANIM_SHOW){
                keybordUI.style.opacity = DEFINES.OPACITY_ONE
                keybordUI.style.zIndex = DEFINES.UI_SHOW_Z
            }
        }
    })
    keybordUI.addEventListener(DEFINES.TOUCH_CLICK, (e) => {
        // キーボード入力UIをクリックした時は、LookAtさせない処理
        e.stopPropagation()
    })

    inputMsg = this.$refs.inputMsg
    inputMsg.addEventListener(DEFINES.TOUCH_CLICK, function(){
        inputMsg.focus()
    })
    inputMsg.addEventListener(DEFINES.KEY_PRESS, (e) => {
        // エンターキー入力
        if(e.keyCode == 13){
            // メッセージ送信
            this.sendMessage()
        }
    })
    // フォーカスが外れた時
    inputMsg.addEventListener('blur', function(e){
        // スマホのみテキスト入力した場合、ずれるので対応
        document.body.scrollTop = '0px'
    })

    sendMsg = this.$refs.sendMsg
    // マウスクリック時
    sendMsg.addEventListener(DEFINES.TOUCH_CLICK, () => {
        // テキストボックスのフォーカス外す
        inputMsg.blur()
        // メッセージ送信
        this.sendMessage()
    })

    micUI = this.$refs.micUI
    // アニメーション終了時
    micUI.addEventListener(DEFINES.ANIM_END, function(ev){
        if(ev.animationName === DEFINES.MICUI_ANIM_HIDE){
            micUI.style.opacity = DEFINES.OPACITY_ZERO
            micUI.style.zIndex = DEFINES.UI_HIDE_Z
        }
    })
    // アニメーション開始時
    micUI.addEventListener(DEFINES.ANIM_START, function(ev){
        // 自身のイベントのみ。再度アニメーション再生できるようにクリアする
        if(ev.target === this) {
            if(ev.animationName == DEFINES.MICUI_ANIM_SHOW){
                micUI.style.opacity = DEFINES.OPACITY_ONE
                micUI.style.zIndex = DEFINES.UI_SHOW_Z
            }
        }
    })
    micUI.addEventListener(DEFINES.TOUCH_CLICK, function(e){
        // テキストボックスのフォーカス外す
        inputMsg.blur()
        // マイク入力UIをクリックした時は、LookAtさせない処理
        e.stopPropagation()
    })
    // 初期値
    micUI.style.opacity = DEFINES.OPACITY_ZERO

    this.$store.watch(this.$store.getters.getAvatarMessage, avatarMessage => {
      this.addMessage(avatarMessage, 'bot')
    })

    this.$store.watch(this.$store.getters.getScene, scene => {
      switch (scene) {
        case DEFINES.TYPE_TALK:
          chatBoard.style.opacity = DEFINES.OPACITY_ONE;
          break
        default:
          chatBoard.style.opacity = DEFINES.OPACITY_ZERO;
          break
      }
    })
  },
  methods: {
    sendMessage() {
        // メッセージが入力されていれば送る
        if(inputMsg.value.length != 0){
            // メッセージをチャットボードに追加
            this.addMessage(inputMsg.value, "user")
            // // メッセージ送信し、音声出力
            this.$store.commit('changeUserMessage', inputMsg.value)
            inputMsg.value = null
        }
    },
    addMessage(msg, speaker) {
        let p = document.createElement("p")
        p.classList.add("talktext")
        if (speaker === "user") {
            p.classList.add("text_gray")
        }else{
            p.classList.add("text_white")
        }
        p.innerHTML = msg

        let div = document.createElement("div")
        if (speaker === "user") {
            div.classList.add("arrow_box_right")
        } else {
            div.classList.add("arrow_box_left")
            // アイコン指定
            if(this.$store.getters.avatar == 0){
                // スーツハルアイコンにする
                div.classList.add("arrow_img_haru_suit")
                div.classList.add("arrow_box_haru_suit")
            }else if(this.$store.getters.avatar == 1){
                // メイドハルアイコンにする
                div.classList.add("arrow_img_haru_maid")
                div.classList.add("arrow_box_haru_maid")
            }else if(this.$store.getters.avatar == 2){
                // 制服ハルアイコンにする
                div.classList.add("arrow_img_haru_uni")
                div.classList.add("arrow_box_haru_uni")
            }
        }
        div.appendChild(p)
        chatBoard.appendChild(div)
        // スクロールバーを移動
        chatBoard.scrollTop = chatBoard.scrollHeight - chatBoard.clientHeight
    },
    micImgHidden(){
        // テキストボックスのフォーカス外す
        inputMsg.blur()
        // キーボード入力UIを隠すアニメーション再生
        this.cssAnim(keybordUI, DEFINES.KEYBORDUI_ANIM_HIDE, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
        // マイク入力UIを表示するアニメーション再生
        this.cssAnim(micUI, DEFINES.MICUI_ANIM_SHOW, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
    },
    keybordImgHidden(){
        // マイク入力UIを隠すアニメーション再生
        this.cssAnim(micUI, DEFINES.MICUI_ANIM_HIDE, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
        // キーボード入力UIを表示するアニメーション再生
        this.cssAnim(keybordUI, DEFINES.KEYBORDUI_ANIM_SHOW, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
    },
    maicDaiInput(){
        micDaibtn = this.$refs.micDaibtn
        if(!micStatus){
            // 音声入力する場合
            micDaibtn.className = 'micDaibtn micDaibtnOn'
            micStatus = true
            // 音声入力開始
            this.$store.commit('changeInputVoice', true)
            // メッセージ送信し、音声出力
            this.$store.commit('changeUserMessage', inputMsg.value)
        }else{
            // 音声終了した場合
            micDaibtn.className = 'micDaibtn micDaibtnOff'
            micStatus = false
            // 音声入力終了
            this.$store.commit('changeInputVoice', false)
            // // マイク入力UIを隠すアニメーション再生
            this.cssAnim(micUI, DEFINES.MICUI_ANIM_HIDE, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
            // // キーボード入力UIを表示するアニメーション再生
            this.cssAnim(keybordUI, DEFINES.KEYBORDUI_ANIM_SHOW, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
        }
    }
  }
}
</script>

<style>
.text_gray {
  color: #5d5b5b;
}
.text_white {
  color: #fff;
}
.talktext {
  font-size: 18px;
  line-height: 18.5px;
  padding:0px 2px 0px 2px;
}
/* 会話UIパーツ */
div.talkUI {
    position:absolute;
    z-index: 5;
    left:0;
    top:450px;
    width:601px;
    height:405px;
}
/* チャットボード */
div.chatBoard {
    position: absolute;
    top: 8px;
    /*height: 305px;*/
    height: 405px;
    width:570px;
    overflow-y: scroll;
    padding : 5px 15px;
    z-index:5;
}
div.chatBoard div {
    padding-left: 20px;
    padding-right: 20px;
}
/* 最後の要素の余白を開けることで入力UIの下からスライドできる */
.chatBoard div:last-child {
    margin-bottom: 80px;
}
.spacediv {
    margin-top: 260px;
}
.arrow_box_right {
  position: relative;
  max-width: 300px;
  min-height: 14px;
  height: auto;
  background: #fff;
  border-radius: 10px;
  /* padding: 2px 0px; */
  margin: 5px 90px 5px 145px;    /* 会話の左余白を調整 */
  overflow: visible;
  display: inline-block;
  float: right;
}
.arrow_box_right:after {
  left: 99%;
  top: 10px;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-color: rgba(67, 209, 114, 0);
  border-left-color: #fff;
  border-width: 10px;
  margin-top: 0px;
}
.arrow_box_right p{
  max-width: 320px;
  display: inline-block;
}
.arrow_box_left {
  position: relative;
  max-width: 290px;
  min-height: 14px;
  height: auto;
/*  background: #689eba;*/
  border-radius: 10px;
  padding: 2px 0px;
  margin: 5px 140px 5px 110px;    /* 会話の左余白を調整 */
  overflow: visible;
  display: inline-block;
}
.arrow_box_left:before{
    position: absolute;
    top:-10px;
    left:-100px;
    border: solid transparent;
    content: " ";
    height: 80px;
    width: 80px;
    background-size: 80px 80px;
}
.arrow_box_left:after {
  right: 99%;
  top: 10px;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-width: 10px;
  margin-top: 0px;
}
.arrow_box_left p{
  max-width: 300px;
  display: inline-block;
  word-break: break-all;
}

/* ハル（スーツ） */
.arrow_img_haru_suit{}
.arrow_img_haru_suit:before{
    background: url('../assets/images/Ikwd_UI-45.png') no-repeat;
}
.arrow_box_haru_suit{
  background: #7ec9aa;
}
.arrow_box_haru_suit:after{
  border-right-color: #7ec9aa;
}
/* ハル（メイド） */
.arrow_img_haru_maid{}
.arrow_img_haru_maid:before{
    background: url('../assets/images/Ikwd_UI-46.png') no-repeat;
}
.arrow_box_haru_maid{
  background: #8490bb;
}
.arrow_box_haru_maid:after{
  border-right-color: #8490bb;
}
/* ハル（制服） */
.arrow_img_haru_uni{}
.arrow_img_haru_uni:before{
    background: url('../assets/images/Ikwd_UI-44.png') no-repeat;
}
.arrow_box_haru_uni{
  background: #f0ae80;
}
.arrow_box_haru_uni:after{
  border-right-color: #f0ae80;
}
/* キーボード入力UIの背景画像 */
.keybordUI{
    position:absolute;
    top:348px;
    left:0;
    background: url('../assets/images/Ikwd_UI-20.png') no-repeat;
    width:601px;
    height:92px;
    background-size: 601px;
    z-index: 5;
}
/* キーボードボタン */
.keybordImg{
    position:absolute;
    top:75px;
    left:40px;
    background: url('../assets/images/Ikwd_UI-31.png') no-repeat;
    width:44px;
    height:30px;
    background-size:40px;
}
/* マイク大ボタン */
.micDaibtn{
    position:absolute;
    top:36px;
    left:155px;
    width:376px;
    height:73px;
}
.micDaibtnOff{
    background: url('../assets/images/Ikwd_UI-27.png') no-repeat;
    background-size: 290px;
}
.micDaibtnOn{
    background: url('../assets/images/Ikwd_UI-29.png') no-repeat;
    background-size: 290px;
}
/* マイクボタン */
.micImg{
    position:absolute;
    top:50px;
    left:46px;
    background: url('../assets/images/Ikwd_UI-32.png') no-repeat;
    width:30px;
    height:38px;
    background-size:22px;
}
/* 入力テキストボックス */
.inputMsg{
    position:absolute;
    top:44px;
    left:90px;
    width:410px;
    height:40px;
    font-size: 20px;
    background: transparent;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
/* 次へボタン */
.sendMsg{
    position:absolute;
    top:52px;
    left:530px;
    background: url('../assets/images/Ikwd_UI-30.png') no-repeat;
    width:30px;
    height:46px;
    background-size:20px;
}
/* マイク入力UIの画像 */
.micUI{
    background: url('../assets/images/Ikwd_UI-18.png') no-repeat;
    position:absolute;
    top:326px;
    left:0;
    width:601px;
    height:113px;
    background-size:601px;
    z-index:0;
    opacity: 0;
}
</style>