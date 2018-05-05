<template>
    <circle-svg
     :positionX="positionX"
     :positionY="positionY"
     :type="type"
     :text="text"
     :svgId="svgId"
     :labelId="labelId"
    >
    </circle-svg>
</template>

<script>
import CircleSvg from '@/components/CircleSvg'
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines

export default {
  name: 'TalkButton',
  components: {
    CircleSvg,
  },
  data() {
    return {
      positionX: 240,
      positionY: 180,
      type: DEFINES.TYPE_TALK,
      text: 'トークする',
      svgId: 'svgTalk',
      labelId: 'labelTalk'
    }
  }
}
</script>
