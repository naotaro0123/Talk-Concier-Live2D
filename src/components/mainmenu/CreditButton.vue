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
  name: 'CreditButton',
  components: {
    CircleSvg
  },
  data() {
    return {
      positionX: 422,
      positionY: 280,
      type: DEFINES.TYPE_CREDIT,
      text: 'クレジット',
      svgId: 'svgCredit',
      labelId: 'labelCredit'
    }
  }
}
</script>
