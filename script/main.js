const tl = require("@akashic-extension/akashic-timeline");

exports.main = (param) => {
    const game = g.game; // よくアクセスするため変数に保持しておく

    // オープニング用シーンの作成
    const openingScene = new g.Scene({
        game,
        assetPaths: [
            "/assets/opening/*"
        ],
    });
    openingScene.onLoad.addOnce(() => {
        const titleLogo = new g.Sprite({
            scene: openingScene,
            src: openingScene.asset.getImage("/assets/opening/title.png"),
            x: game.width / 2,
            y: game.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        openingScene.append(titleLogo);

        const descriptionLogo = new g.Sprite({
            scene: openingScene,
            src: openingScene.asset.getImage("/assets/opening/description.png"),
            x: game.width / 2,
            y: game.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
        });

        openingScene.setTimeout(() => {
            titleLogo.destroy();
            openingScene.append(descriptionLogo);
        }, 5000);

        openingScene.setTimeout(() => {
            game.replaceScene(scene);
        }, 12000);
    });
    game.pushScene(openingScene);

    const scene = new g.Scene({
        game,
        assetPaths: [
            "/assets/images/*",
            "/assets/se/*",
            "/assets/fonts/*",
        ],
    });
    const timeline = new tl.Timeline(scene);
    let time = 80; // 制限時間
    if (param.sessionParameter.totalTimeLimit) {
        time = param.sessionParameter.totalTimeLimit; // セッションパラメータで制限時間が指定されたらその値を使用
    }

    let combo = 0;

    // ニコ生ゲームのランキングモードでは g.game.vars.gameState.score の値がスコアとして扱われる
    game.vars.gameState = { score: 0 };
    scene.onLoad.add(() => {
        const seFinishAsset = scene.asset.getAudio("/assets/se/se_finish");
        const seFinish = game.audio.create(seFinishAsset);
        const sePicoAsset = scene.asset.getAudio("/assets/se/se_pico");
        const sePico = game.audio.create(sePicoAsset);

        // 背景を作成
        const background = new g.FilledRect({
            scene,
            cssColor: "#fff",
            x: 0,
            y: 0,
            width: game.width,
            height: game.height,
            opacity: 0.5, // 透過度 50% で表示
        });
        scene.append(background); // 背景をシーンに追加

        // スコア用のビットマップフォントの作成
        const font = new g.BitmapFont({
            scene,
            src: scene.asset.getImage("/assets/fonts/font-number.png"),
            glyphInfo: scene.asset.getJSONContent("/assets/fonts/font-number_glyphs.json"),
        });

        // スコア表示エンティティの作成
        const scoreLabel = new g.Label({
            scene,
            font,
            fontSize: font.size,
            text: `${game.vars.gameState.score}`,
            x: game.width - 100,
            y: 10,
            anchorX: 1.0,
            anchorY: 0,
        });
        scene.append(scoreLabel);

        // 残り時間 (合計時間から15秒の猶予を持たせる)
        let remainingTime = time - 20;

        // タイマー表示エンティティの作成
        const timerLabel = new g.Label({
            scene,
            font,
            fontSize: font.size,
            text: `${remainingTime}`,
            x: 100,
            y: 10,
            width: 140,
            anchorX: 0,
            anchorY: 0,
        });
        scene.append(timerLabel);

        const font1 = new g.BitmapFont({
            scene,
            src: scene.asset.getImage("/assets/fonts/font-number.png"),
            glyphInfo: scene.asset.getJSONContent("/assets/fonts/font-number_glyphs.json"),
        });

        // スコア表示エンティティの作成
        const comboLabel = new g.Label({
            scene,
            font,
            fontSize: font1.size,
            text: `${combo}`,
            x: game.width / 2,
            y: 10,
            anchorX: 1.0,
            anchorY: 0,
        });
        scene.append(comboLabel);

        // スコア表示を更新する
        function updateScoreLabel() {
            scoreLabel.text = `${game.vars.gameState.score}`;
            scoreLabel.invalidate();
        }

        // タイマー表示を更新する
        function updateTimer() {
            timerLabel.text = `${remainingTime}`;
            timerLabel.invalidate();
        }

        function updateComboLabel() {
            comboLabel.text = `${combo}`;
            comboLabel.invalidate();
        }

        var bu_ru = "/assets/images/pan_bour_bu-ru.png";
        var cheese_pan = "/assets/images/bread_cheese_pan.png";
        var yorkshire = "/assets/images/pan_yorkshire_pudding.png";
        var harinezumi = "/assets/images/pan_harinezumi.png";
        var choco_korone = "/assets/images/food_choco_korone.png";
        var shiopan = "/assets/images/pan_shiopan.png";
        var agepan = "/assets/images/pan_agepan.png";
        //const raisin_pan = "/assets/images/raisin_pan.png"
        var yakisobapan = "/assets/images/food_yakisobapan.png";
        //const bacon_epi = "/assets/images/pan_bacon_epi.png"
        //const maritozzo = "/assets/images/sweets_maritozzo.png"
        var kame_pan = "/assets/images/pan_kame.png";
        var fukidashi01 = "/assets/images/fukidashi_bw01.png";
        //const fukidashi02 = "/assets/images/fukidashi_bw02.png"
        var exclamation = "/assets/images/mark_exclamation.png";
        var pp_kmc = "/assets/images/pp_kmc.png";
        var pp_ribbon = "/assets/images/pp_ribbon.png";
        function generateKomeco() {
            var komeco = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(pp_kmc),
            x: game.width / 2 + 160,
            y: game.height / 2 + 50,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.75,
            scaleY: 0.75
        });
        scene.append(komeco);
        var ribbon = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(pp_ribbon),
            x: komeco.x - 20,
            y: komeco.y + 75,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.75,
            scaleY: 0.75
        });
        scene.append(ribbon);
        }
        function comboBoost() {
            var kame = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(kame_pan),
            x: game.width - game.width - 500,
            y: game.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.2,
            scaleY: 0.2
        });
            kame.touchable = true;
            kame.pointDown.add(function () {
            sePico.play();
            score = 100 + combo * 2;
            game.vars.gameState.score += score;
            combo++;
            if (combo < 50) {
                combo = 50;
            }
            updateScoreLabel();
            kame.destroy();
            updateComboLabel();
        });
            kame.onUpdate.add(function () {
            if (kame.x > g.game.width) {
                kame.destroy();
            }
            kame.x += 15;
            kame.modified();
        });
        scene.append(kame);
        var mark_exclamation = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(exclamation),
            x: game.width / 2 + 100 - 20,
            y: game.height / 2 - 50 - 20,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.3,
            scaleY: 0.3,
        });
        scene.append(mark_exclamation);
        scene.setTimeout(function () {
        mark_exclamation.destroy();
        }, 1000);
        }
        function generateFukidashi() {
            var fukidashi = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(fukidashi01),
            x: game.width / 2 - 20,
            y: game.height / 2 - 20,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.3,
            scaleY: 0.3
        });
        scene.append(fukidashi);
        }
        var score = 0;
        var need = null;
        if (need == null) {
        generateKomeco();
        scene.setTimeout(comboBoost, 42000);
        generateFukidashi();
        eatIWant();
        }
        function whatIWant(want) {
            generateFukidashi();
            var pan = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(want),
            x: game.width / 2 - 20,
            y: game.height / 2 - 15 - 20,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.25,
            scaleY: 0.25
        });
        scene.append(pan);
        }
        function eatIWant() {
            var rand = Math.floor(g.game.localRandom.generate() * 8);
            switch (rand) {
            case 0:
                whatIWant(bu_ru);
                need = bu_ru;
                break;
            case 1:
                whatIWant(cheese_pan);
                need = cheese_pan;
                break;
            case 2:
                whatIWant(yorkshire);
                need = yorkshire;
                break;
            case 3:
                whatIWant(harinezumi);
                need = harinezumi;
                break;
            case 4:
                whatIWant(choco_korone);
                need = choco_korone;
                break;
            case 5:
                whatIWant(shiopan);
                need = shiopan;
                break;
            case 6:
                whatIWant(agepan);
                need = agepan;
                break;
            case 7:
                whatIWant(yakisobapan);
                need = yakisobapan;
                break;
            }
        }
        function createBread(image, Y) {
            var bread = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(image),
            x: game.width - game.width - 200,
            y: Y,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.2,
            scaleY: 0.2
        });
        bread.touchable = true;
        bread.pointDown.add(function () {
            if (image == need) {
                sePico.play();
                score = 100 + combo * 2;
                game.vars.gameState.score += score;
                combo++;
                updateScoreLabel();
                bread.destroy();
                eatIWant();
            } else if (image != need) {
                combo = 0;
            }
            updateComboLabel();
        });
        bread.onUpdate.add(function () {
            if (remainingTime <= 0) {
                bread.touchable = false;
            }
          // 毎フレームで座標を確認し、画面外に出ていたらパンをシーンから取り除きます
            if (bread.x > g.game.width + 100) {
                bread.destroy();
            } // パンを右に動かし、パンの動きを表現します
            bread.x += 6;
          // 変更をゲームに通知します
            bread.modified();
        });
        scene.append(bread);
        }
        var createPan1 = function createPan1() {
            var random = Math.floor(g.game.localRandom.generate() * 4);
            switch (random) {
            case 0:
                createBread(bu_ru, 200);
                break;
            case 1:
                createBread(cheese_pan, 200);
                break;
            case 2:
                createBread(yorkshire, 200);
                break;
            case 3:
                createBread(harinezumi, 200);
                break;
            }
        };
        var createPan2 = function createPan2() {
            var random2 = Math.floor(g.game.localRandom.generate() * 4);
            switch (random2) {
            case 0:
                createBread(choco_korone, 550);
                break;
            case 1:
                createBread(shiopan, 550);
                break;
            case 2:
                createBread(agepan, 550);
                break;
            case 3:
                createBread(yakisobapan, 550);
                break;
            }
        };
        var generate1 = scene.setInterval(createPan1, 600);
        var generate2 = scene.setInterval(createPan2, 600);

        // 残り時間の更新
        const timer = scene.setInterval(() => {
            remainingTime--;
            if (remainingTime === 0) {
                scene.clearInterval(timer); // タイマーの停止
                scene.clearInterval(generate1);
                scene.clearInterval(generate2);
                // 終了ロゴを表示
                const finishLogo = new g.Sprite({
                    scene,
                    src: scene.asset.getImage("/assets/images/finish.png"),
                    x: game.width / 2,
                    y: game.height / 2,
                    anchorX: 0.5,
                    anchorY: 0.5,
                });

                scene.append(finishLogo);
                seFinish.play();

                // エンディングシーンへと遷移
                scene.setTimeout(() => {
                    game.replaceScene(endingScene);
                }, 3000);
            }
            updateTimer();
        }, 1000);

        let isStarted = false;
        scene.onPointUpCapture.add(() => {
            if (!isStarted) {
                isStarted = true;
            }
        });

    const endingScene = new g.Scene({
        game,
        assetPaths: [
            "/assets/fonts/*",
            "/assets/ending/*",
        ],
    });
    endingScene.onLoad.addOnce(() => {
        // スコア用フォントの作成
        const font = new g.BitmapFont({
            scene: endingScene,
            src: endingScene.asset.getImage("/assets/fonts/font-number-large.png"),
            glyphInfo: endingScene.asset.getJSONContent("/assets/fonts/font-number-large_glyphs.json"),
        });

        // スコア表示用のパネル表示
        const resultPanel = new g.Sprite({
            scene: endingScene,
            src: endingScene.asset.getImage("/assets/ending/result.png"),
            x: game.width / 2,
            y: game.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        endingScene.append(resultPanel);

        // スコア結果表示エンティティの作成
        const resultScoreLabel = new g.Label({
            scene: endingScene,
            font,
            fontSize: font.size,
            text: `${game.vars.gameState.score}`,
            x: resultPanel.x,
            y: resultPanel.y + 60,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        endingScene.append(resultScoreLabel);
    });
})}
