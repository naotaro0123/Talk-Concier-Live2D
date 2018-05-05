<template>
  <g>
    <circle :id="svgId" :ref="svgId" @click="changeScene">
      {{ text }}
    </circle>
    <text :id="labelId" class="btnLabel" :x="positionX" :y="positionY" @click="changeScene">
      {{ text }}
    </text>
  </g>
</template>

<script>
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines

export default {
  name: 'CircleSvg',
  mixins: [ Define ],
  props: [
    'positionX',
    'positionY',
    'type',
    'text',
    'svgId',
    'labelId'
  ],
  mounted: function() {
    let circleSvg = this.$refs[this.svgId]

    switch (this.type) {
      case DEFINES.TYPE_CREDIT:
        // 初期値設定
        this.initValue(circleSvg, DEFINES.COLOR_ORANGE_LITE, DEFINES.COLOR_ORANGE_LITE, 480, 270, 60, DEFINES.SVG_STROKE_W, DEFINES.CREDITBTN_ANIM_PUSH, DEFINES.TYPE_CREDIT)
        break
      case DEFINES.TYPE_TALK:
        // 初期値設定(フロントUIは隠す)
        this.initValue(circleSvg, DEFINES.COLOR_GREEN_LITE, DEFINES.COLOR_GREEN_LITE, 300, 170, 90, DEFINES.SVG_STROKE_W, DEFINES.TALKBTN_ANIM_PUSH, DEFINES.TYPE_TALK);
        break
      case DEFINES.TYPE_WHATLIVE2D:
        // 初期値設定
        this.initValue(circleSvg, DEFINES.COLOR_BLUE_LITE, DEFINES.COLOR_BLUE_LITE, 120, 270, 60, DEFINES.SVG_STROKE_W, DEFINES.WHATLIVE2DBTN_ANIM_PUSH, DEFINES.TYPE_WHATLIVE2D)
        break
      default:
        break
    }
  },
  methods: {
    changeScene(){
      this.$store.commit('changeScene', this.type)
    }
  }
}
</script>

<style>
/* UIボタン */
.btnLabel{
  font-size: 22px;
  fill:#FFF;            /* テキストの色 */
  stroke: #FFF;         /* ふちどりの色 */
  stroke-width: 1px;    /* ふちどりの太さ */
}
</style>