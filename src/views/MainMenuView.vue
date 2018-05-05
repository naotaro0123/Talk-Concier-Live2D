<template>
  <div class="frontUI" ref="frontUI">
    <svg class="frontSvg">
      <live2-d-button></live2-d-button>
      <talk-button></talk-button>
      <credit-button></credit-button>
    </svg>
    <!-- 吹き出し -->
    <div class="frontImg"></div>
  </div>
</template>

<script>
import Live2DButton from '@/components/mainmenu/Live2DButton'
import TalkButton from '@/components/mainmenu/TalkButton'
import CreditButton from '@/components/mainmenu/CreditButton'
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines
let frontUI

export default {
  name: 'MainManuView',
  mixins: [ Define ],
  components: {
    TalkButton,
    Live2DButton,
    CreditButton
  },
  mounted: function() {
    frontUI = this.$refs.frontUI
    // アニメーション開始時
    frontUI.addEventListener(DEFINES.ANIM_START, function(ev) {
        // 自身のイベントのみ。再度アニメーション再生できるようにクリアする
        if(ev.target === this) {
            if(ev.animationName == DEFINES.FRONTUI_ANIM_SHOW){
                frontUI.style.opacity = DEFINES.OPACITY_ONE
                frontUI.style.zIndex = DEFINES.UI_SHOW_Z
            }
        }
    })
    frontUI.addEventListener(DEFINES.ANIM_END, function(ev) {
        // 自身のイベントのみ。再度アニメーション再生できるようにクリアする
        if(ev.target === this) {
            if(ev.animationName == DEFINES.FRONTUI_ANIM_HIDE){
                frontUI.style.opacity = DEFINES.OPACITY_ZERO
                frontUI.style.zIndex = DEFINES.UI_HIDE_Z
            }
        }
    })
    frontUI.addEventListener(DEFINES.TOUCH_CLICK, (e) => {
        // シーン切り替え
        // this.sceneChange(DEFINES.TYPE_DEFAULT);
        // フロントUIをクリックした時は、LookAtさせない処理
        e.stopPropagation()
    })

    this.$store.watch(this.$store.getters.getScene, scene => {
      this.playAnimation(scene)
    })
  },
  methods: {
    playAnimation(scene) {
      switch (scene) {
        //---- 吹き出しをクリックした場合 ----//
        case DEFINES.TYPE_DEFAULT:
          // フロントUIを表示するアニメーション再生
          this.cssAnim(frontUI, DEFINES.FRONTUI_ANIM_SHOW, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING);
          break
        //---- ボタン（トークする） ----//
        case DEFINES.TYPE_TALK:
          // フロントUIを隠すアニメーション再生
          this.cssAnim(frontUI, DEFINES.FRONTUI_ANIM_HIDE, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING, DEFINES.SLIDE_SPEED)
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
/* フロントUIパーツ */
.frontUI{
    position:absolute;
    z-index: 5;
    top:525px;
}
/* フロントUI */
svg.frontSvg{
    position:absolute;
    top:0;
    left:0;
    width:601px;
    height:366px;
}
/* 背景円 */
svg.backSvg{
    position:absolute;
    top:-180px;
    left:0;
    width:601px;
    height:890px;
}
/* Let's Talkメッセージ */
svg.msgSvg{
    position:absolute;
    top:110px;
    left:0;
    width:601px;
    height:110px;
    z-index: 3;
    opacity: 0;
}
/* フロントUI画像 */
.frontImg{
    background: url('../assets/images/Ikwd_UI-10.png') no-repeat;
    width:601px;
    height:364px;
    background-size:601px;
}
</style>