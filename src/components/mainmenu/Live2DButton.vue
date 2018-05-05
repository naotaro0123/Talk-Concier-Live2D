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
  name: 'Live2DButton',
  components: {
    CircleSvg,
  },
  data() {
    return {
      positionX: 80,
      positionY: 280,
      type: DEFINES.TYPE_WHATLIVE2D,
      text: 'Live2D?',
      svgId: 'svgwhatLive2D',
      labelId: 'labelwhatLive2D'
    }
  }
}
</script>
