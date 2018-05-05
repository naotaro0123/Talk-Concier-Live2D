<template>
  <nav id="menuNav" ref="menuNav" v-show="$store.getters.scene === 'talk'">
    <div id="listMenu" ref="listMenu" class="listMenu listMenu-noselected" @click="clickListMenu"></div>
    <div id="charUI" ref="charUI" class="charUI">
      <!-- スーツハル -->
      <div id="haru_suit" ref="haru_suit" class="haru_suit haru_suit-selected" @click="clickHaruSuit"></div>
      <!-- 制服ハル -->
      <div id="haru_uniform" ref="haru_uniform" class="haru_uniform haru_uniform-noselected" @click="clickHaruUniform"></div>
      <!-- メイドハル -->
      <div id="haru_maid" ref="haru_maid" class="haru_maid haru_maid-noselected" @click="clickHaruMaid"></div>
    </div>
    <!-- タイトルへ戻る -->
    <div id="backTitle" class="backTitle" @click="changeTitleScene"></div>
  </nav>
</template>

<script>
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines
let listMenu
let listMenuStatus = false
let charUI
let haru_suit
let haru_maid
let haru_uniform

export default {
  name: 'AvatarSelectView',
  mixins: [ Define ],
  components: {
  },
  mounted: function() {
    //---------- メニューナビ ----------//
    let menuNav = this.$refs.menuNav
    menuNav.addEventListener(DEFINES.TOUCH_CLICK, (e) => {
        // テキストボックスのフォーカス外す
        inputMsg.blur()
        // キーボード入力UIをクリックした時は、LookAtさせない処理
        e.stopPropagation()
    })
    //---------- キャラチェンジメニュー ----------//
    charUI = this.$refs.charUI
    charUI.style.top = DEFINES.CHARAUI_HIDE_POS + "px"
    // アニメーション開始時
    charUI.addEventListener(DEFINES.ANIM_START, (ev) => {
        // 自身のイベントのみ。再度アニメーション再生できるようにクリアする
        if(ev.animationName == DEFINES.CHARAUI_ANIM_HIDE){
            charUI.style.top = DEFINES.CHARAUI_HIDE_POS + 'px'
        }else{
            charUI.style.top = DEFINES.CHARAUI_SHOW_POS + 'px'
        }
    })
    //---------- リストメニュー ----------//
    listMenu = this.$refs.listMenu
    //-------- スーツハルボタン ------------//
    haru_suit = this.$refs.haru_suit
    //-------- メイドハルボタン ------------//
    haru_maid = this.$refs.haru_maid
    //-------- 制服ハルボタン ------------//
    haru_uniform = this.$refs.haru_uniform
  },
  methods: {
    changeCharImg(num){
        switch(num){
            case 0: // ハル（スーツ）ボタン押下時
                haru_suit.className ='haru_suit haru_suit-selected'
                haru_maid.className ='haru_maid haru_maid-noselected'
                haru_uniform.className ='haru_uniform haru_uniform-noselected'
                break;
            case 1: // ハル（メイド）ボタン押下時
                haru_suit.className ='haru_suit haru_suit-noselected'
                haru_maid.className ='haru_maid haru_maid-selected'
                haru_uniform.className ='haru_uniform haru_uniform-noselected'
                break;
            case 2: // ハル（制服）ボタン押下時
                haru_suit.className ='haru_suit haru_suit-noselected'
                haru_maid.className ='haru_maid haru_maid-noselected'
                haru_uniform.className ='haru_uniform haru_uniform-selected'
                break;
            default:
                break;
        }
        this.$store.commit('changeAvatar', num)
    },
    changeTitleScene() {
        this.$store.commit('changeScene', DEFINES.TYPE_DEFAULT)
    },
    clickListMenu(){
        // テキストボックスのフォーカス外す
        inputMsg.blur()
        // リストメニュー
        if(listMenuStatus){
            listMenuStatus = false
            // キャラチェンジを隠すアニメーション再生
            this.cssAnim(charUI, DEFINES.CHARAUI_ANIM_HIDE, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
            // リストメニューをオープンアイコンにする
            listMenu.className ="listMenu listMenu-noselected"
        }else{
            listMenuStatus = true
            // キャラチェンジを表示するアニメーション再生
            this.cssAnim(charUI, DEFINES.CHARAUI_ANIM_SHOW, DEFINES.ANIM_DURATION/1.5, DEFINES.ANIM_EASING)
            // リストメニューをクローズアイコンにする
            listMenu.className ="listMenu listMenu-selected"
        }
    },
    clickHaruSuit(){
        this.changeCharImg(DEFINES.AVATAR_HARU_SUIT)
        this.$store.commit('changeAvatar', DEFINES.AVATAR_HARU_SUIT)
    },
    clickHaruMaid(){
        this.changeCharImg(DEFINES.AVATAR_HARU_MEID)
        this.$store.commit('changeAvatar', DEFINES.AVATAR_HARU_MEID)
    },
    clickHaruUniform(){
        this.changeCharImg(DEFINES.AVATAR_HARU_UNIFORM)
        this.$store.commit('changeAvatar', DEFINES.AVATAR_HARU_UNIFORM)
    }
  }
}
</script>

<style scoped>
/* リストメニューボタン */
.listMenu{
    background-size:34px;
    width:42px;
    height:38px;
    margin: 20px;
    position:absolute;
    top:0px;
    right:0px;
    z-index: 7;
}
.listMenu-noselected{
    background: url('../assets/images/Ikwd_UI-38.png') no-repeat;
}
.listMenu-selected{
    background: url('../assets/images/Ikwd_UI-37.png') no-repeat;
}
/* キャラ選択 */
.charUI{
    background: url('../assets/images/Ikwd_UI-17.png') no-repeat;
    width:401px;
    height:161px;
    position:absolute;
    top:0px;
    left:140px;
    z-index: 7;
    background-size:330px;
}
/* スーツハルボタン */
.haru_suit{
    width:74px;
    height:74px;
    margin: 5px;
    position:absolute;
    top:4px;
    left:20px;
    z-index: 7;
}
.haru_suit-noselected{
    background: url('../assets/images/Ikwd_UI-41.png') no-repeat;
}
.haru_suit-selected{
    background: url('../assets/images/Ikwd_UI-45.png') no-repeat;
}
/* 制服ハルボタン */
.haru_uniform{
    width:74px;
    height:74px;
    margin: 5px;
    position:absolute;
    top:4px;
    left:120px;
    z-index: 7;
}
.haru_uniform-noselected{
    background: url('../assets/images/Ikwd_UI-43.png') no-repeat;
}
.haru_uniform-selected{
    background: url('../assets/images/Ikwd_UI-44.png') no-repeat;
}
/* メイドハルボタン */
.haru_maid{
    width:74px;
    height:74px;
    margin: 5px;
    position:absolute;
    top:4px;
    left:220px;
    z-index: 7;
}
.haru_maid-noselected{
    background: url('../assets/images/Ikwd_UI-42.png') no-repeat;
}
.haru_maid-selected{
    background: url('../assets/images/Ikwd_UI-46.png') no-repeat;
}
/* タイトルへボタン */
.backTitle{
    background: url('../assets/images/Ikwd_UI-40.png') no-repeat;
    background-size:100px;
    width:101px;
    height:33px;
    margin: 20px;
    position:absolute;
    top:0px;
    left:0px;
    z-index: 7;
}
</style>
