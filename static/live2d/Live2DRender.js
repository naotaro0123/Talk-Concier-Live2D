let speeching = false;

class Live2DRender
{
    constructor(rootPath, keywordJson, modelFilePath, modelFileJson, scale, posX, posY, can_id, can_size)
    {
        // Live2DモデルWebGL表示サイズ
        this._modelScale = scale;
        this._positionX  = posX;
        this._positionY = posY;
        // Live2Dモデルのインスタンス
        this._live2DModel = null;
        // アニメーションを停止するためのID
        this._requestID = null;
        // モデルのロードが完了したら true
        this._loadLive2DCompleted = false;
        // モデルの初期化が完了したら true
        this._initLive2DCompleted = false;
        // WebGL Image型オブジェクトの配列
        this._loadedImages = [];
        // モーション
        this._motions = [];
        this._motion_keys = [];
        // モーション管理マネジャー
        this._motionManager = null;
        // モーション番号
        this._motionNumber = 0;
        // モーションフラグ
        this._isMotionPlay = false;
        // Live2Dモデル設定
        this._modelDefine = null;
        // KeyWord設定
        this._keyWords = null;
        // 表情モーション
        this._expressions = [];
        // 表情モーション名
        this._expressionsNumber = [];
        // 表情モーション管理マネジャー
        this._expressionManager = null;
        // Live2Dモデルファイルパス
        this._modelFilePath = modelFilePath;
        // Live2Dモデルjson
        this._modelFileJson = modelFileJson;
        // フェードイン
        this._fadeines = [];
        // フェードアウト
        this._fadeoutes = [];
        // ポーズ
        this._pose = null;
        // 物理演算
        this._physics = null;
        // ドラッグによるアニメーション管理
        this._dragManager = null;        /*new L2DTargetPoint();*/
        this._viewMatrix = null;     /*new L2DViewMatrix();*/
        this._projMatrix = null;     /*new L2DMatrix44()*/
        this._deviceToScreen = null; /*new L2DMatrix44();*/
        this._isDraging = false;          // ドラッグ中かどうか
        this._lastMouseX = 0;
        this._lastMouseY = 0;
        this._dragX     = 0;
        this._dragY     = 0;

        // Live2Dの初期化
        Live2D.init();
        // Live2Dモデル管理クラスのインスタンス化
        this._live2DManager = new LAppLive2DManager();

        // canvasオブジェクトを取得
        this._canvas = document.getElementById(can_id);
        this._canvas.width = this._canvas.height = can_size;
        // コンテキストを失ったとき
        this._canvas.addEventListener("webglcontextlost", (e) => {
            console.error("context lost");
            this._loadLive2DCompleted = false;
            this._initLive2DCompleted = false;
            // アニメーションの停止
            this.cancelAnim();

            e.preventDefault();
        }, false);

        // コンテキストが復元されたとき
        this._canvas.addEventListener("webglcontextrestored" , (e) => {
            console.error("webglcontext restored");
            this.initLoadFile();
        }, false);

        //------------ WebGLの初期化 ------------
        this._gl = this.getWebGLContext();
        if (!this._gl) {
            console.error("Failed to create WebGL context.");
            return;
        }
        // Live2Dライブラリにglを渡す
        Live2D.setGL(this._gl);
        // model.jsonをロード(modelDefをセット)
        this.loadJson(this._modelFilePath + this._modelFileJson, 'model');
        // keyword.jsonをロード(keywordをセット)
        this.loadJson(rootPath + keywordJson, 'keyword');
        // マウスドラッグの座標設定
        this.setMouseView();

        // マウスドラッグのイベントリスナー
    //    canvas.addEventListener("mousedown", this.mouseEvent.bind(this), false);
    //    canvas.addEventListener("mousemove", this.mouseEvent.bind(this), false);
    //    canvas.addEventListener("mouseup", this.mouseEvent.bind(this), false);
    //    canvas.addEventListener("mouseout", this.mouseEvent.bind(this), false);

    //    canvas.addEventListener("touchstart", this.touchEvent.bind(this), false);
    //    canvas.addEventListener("touchend", this.touchEvent.bind(this), false);
    //    canvas.addEventListener("touchmove", this.touchEvent.bind(this), false);

        container.addEventListener("mousedown", this.mouseEvent.bind(this), false);
        container.addEventListener("mousemove", this.mouseEvent.bind(this), false);
        container.addEventListener("mouseup", this.mouseEvent.bind(this), false);
        container.addEventListener("mouseout", this.mouseEvent.bind(this), false);

        container.addEventListener("touchstart", this.touchEvent.bind(this), false);
        container.addEventListener("touchend", this.touchEvent.bind(this), false);
        container.addEventListener("touchmove", this.touchEvent.bind(this), false);
    }

    /*
     * Live2Dのドラッグ座標軸
     */
    setMouseView()
    {
        // 3Dバッファの初期化
        let width  = this._canvas.width;
        let height = this._canvas.height;
        // ビュー行列
        let ratio  = height / width;
        let left   = -1.0;
        let right  =  1.0;
        let bottom = -ratio;
        let top    = ratio;
        // ドラッグ用のクラス
        this._dragManager = new L2DTargetPoint();
        // Live2DのView座標クラス
        this._viewMatrix = new L2DViewMatrix();
        // デバイスに対応する画面の範囲。 Xの左端, Xの右端, Yの下端, Yの上端
        this._viewMatrix.setScreenRect(left, right, bottom, top);
        // デバイスに対応する画面の範囲。 Xの左端, Xの右端, Yの下端, Yの上端
        this._viewMatrix.setMaxScreenRect(-2.0, 2.0, -2.0, 2.0);
        this._viewMatrix.setMaxScale(2.0);
        this._viewMatrix.setMinScale(0.8);
        // Live2Dの座標系クラス
        this._projMatrix = new L2DMatrix44();
        this._projMatrix.multScale(1, (width / height));
        // マウス用スクリーン変換行列
        this._deviceToScreen = new L2DMatrix44();
        this._deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
        this._deviceToScreen.multScale(2 / width, -2 / width);
    }

    /*
     * ファイルロード
     */
    initLoadFile()
    {
        // mocファイルからLive2Dモデルのインスタンスを生成
        const modelBuffer = fetch(this._modelFilePath + this._modelDefine.model).then(res => {
            return res.arrayBuffer();
        }).then(arrayBuffer => {
            this._live2DModel = Live2DModelWebGL.loadModel(arrayBuffer);
        });

        // テクスチャの読み込み
        let texturePromise = [];
        for(let i = 0; i < this._modelDefine.textures.length; i++){
            texturePromise[i] = this.loadTextureImages(i);
        }

        // 全部テクスチャロードしたら次の処理へ
        Promise.all(texturePromise).then(() => {
            this.loadMotionFiles();
            this.loadExpressionFiles();
            // ポーズのロード(json内のposeがあるかチェック)
            if(this._modelDefine.pose !== void 0){
                this.loadBytes(this._modelFilePath + this._modelDefine.pose, (buf) => {
                    // ポースクラスのロード
                    this._pose = L2DPose.load(buf);
                });
            }
            // 物理演算のロード(json内のphysicsがあるかチェック)
            if(this._modelDefine.physics !== void 0){
                this.loadBytes(this._modelFilePath + this._modelDefine.physics, (buf) => {
                    // 物理演算クラスのロード
                    this._physics = L2DPhysics.load(buf);
                });
            }

            this.tick();
         });
    }

    /*
     * テクスチャを読み込みPromiseを返します。
     */
    loadTextureImages(i) {
        return new Promise((resolve, reject) => {
            this._loadedImages[i] = new Image();
            this._loadedImages[i].src = this._modelFilePath + this._modelDefine.textures[i];
            this._loadedImages[i].addEventListener('load', (e) => {
                resolve(this._loadedImages[i]);
            });
        });
    }

    /*
     * モーションを読み込みます
     */
    loadMotionFiles(){
        let mtn_keys = [];   // モーションキー配列
        let mtn_tag = 0;        // モーションタグ
        let mtn_num = 0;        // モーションカウント
        // keyを取得
        for(let key in this._modelDefine.motions){
            // moitons配下のキーを取得
            mtn_keys[mtn_tag] = key;
            // 読み込むモーションファイル数を取得
            mtn_num += this._modelDefine.motions[mtn_keys[mtn_tag]].length;
            mtn_tag++;
        }
        // モーションタグ分ループ
        for(var mtnkey in mtn_keys){
            // モーションを読み込む(motions配下のタグを読み込む)
            for(var j = 0; j < this._modelDefine.motions[mtn_keys[mtnkey]].length; j++){
                // モーションの数だけロード
                this.loadBytes(this._modelFilePath + this._modelDefine.motions[mtn_keys[mtnkey]][j].file, (buf) => {
                    this._motions.push(Live2DMotion.loadMotion(buf));
                });
                // フェードイン
                if(this._modelDefine.motions[mtn_keys[mtnkey]][j].fade_in == null){
                    this._fadeines.push("");
                }else{
                    this._fadeines.push(this._modelDefine.motions[mtn_keys[mtnkey]][j].fade_in);
                }
                // フェードアウト
                if(this._modelDefine.motions[mtn_keys[mtnkey]][j].fade_out == null){
                    this._fadeoutes.push("");
                }else{
                    this._fadeoutes.push(this._modelDefine.motions[mtn_keys[mtnkey]][j].fade_out);
                }
                // モーションキーも配列に格納
                this._motion_keys.push(mtn_keys[mtnkey]);
            }
        }
        // モーションマネジャーのインスタンス化
        this._motionManager = new L2DMotionManager();
    }

    /*
     * 表情モーションの読み込み
     */
    loadExpressionFiles() {
        let expressionName = [];   // 表情モーション名の配列
        let expressionFile = [];   // 表情モーションファイル名の配列

        // 表情のロード(json内にexpressionsがあるかチェック)
        if(this._modelDefine.expressions !== void 0){
            for(let i = 0; i < this._modelDefine.expressions.length; i++){
                // 表情モーション名の配列を取得
                expressionName[i] = this._modelDefine.expressions[i].name;
                expressionFile[i] = this._modelFilePath + this._modelDefine.expressions[i].file;
                // 表情ファイルをロード
                this.loadExpression(expressionName[i], expressionFile[i]);
            }
        }
        // 表情モーションマネージャーのインスタンス化
        this._expressionManager = new L2DMotionManager();
    }


    /*
     * ループ処理
     */
    tick()
    {
        this.draw(); // 1回分描画
        let requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
            this.requestID = requestAnimationFrame(this.tick.bind(this));
    }

    /*
     * 描画アニメーション停止
     */
    cancelAnim()
    {
        let cancelAnimationFrame =
            window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame;
        cancelAnimationFrame(this._requestID); //アニメーションを停止
    }

    /*
     * クリア処理
     */
    clear()
    {
        // 描画エリアをクリア
        this._gl.clearColor( 0.0 , 0.0 , 0.0 , 0.0 );
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    /*
     * 描画処理
     */
    draw()
    {
        this.clear();
        // Live2D初期化
        if( !this._live2DModel)
            return; //ロードが完了していないので何もしないで返る

        // ロード完了後に初回のみ初期化する
        if( !this._initLive2DCompleted ){
            this._initLive2DCompleted = true;

            // 画像からWebGLテクスチャを生成し、モデルに登録
            for( let i = 0; i < this._loadedImages.length; i++ ){
                //Image型オブジェクトからテクスチャを生成
                let texName = this.createTexture(this._loadedImages[i]);

                this._live2DModel.setTexture(i, texName); //モデルにテクスチャをセット
            }

            // テクスチャの元画像の参照をクリア
            this._loadedImages = null;

            // 描画してるLive2Dモデルのサイズを取得
            let height = this._live2DModel.getCanvasHeight();
            let width = this._live2DModel.getCanvasWidth();
            // Live2D用の行列定義
            let matrix = new L2DModelMatrix(width, height);
            // サイズ(幅)
            let scaleX = this._modelScale / width;
            let scaleY = -scaleX;
            let offsetX = 1.5;
            matrix.scale(scaleX * offsetX, scaleY);
            // ポジション(X, Y)
            matrix.setCenterPosition(this._positionX , this._positionY);
            // 配列をセット
            this._live2DModel.setMatrix(matrix.getArray());
        }

        // アイドルモーション以外の場合（フラグと優先度で判定する）
        if(this._isMotionPlay == true && this._motionManager.getCurrentPriority() == 0){
            // フェードインの設定
            this._motions[this._motionNumber].setFadeIn(this._fadeines[this._motionNumber]);
            // フェードアウトの設定
            this._motions[this._motionNumber].setFadeOut(this._fadeoutes[this._motionNumber]);
            // アイドルモーションよりも優先度を高く再生する
            this._motionManager.startMotion(this._motions[this._motionNumber], 1);
            this._isMotionPlay = false;
        }

        // モーションが終了していたらアイドルモーションの再生
        if(this._motions.length != 0 && this._motionManager.isFinished()){
            // アイドルモーションをセットする
            this.setRandomMotion();
            // フェードインの設定
            this._motions[this._motionNumber].setFadeIn(this._fadeines[this._motionNumber]);
            // フェードアウトの設定
            this._motions[this._motionNumber].setFadeOut(this._fadeoutes[this._motionNumber]);
            // 優先度は低めでモーション再生
            this._motionManager.startMotion(this._motions[this._motionNumber], 0);
        }

        // モーション指定されていない場合は何も再生しない
        if(this._motionNumber != null){
            // モーションパラメータの更新
            this._motionManager.updateParam(this._live2DModel);
        }

        // 表情でパラメータ更新（相対変化）
        if(this._expressionManager != null &&
            this._expressions != null &&
            !this._expressionManager.isFinished())
        {
            this._expressionManager.updateParam(this._live2DModel);
        }
        // ポーズパラメータの更新
        if(this._pose != null)this._pose.updateParam(this._live2DModel);

        // 物理演算パラメータの更新
        if(this._physics != null)this._physics.updateParam(this._live2DModel);

        // ドラッグ用パラメータの更新
        this._dragManager.update();
        this._dragX = this._dragManager.getX();
        this._dragY = this._dragManager.getY();
        this._live2DModel.setParamFloat("PARAM_ANGLE_X", this._dragX * 30);       // -30から30の値を加える
        this._live2DModel.setParamFloat("PARAM_ANGLE_Y", this._dragY * 30);
        // ドラッグによる体の向きの調整
        this._live2DModel.setParamFloat("PARAM_BODY_ANGLE_X", this._dragX*10);    // -10から10の値を加える
        // ドラッグによる目の向きの調整
        this._live2DModel.setParamFloat("PARAM_EYE_BALL_X", this._dragX);         // -1から1の値を加える
        this._live2DModel.setParamFloat("PARAM_EYE_BALL_Y", this._dragY);
        // キャラクターのパラメータを適当に更新
        let t = UtSystem.getTimeMSec() * 0.001 * 2 * Math.PI; //1秒ごとに2π(1周期)増える
        let cycle = 3.0; //パラメータが一周する時間(秒)

        // キャラクターのパラメータを適当に更新
        let speech = UtSystem.getUserTimeMSec() * 0.001 * 2 * Math.PI; //1秒ごとに2π(1周期)増える
        let paratime = 0.34; //パラメータが一周する時間(秒)

        // スピーチ中の口パク
        if(speeching){
            this._live2DModel.setParamFloat('PARAM_MOUTH_OPEN_Y', 1 * Math.sin(speech/paratime));
        }else{
            this._live2DModel.setParamFloat('PARAM_MOUTH_OPEN_Y', 0);
        }

        // Live2Dモデルを更新して描画
        this._live2DModel.update(); // 現在のパラメータに合わせて頂点等を計算
        this._live2DModel.draw();   // 描画
    }

    /*
     * マウスイベント
     */
    mouseEvent(e)
    {
        // 右クリック制御
        e.preventDefault();
        // マウスダウン時
        if (e.type == "mousedown") {
            // 左クリック以外なら処理を抜ける
            if("button" in e && e.button != 0) return;
            this.modelTurnHead(e);

    // マウス移動時
        } else if (e.type == "mousemove") {
            this.followPointer(e);

    // マウスアップ時
        } else if (e.type == "mouseup") {
            // 左クリック以外なら処理を抜ける
            if("button" in e && e.button != 0) return;
            if (this._isDraging){
                this._isDraging = false;
            }
            this._dragManager.setPoint(0, 0);

    // CANVAS外にマウスがいった時
        } else if (e.type == "mouseout") {
            if (this._isDraging)
            {
            this._isDraging = false;
            }
            this._dragManager.setPoint(0, 0);
        }
    }

    /*
     * タッチイベント
     */
    touchEvent(e)
    {
        // 右クリック制御
    //    e.preventDefault();
        let touch = e.touches[0];

        if (e.type == "touchstart") {
            if (e.touches.length == 1) this.modelTurnHead(touch);
            // onClick(touch);

        } else if (e.type == "touchmove") {
            this.followPointer(touch);

            if (e.touches.length == 2) {
                let touch1 = e.touches[0];
                let touch2 = e.touches[1];

                let currenLength = Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2);
                if (this.oldLength - currenLength < 0) modelScaling(1.025); // 上方向スクロール 拡大
                else modelScaling(0.975); // 下方向スクロール 縮小

                this.oldLength = currenLength;
            }

        } else if (e.type == "touchend") {
            this.lookFront();
        }
    }

    /*
     * 正面を向く
     */
    lookFront()
    {
        if (this._isDraging)
        {
            this._isDraging = false;
        }
        this._dragManager.setPoint(0, 0);
    }

    /*
    * クリックされた方向を向く
    * タップされた場所に応じてモーションを再生
    */
    modelTurnHead(e)
    {
        this._isDraging = true;
        let rect = e.target.getBoundingClientRect();

        let sx = this.transformScreenX(e.clientX - rect.left);
        let sy = this.transformScreenY(e.clientY - rect.top);
        let vx = this.transformViewX(e.clientX - rect.left);
        let vy = this.transformViewY(e.clientY - rect.top);

        this._lastMouseX = sx;
        this._lastMouseY = sy;
        this._dragManager.setPoint(vx, vy); // その方向を向く
    }

    /*
    * マウスを動かした時のイベント
    */
    followPointer(e)
    {
        let rect = e.target.getBoundingClientRect();
        let sx = this.transformScreenX(e.clientX - rect.left);
        let sy = this.transformScreenY(e.clientY - rect.top);
        let vx = this.transformViewX(e.clientX - rect.left);
        let vy = this.transformViewY(e.clientY - rect.top);

        if (this._isDraging)
        {
            this._lastMouseX = sx;
            this._lastMouseY = sy;
            this._dragManager.setPoint(vx, vy); // その方向を向く
        }
    }

    /*
    * 論理座標変換したView座標X
    */
    transformViewX(deviceX)
    {
        let screenX = this._deviceToScreen.transformX(deviceX);  // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformX(screenX);       // 拡大、縮小、移動後の値。
    }

    /*
    * 論理座標変換したView座標Y
    */
    transformViewY(deviceY)
    {
        let screenY = this._deviceToScreen.transformY(deviceY);  // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformY(screenY);       // 拡大、縮小、移動後の値。
    }

    /*
     * 論理座標変換したScreen座標X
     */
    transformScreenX(deviceX)
    {
        return this._deviceToScreen.transformX(deviceX);
    }

    /*
     * 論理座標変換したScreen座標Y
     */
    transformScreenY(deviceY)
    {
        return this._deviceToScreen.transformY(deviceY);
    }

    /*
     * WebGLのコンテキストを取得する
     */
    getWebGLContext()
    {
        let webglTypes = [ "webgl" , "experimental-webgl" , "webkit-3d" , "moz-webgl"];
        let options = {
            alpha : true,
            premultipliedAlpha : true
        };

        for( let i = 0; i < webglTypes.length; i++ ){
            try{
                let ctx = this._canvas.getContext( webglTypes[i], options );
                if( ctx ) return ctx;
            }
            catch(e){}
        }
        return null;
    }


    /*
     * Image型オブジェクトからテクスチャを生成
     */
    createTexture(image/*WebGL Image*/)
    {
        let texture = this._gl.createTexture(); //テクスチャオブジェクトを作成する
        if (!texture ){
            console.error("Failed to generate gl texture name.");
            return -1;
        }

        if(this._live2DModel.isPremultipliedAlpha() == false){
            // 乗算済アルファテクスチャ以外の場合
            this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        }
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, 1);	//imageを上下反転
        this._gl.activeTexture( this._gl.TEXTURE0 );
        this._gl.bindTexture( this._gl.TEXTURE_2D , texture );
        this._gl.texImage2D( this._gl.TEXTURE_2D , 0 , this._gl.RGBA , this._gl.RGBA , this._gl.UNSIGNED_BYTE , image);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR_MIPMAP_NEAREST);
        this._gl.generateMipmap(this._gl.TEXTURE_2D);
        this._gl.bindTexture( this._gl.TEXTURE_2D , null );

        return texture;
    }

    /*
     * ファイルをバイト配列としてロードする
     */
    loadBytes(path, callback)
    {
        let request = new XMLHttpRequest();
        request.open("GET", path , true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            switch( request.status ){
            case 200:
                callback( request.response );
                break;
            default:
                console.error( "Failed to load (" + request.status + ") : " + path );
                break;
            }
        }
        request.send(null);
    }

    /*
    * Jsonファイルをロードする
    */
    loadJson(jsonfile, type)
    {
        let request = new XMLHttpRequest();
        request.open("GET", jsonfile, true);
        request.onreadystatechange = () => {
            if(request.readyState == 4 && request.status == 200){
                if(type == 'model'){
                    // model.jsonから取得
                    this._modelDefine = JSON.parse(request.responseText);
                    // 初期化処理
                    this.initLoadFile();
                }else if(type == 'keyword'){
                    // keyword.jsonから取得
                    this._keyWords = JSON.parse(request.responseText);
                }
            }
        }
        request.send(null);
    }

    /*
     * 表情をロードする
     */
    loadExpression(expressionName, path)
    {
        this.loadBytes(path, (buf) => {
            this._expressionsNumber[this._expressionsNumber.length] = expressionName;
            this._expressions[this._expressions.length] = L2DExpressionMotion.loadJson(buf);
        });
    }

    /*
     * 表情を設定する
     */
    setExpression(expressionName)
    {
        let expressionNumber = 0;
        for(let i = 0; i < this._expressionsNumber.length; i++){
            if(expressionName == this._expressionsNumber[i]){
                break;
            }
            expressionNumber++;
        }
        let expression = this._expressions[expressionNumber];
        this._expressionManager.startMotion(expression, false);
    }

    /*
    * ランダム表情設定する
    */
    setRandomExpression()
    {
        // ランダム再生する
        let random = ~~(Math.random() * this._expressions.length);
        let expression = this._expressions[random];
        this._expressionManager.startMotion(expression, false);
    }

    /*
     * モーションを設定する
     */
    setMotion(motionName)
    {
        if(motionName == ""){
            this._motionNumber = null;
            return;
        }
        if(this._modelDefine == null)return;
        let motionNumber = 0;
        // ファイル名からファイル番号を取り出す
        for(let key in this._modelDefine.motions){
            for(let j = 0; j < this._modelDefine.motions[key].length; j++){
                // 余分なパスをカット
                let fileName = this._modelDefine.motions[key][j].file.split("/");
                if(motionName == fileName[1]){
                    break;
                }
                motionNumber++;
            }
        }
        this._motionNumber = motionNumber;
        this._isMotionPlay = true;
    }

    /*
    * ランダムモーション再生する
    */
    setRandomMotion(type)
    {
        if(this._modelDefine == null)return;
        // 全てのモーションからランダム再生
        this._motionNumber = ~~(Math.random() * this._motions.length);
        this._isMotionPlay = true;
    }

    /*
     * 再生するモーションを探す
     */
    searchMotion(talkword)
    {
        // jsonからtypeを取得し、typeの中の文言を取得
        for(let type in this._keyWords.keyword){
            let jsondata = this._keyWords.keyword[type];
            for(let i=0; i<jsondata.length; i++){
                // 返事ワードと一致するか
                if(talkword.indexOf(jsondata[i]) >= 0){
                    // typeの中からランダム再生する
                    this.setRandomMotion(type);
                    break;
                }
            }
        }
    }
}