<template>
  <div>
    <!-- クレジット -->
    <div class="creditImg" v-if="$store.getters.scene === 'credit'"></div>
    <!-- Live2D説明 -->
    <div class="whatLive2DImg" v-if="$store.getters.scene === 'whatlive2d'"></div>
    <!-- Let's Talkメッセージ -->
    <div class="msgSvg" v-if="$store.getters.scene === 'init'"></div>
  </div>
</template>

<script>
export default {
  name: 'MessageImageView'
}
</script>

<style scoped>
/* クレジット画像 */
.creditImg{
    position:absolute;
    top:105px;
    left:84px;
    width: 500px;
    height:500px;
    z-index: 4;
    background: url('../assets/images/Ikwd_UI-23.png') no-repeat;
    background-size:430px;
}
/* Live2D説明画像 */
.whatLive2DImg{
    position:absolute;
    top:178px;
    left:128px;
    width: 400px;
    height:280px;
    z-index: 4;
    background: url('../assets/images/Ikwd_UI-25.png') no-repeat;
    background-size:350px;
}
/* Let's Talkメッセージ */
.msgSvg{
    background: url('../assets/images/Ikwd_UI-26.png') no-repeat;
    background-size:160px;
    position:absolute;
    width:181px;
    height:92px;
    top:110px;
    left:220px;
    z-index: 3;
}
</style>
