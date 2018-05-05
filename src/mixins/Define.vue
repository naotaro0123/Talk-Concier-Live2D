<script>
const DEFINES = {
  // 通常_ボタンカラー(Live2Dとは)
  'COLOR_BLUE_LITE': 'rgba(132, 144, 187, 1.0)',
  // 押下_ボタンカラー(Live2Dとは)
  'COLOR_BLUE_DARK': 'rgba(125, 136, 172, 1.0)',
  // 通常_ボタンカラー(トークする)
  'COLOR_GREEN_LITE': 'rgba(126, 201, 170, 1.0)',
  // 押下_ボタンカラー(トークする)
  'COLOR_GREEN_DARK': 'rgba(120, 184, 158, 1.0)',
  // 通常_ボタンカラー(クレジット)
  'COLOR_ORANGE_LITE': 'rgba(240, 174, 128, 1.0)',
  // 押下_ボタンカラー(クレジット)
  'COLOR_ORANGE_DARK': 'rgba(217, 161, 122, 1.0)',
  'COLOR_NONE': 'none',

  // スーツハル
  'AVATAR_HARU_SUIT': 0,
  // メイドハル
  'AVATAR_HARU_MEID': 1,
  // 制服ハル
  'AVATAR_HARU_UNIFORM': 2,

  // スーツハルのスケール
  'HARU_SUIT_SCALE': 1.7,
  // スーツハルのPosX
  'HARU_SUIT_POSX': 0.0,
  // スーツハルのPosY
  'HARU_SUIT_POSY': -0.85,
  // スーツ以外のハルのスケール
  'HARU_OTHER_SCALE': 1.6,
  // スーツ以外のハルのPosX
  'HARU_OTHER_POSX': 0.0,
  // スーツ以外のハルのPosX
  'HARU_OTHER_POSY': -0.4,

  // ワイプ（縮小）
  'WIPE_SHRINK': 'shrink',
  // ワイプ（拡大）
  'WIPE_EXPAND': 'expand',
  // ワイプ（デフォルト）
  'WIPE_DEF': 'default',
  // アニメーション開始
  'ANIM_START': 'webkitAnimationStart',
  // アニメーション終了
  'ANIM_END': 'webkitAnimationEnd',
  // クリック処理
  'MOUSE_CLICK': 'click',
  // タッチ処理
//  'TOUCH_CLICK': 'touchstart',
  // タッチ処理
  'TOUCH_CLICK': 'click',
  // キープレス処理
  'KEY_PRESS': 'keypress',

  // キャラ表示UIアニメーション（隠す）
  'CHARAUI_ANIM_HIDE': 'charUI_hide',
  // キャラ表示UIアニメーション（表示する）
  'CHARAUI_ANIM_SHOW': 'charUI_show',
  // タイトルへ戻るUIアニメーション（隠す）
  'BACKTITLE_ANIM_HIDE': 'backTitle_hide',
  // タイトルへ戻るUIアニメーション（表示する）
  'BACKTITLE_ANIM_SHOW': 'backTitle_show',
  // マイクUIアニメーション（隠す）
  'MICUI_ANIM_HIDE': 'micUI_hide',
  // マイクUIアニメーション（表示する）
  'MICUI_ANIM_SHOW': 'micUI_show',
  // キーボードUIアニメーション（隠す）
  'KEYBORDUI_ANIM_HIDE': 'keybordUI_hide',
  // キーボードUIアニメーション（表示する）
  'KEYBORDUI_ANIM_SHOW': 'keybordUI_show',
  // フロントUIアニメーション（隠す）
  'FRONTUI_ANIM_HIDE': 'frontUI_hide',
  // フロントUIアニメーション（表示する）
  'FRONTUI_ANIM_SHOW': 'frontUI_show',
  // クレジットボタンアニメーション
  'CREDITBTN_ANIM_PUSH': 'creditBtn_push',
  // トークボタンアニメーション
  'TALKBTN_ANIM_PUSH': 'talkBtn_push',
  // Live2Dとはボタンアニメーション
  'WHATLIVE2DBTN_ANIM_PUSH': 'whatLive2DBtn_push',
  // 透明度フェードアウト
  'OPACITY_FADEOUT': 'opaCity_fadeout',
  // 透明度フェードイン
  'OPACITY_FADEIN': 'opaCity_fadein',

  // wipeを行う中心点
  'CLIP_CENTER': '50% 36%',
  // 隠す時のポジション(キャラチェンジ)
  'CHARAUI_HIDE_POS': -150,
  // 表示する時のポジション(キャラチェンジ)
  'CHARAUI_SHOW_POS': 0,
  // 隠す時のポジション(タイトルへ戻る)
  'BACKTITLE_HIDE_POS': -150,
  // 表示する時のポジション(タイトルへ戻る)
  'BACKTITLE_SHOW_POS': 0,
  // 隠す時のポジション(フロントUI)
  'FLONTUI_HIDE_POS': 900,
  // 表示する時のポジション(フロントUI)
  'FLONTUI_SHOW_POS': 525,
  'UI_SHOW_Z': 5,
  'UI_HIDE_Z': 0,
  // 隠す時のポジション(マイクUI)
  'MICUI_HIDE_POS': 500,
  // 表示する時のポジション(マイクUI)
  'MICUI_SHOW_POS': 326,
  // 隠す時のポジション(キーボードUI)
  'KEYBORDUI_HIDE_POS': 500,
  // 表示する時のポジション(キーボードUI)
  'KEYBORDUI_SHOW_POS': 345,
  // 非表示
  'OPACITY_ZERO': 0.0,
  // 表示
  'OPACITY_ONE': 1.0,

  // タイプ（初期画面）
  'TYPE_DEFAULT': 'init',
  // タイプ（Live2Dとは）
  'TYPE_WHATLIVE2D': 'whatlive2d',
  // タイプ（トークする）
  'TYPE_TALK': 'talk',
  // タイプ（クレジット）
  'TYPE_CREDIT': 'credit',
  // タイプ（リストメニュー開く）
  'TYPE_MENU_OPEN': 'listmenu_open',
  // タイプ（リストメニュー閉じる）
  'TYPE_MENU_CLOSE': 'listmenu_close',
  // タイプ（タイトルへ戻る）
  'TYPE_TITLE_BACK': 'title_back',
  // フロントUIのスライドスピード
  'SLIDE_SPEED': 0.8,

  // SVG最小のサイズ
  'SVG_MIN': 260,
  // SVG最大のサイズ
  'SVG_MAX': 1300,
  // SVGの線幅
  'SVG_STROKE_W': 14,
  // 最小の円サイズ
  'CIRCLE_MIN': 240,
  // 最大の円サイズ
  'CIRCLE_MAX': 1300,
  // アニメーションの秒数（s)
  'ANIM_DURATION': 1000,
  // アニメーションのイージング
  'ANIM_EASING': 'ease-in-out',
// ease: 開始と終了が滑らか、初期値
// linear: 一定
// ease-in: ゆっくり始まる
// ease-in-out: ゆっくり始まりゆっくり終わる

  // CanvasID
  'CAN_ID': 'glcanvas',
  // Canvasサイズ
  'CAN_SIZE': 512,
  // ユーザIDリクエストURL
  'USERID_REQUEST_URL': 'https://api.repl-ai.jp/v1/registration',
  // 対話リクエストURL
  'TALK_REQUEST_URL': 'https://api.repl-ai.jp/v1/dialogue',
  // ボットID
  'BOT_ID': 'aisattu',
  // Repl-AI API Key
  'API_KEY': 'xxxx',
  // シナリオID
  'SCENARIO_ID': 'xxxx',
  // キーワードファイル
  'ROOT_PATH': './static/live2d/assets/',
  'KEYWORD_JSON': 'keyword.json',
  // haruモデル（スーツ）
  'MODEL_PATH0': './static/live2d/assets/haru_uketuke/',
  'MODEL_JSON0': 'haru_model.json',
  // haruモデル（メイド）
  'MODEL_PATH1': './static/live2d/assets/haru_default/',
  'MODEL_JSON1': 'haru_01.model.json',
  // haruモデル（制服）
  'MODEL_PATH2': './static/live2d/assets/haru_default/',
  'MODEL_JSON2': 'haru_02.model.json',
}

export default {
  data () {
    return {
      defines: DEFINES
    }
  },
  methods:{
    cssAnim(dom, animName, duration, timing, delay){
      let animDelay = delay | 0
      dom.style.webkitAnimationName = animName
      dom.style.webkitAnimationDuration = duration + "ms"
      dom.style.webkitAnimationTimingFunction = timing
      dom.style.webkitAnimationDelay = animDelay + 's'
      // アニメーション終了時
      dom.addEventListener(DEFINES.ANIM_END, function(ev) {
        // 自身のイベントのみ。再度アニメーション再生できるようにクリアする
        if(ev.target === this) {
          dom.style.webkitAnimationName = ''
        }
      })
    },
    initValue(dom, stroke, fill, cx, cy, r, storokeWidth, btnAnimName, type){
      dom.style.stroke = stroke
      dom.style.fill = fill
      dom.style.cx = cx
      dom.style.cy = cy
      dom.style.r = r
      dom.style.strokeWidth = storokeWidth
      // アニメーション指定なしなら抜ける
      if(!btnAnimName) return
      // マウスクリック時
      dom.addEventListener(DEFINES.TOUCH_CLICK, () => {
        this.$emit('clickFromChild')
        // ボタンアニメーション再生
        this.cssAnim(dom, btnAnimName, DEFINES.ANIM_DURATION/3, DEFINES.ANIM_EASING)
      });
    }
  }
}
</script>

<style>
/* 背景円の縮小アニメーション(画像) */
@keyframes resizeAnim_shrink
{
    0%{
    clip-path: circle(1300px at 50% 36%);
    -webkit-clip-path: circle(1300px at 50% 36%);
    }
    100%{
    clip-path: circle(240px at 50% 36%);
    -webkit-clip-path: circle(240px at 50% 36%);
    }
}
/* 背景円の拡大アニメーション(画像) */
@keyframes resizeAnim_expand
{
    0%{
    clip-path: circle(240px at 50% 36%);
    -webkit-clip-path: circle(240px at 50% 36%);
    }
    100%{
    clip-path: circle(1300px at 50% 36%);
    -webkit-clip-path: circle(1300px at 50% 36%);
    }
}
/* 背景SVG円の縮小アニメーション */
@keyframes resizeSvg_shrink
{
    0%{r:1300;}
    100%{r:260;}
}
/* 背景SVG円の拡大アニメーション */
@keyframes resizeSvg_expand
{
    0%{r:260;}
    100%{r:1300;}
}
/* ボタン押下アニメーション（Live2Dとは） */
@keyframes whatLive2DBtn_push
{
    0%{stroke:rgba(132, 144, 187, 1.0);r:60;}
    50%{stroke:rgba(125, 136, 172, 1.0);r:66;}
    100%{stroke:rgba(132, 144, 187, 1.0);r:60;}
}
/* ボタン押下アニメーション（トークする） */
@keyframes talkBtn_push
{
    0%{stroke:rgba(126, 201, 170, 1.0);r:90;}
    50%{stroke:rgba(120, 184, 158, 1.0);r:96;}
    100%{stroke:rgba(126, 201, 170, 1.0);r:90;}
}
/* ボタン押下アニメーション（クレジット） */
@keyframes creditBtn_push
{
    0%{stroke:rgba(240, 174, 128, 1.0);r:60;}
    50%{stroke:rgba(217, 161, 122, 1.0);r:66;}
    100%{stroke:rgba(240, 174, 128, 1.0);r:60;}
}
/* フロントUIのアニメーション */
@keyframes frontUI_hide
{
    0%{top:525px;}
    100%{top:900px;}
}
@keyframes frontUI_show
{
    0%{top:900px;}
    100%{top:525px;}
}
/* 会話UI(マイク)のアニメーション */
@keyframes micUI_hide
{
    0%{top:326px;}
    100%{top:500px;}
}
@keyframes micUI_show
{
    0%{top:500px;}
    100%{top:326px;}
}
/* 会話UI(キーボード)のアニメーション */
@keyframes keybordUI_hide
{
    0%{top:348px;}
    100%{top:500px;}
}
@keyframes keybordUI_show
{
    0%{top:500px;}
    100%{top:348px;}
}
/* キャラチェンジのアニメーション */
@keyframes charUI_hide
{
    0%{top:0px;}
    100%{top:-150px;}
}
@keyframes charUI_show
{
    0%{top:-150px;}
    100%{top:0px;}
}
/* タイトルへ戻るのアニメーション */
@keyframes backTitle_hide
{
    0%{top:-5px;}
    100%{top:-150px;}
}
@keyframes backTitle_show
{
    0%{top:-150px;}
    100%{top:-5px;}
}
/* 透明度調整アニメーション */
@keyframes opaCity_fadein
{
    0%{opacity:0.0;}
    100%{opacity:1.0;}
}
@keyframes opaCity_fadeout
{
    0%{opacity:1.0;}
    100%{opacity:0.0;}
}
</style>