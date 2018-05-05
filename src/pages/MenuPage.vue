<template>
  <div id="container" class="container" ref="container">
    <avatar-select-view></avatar-select-view>
    <talk-view></talk-view>
    <message-image-view></message-image-view>
    <live2-d-view></live2-d-view>
    <main-menu-view></main-menu-view>
    <back-image-view></back-image-view>
  </div>
</template>

<script>
import AvatarSelectView from '@/views/AvatarSelectView'
import TalkView from '@/views/TalkView'
import Live2DView from '@/views/Live2DView'
import MessageImageView from '@/views/MessageImageView'
import MainMenuView from '@/views/MainMenuView'
import BackImageView from '@/views/BackImageView'
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines

export default {
  name: 'MenuPage',
  components: {
    AvatarSelectView,
    TalkView,
    Live2DView,
    MessageImageView,
    MainMenuView,
    BackImageView,
  },
  mounted: function() {
    this.$store.commit('changeScene', DEFINES.TYPE_DEFAULT)
  }
}
</script>

<style scoped>
.container{
    position: relative;
    width:601px;
    height:890px;
    overflow-y: hidden;
}
</style>