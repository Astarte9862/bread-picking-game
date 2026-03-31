const tl = require("@akashic-extension/akashic-timeline");

exports.main = (param) => {
    const game = g.game;

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
    let time = 80;
    if (param.sessionParameter.totalTimeLimit) {
        time = param.sessionParameter.totalTimeLimit;
    }

    let combo = 0;

    game.vars.gameState = { score: 0 };
    scene.onLoad.add(() => {
        const seFinishAsset = scene.asset.getAudio("/assets/se/se_finish");
        const seFinish = game.audio.create(seFinishAsset);
        const sePicoAsset = scene.asset.getAudio("/assets/se/se_pico");
        const sePico = game.audio.create(sePicoAsset);

        const background = new g.FilledRect({
            scene,
            cssColor: "#fff",
            x: 0,
            y: 0,
            width: game.width,
            height: game.height,
            opacity: 0.5,
        });
        scene.append(background);

        const font = new g.BitmapFont({
            scene,
            src: scene.asset.getImage("/assets/fonts/font-number.png"),
            glyphInfo: scene.asset.getJSONContent("/assets/fonts/font-number_glyphs.json"),
        });

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

        let remainingTime = time - 20;

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

        function updateScoreLabel() {
            scoreLabel.text = `${game.vars.gameState.score}`;
            scoreLabel.invalidate();
        }

        function updateTimer() {
            timerLabel.text = `${remainingTime}`;
            timerLabel.invalidate();
        }

        function updateComboLabel() {
            comboLabel.text = `${combo}`;
            comboLabel.invalidate();
        }

        const TOP_LANE_Y = 200;
        const BOTTOM_LANE_Y = 550;
        const BREAD_SPEED = 6;
        const BONUS_BREAD_SPEED = 15;
        const SPAWN_INTERVAL_MS = 600;
        const BONUS_SPAWN_TIME_MS = 42000;
        const EXCLAMATION_DISPLAY_MS = 1000;
        const FINISH_DELAY_MS = 3000;

        var breadRoll = "/assets/images/pan_bour_bu-ru.png";
        var cheeseBread = "/assets/images/bread_cheese_pan.png";
        var yorkshire = "/assets/images/pan_yorkshire_pudding.png";
        var hedgehogBread = "/assets/images/pan_harinezumi.png";
        var chocoKorone = "/assets/images/food_choco_korone.png";
        var saltBread = "/assets/images/pan_shiopan.png";
        var friedBread = "/assets/images/pan_agepan.png";
        //const raisin_pan = "/assets/images/raisin_pan.png"
        var yakisobaBread = "/assets/images/food_yakisobapan.png";
        //const bacon_epi = "/assets/images/pan_bacon_epi.png"
        //const maritozzo = "/assets/images/sweets_maritozzo.png"
        var bonusBreadImage = "/assets/images/pan_kame.png";
        var fukidashi01 = "/assets/images/fukidashi_bw01.png";
        //const fukidashi02 = "/assets/images/fukidashi_bw02.png"
        var exclamation = "/assets/images/mark_exclamation.png";

        function spawnBonusBread() {
            var bonusBread = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(bonusBreadImage),
            x: game.width - game.width - 500,
            y: game.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.2,
            scaleY: 0.2
        });
            bonusBread.touchable = true;
            bonusBread.pointDown.add(function () {
            sePico.play();
            score = 100 + combo * 2;
            game.vars.gameState.score += score;
            combo++;
            if (combo < 50) {
                combo = 50;
            }
            updateScoreLabel();
            bonusBread.destroy();
            updateComboLabel();
        });
            bonusBread.onUpdate.add(function () {
            if (bonusBread.x > g.game.width) {
                bonusBread.destroy();
            }
            bonusBread.x += BONUS_BREAD_SPEED;
            bonusBread.modified();
        });
        scene.append(bonusBread);

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
        }, EXCLAMATION_DISPLAY_MS);
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

        const topLaneBreads = [
            breadRoll,
            cheeseBread,
            yorkshire,
            hedgehogBread
        ];

        const bottomLaneBreads = [
            chocoKorone,
            saltBread,
            friedBread,
            yakisobaBread
        ];

        const allBreads = [
            ...topLaneBreads,
            ...bottomLaneBreads
        ];

        var score = 0;
        var targetBread = null;
        if (targetBread == null) {
        scene.setTimeout(spawnBonusBread, BONUS_SPAWN_TIME_MS);
        generateFukidashi();
        selectNextTargetBread();
        }

        function showTargetBread(image) {
            generateFukidashi();
            var pan = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(image),
            x: game.width / 2 - 20,
            y: game.height / 2 - 15 - 20,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.25,
            scaleY: 0.25
        });
        scene.append(pan);
        }

        function selectNextTargetBread() {
            const randomIndex = Math.floor(
                g.game.localRandom.generate() * allBreads.length
            );
            targetBread = allBreads[randomIndex];
            showTargetBread(targetBread);
        }

        function createBread(image, yPosition) {
            var bread = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage(image),
            x: game.width - game.width - 200,
            y: yPosition,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 0.2,
            scaleY: 0.2
        });
        bread.touchable = true;
        bread.pointDown.add(function () {
            if (image == targetBread) {
                sePico.play();
                score = 100 + combo * 2;
                game.vars.gameState.score += score;
                combo++;
                updateScoreLabel();
                bread.destroy();
                selectNextTargetBread();
            } else if (image != targetBread) {
                combo = 0;
            }
            updateComboLabel();
        });
        bread.onUpdate.add(function () {
            if (remainingTime <= 0) {
                bread.touchable = false;
            }
            if (bread.x > g.game.width + 100) {
                bread.destroy();
            }
            bread.x += BREAD_SPEED;
            bread.modified();
        });
        scene.append(bread);
        }

        var spawnTopLaneBread = function spawnTopLaneBread() {
            const randomIndex = Math.floor(
                g.game.localRandom.generate() * topLaneBreads.length
            );

            createBread(topLaneBreads[randomIndex], TOP_LANE_Y);
        }

        var spawnBottomLaneBread = function spawnBottomLaneBread() {
            const randomIndex = Math.floor(
                g.game.localRandom.generate() * bottomLaneBreads.length
            );

            createBread(bottomLaneBreads[randomIndex], BOTTOM_LANE_Y);
        }
        var generate1 = scene.setInterval(spawnTopLaneBread, SPAWN_INTERVAL_MS);
        var generate2 = scene.setInterval(spawnBottomLaneBread, SPAWN_INTERVAL_MS);

        const timer = scene.setInterval(() => {
            remainingTime--;
            if (remainingTime === 0) {
                scene.clearInterval(timer);
                scene.clearInterval(generate1);
                scene.clearInterval(generate2);
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

                scene.setTimeout(() => {
                    game.replaceScene(endingScene);
                }, FINISH_DELAY_MS);
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
        const font = new g.BitmapFont({
            scene: endingScene,
            src: endingScene.asset.getImage("/assets/fonts/font-number-large.png"),
            glyphInfo: endingScene.asset.getJSONContent("/assets/fonts/font-number-large_glyphs.json"),
        });

        const resultPanel = new g.Sprite({
            scene: endingScene,
            src: endingScene.asset.getImage("/assets/ending/result.png"),
            x: game.width / 2,
            y: game.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        endingScene.append(resultPanel);

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
