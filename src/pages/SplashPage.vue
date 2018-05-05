<template>
  <div @click="fadeoutLogo">
    <transition name="fadelogo">
      <div class="logo" v-if="show"></div>
    </transition>
    <back-image-view ></back-image-view>
  </div>
</template>

<script>
import BackImageView from '@/views/BackImageView'

export default {
  name: 'SplashPage',
  components: {
    BackImageView
  },
  data() {
    return {
      show: true
    }
  },
  methods:{
    fadeoutLogo(){
      this.show = false
      this.$router.push('/menu')
    }
  }
}
</script>

<style scoped>
.logo {
    background: url("../assets/images/Ikwd_UI-39.png") no-repeat;
    width:193px;
    height:301px;
    position:absolute;
    top:280px;
    left:200px;
    background-size:192px 301px;
    z-index: 4;
}
.fadelogo-enter-active, .fadelogo-leave-active {
  transition: opacity .2s;
}
.fadelogo-leave {
  opacity: 1;
}
.fadelogo-leave-to {
  opacity: 0;
}
</style>