<template>
  <div>
    <!-- 背景円 -->
    <svg class="backSvg">
        <circle id="svgCircle" ref="svgCircle"></circle>
    </svg>
    <!-- 背景夜空 -->
    <div id="backImage" class="backImage" ref="backImage"></div>
    <!-- 背景画像 -->
    <div id="bkWhite" class="bkWhite"></div>
  </div>
</template>

<script>
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines
let backImage
let svgCircle
let svgVal = 0
let circleVal = 0

export default {
  name: 'BackImageView',
  mixins: [ Define ],
  mounted: function() {
    backImage = this.$refs.backImage
    // アニメーション開始時
    backImage.addEventListener(DEFINES.ANIM_START, () => {
        backImage.style.clipPath = 'circle(' + circleVal + 'px at ' + DEFINES.CLIP_CENTER + ')'
        backImage.style.webkitClipPath = 'circle(' + circleVal + 'px at ' + DEFINES.CLIP_CENTER + ')'
    })

    svgCircle = this.$refs.svgCircle
    // 初期値設定
    this.initValue(svgCircle, DEFINES.COLOR_GREEN_DARK, DEFINES.COLOR_NONE, 300, 500, 1300, DEFINES.SVG_STROKE_W)
    // アニメーション開始時
    svgCircle.addEventListener(DEFINES.ANIM_START, function(ev){
      // 自身のイベントのみ
      if(ev.target === this) {
          svgCircle.style.r = svgVal
      }
    })

    this.$store.watch(this.$store.getters.getScene, scene => {
      this.sceneChange(scene)
    })
  },
  methods: {
    sceneChange(scene) {
      switch (scene) {
        //---- 吹き出しをクリックした場合 ----//
        case DEFINES.TYPE_DEFAULT:
          // ワイプを縮小
          this.wipe(DEFINES.WIPE_SHRINK)
          // 円の色を変える
          svgCircle.style.stroke = DEFINES.COLOR_GREEN_LITE
          break
        //---- ボタン（クレジット） ----//
        case DEFINES.TYPE_CREDIT:
          // 円の色を変える
          svgCircle.style.stroke = DEFINES.COLOR_ORANGE_LITE
          break
        //---- ボタン（トークする） ----//
        case DEFINES.TYPE_TALK:
          // 円の色を変える
          svgCircle.style.stroke = DEFINES.COLOR_GREEN_LITE
          // ワイプを広げる
          this.wipe(DEFINES.WIPE_EXPAND)
          break
        //---- ボタン（Live2Dとは） ----//
        case DEFINES.TYPE_WHATLIVE2D:
          // 円の色を変える
          svgCircle.style.stroke = DEFINES.COLOR_BLUE_LITE
          break
        default:
          break
      }
    },
    wipe(scene){
      // 縮小
      if(scene === DEFINES.WIPE_SHRINK){
        // 背景画像のアニメーション再生
        circleVal = DEFINES.CIRCLE_MIN
        this.cssAnim(backImage, 'resizeAnim_shrink', DEFINES.ANIM_DURATION, DEFINES.ANIM_EASING)
        // SVGのアニメーション再生
        svgVal = DEFINES.SVG_MIN
        this.cssAnim(svgCircle, 'resizeSvg_shrink', DEFINES.ANIM_DURATION, DEFINES.ANIM_EASING)
      // 拡大
      }else if(scene === DEFINES.WIPE_EXPAND){
        // 背景画像のアニメーション再生
        circleVal = DEFINES.CIRCLE_MAX
        this.cssAnim(backImage, 'resizeAnim_expand', DEFINES.ANIM_DURATION, DEFINES.ANIM_EASING)
        // SVGのアニメーション再生
        svgVal = DEFINES.SVG_MAX
        this.cssAnim(svgCircle, 'resizeSvg_expand', DEFINES.ANIM_DURATION, DEFINES.ANIM_EASING)
      // デフォルト
      }else if(scene === DEFINES.WIPE_DEF){
          backImage.style.clipPath = ''
          backImage.style.webkitClipPath = ''
          svgCircle.style.r = DEFINES.SVG_MAX
      }
    }
  }
}
</script>

<style scoped>
/* 背景円 */
svg.backSvg{
    position:absolute;
    top:-180px;
    left:0;
    width:601px;
    height:890px;
}
.backImage {
    background: url('../assets/images/Ikwd_UI-08.png');
    background-size:cover;
    width:601px;
    height:890px;
    z-index: 3;
}
/* 背景画像 */
.bkWhite{
    position:absolute;
    top:0;
    left:0;
    background: url('../assets/images/Ikwd_UI-09.png');
    background-size:cover;
    width:601px;
    height:890px;
    z-index: -1;
}
</style>