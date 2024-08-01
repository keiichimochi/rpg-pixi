import { Player } from './utils/assetLoader.js';

export function initializeGame() {
    const PIXI = window.PIXI;

    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resizeTo: window // ウィンドウサイズに合わせてリサイズ
    });
    document.getElementById('game-container').appendChild(app.view);

    const tileSize = 64; // タイルのサイズを4倍に設定

    // マップデータを読み込む
    fetch('./assets/images/map/dataset/map0.json')
        .then(response => response.json())
        .then(data => {
            // マップを表示する関数を呼び出す
            displayMap(data, app);
        })
        .catch(error => {
            console.error('Error loading map:', error);
        });

    // マップを表示する関数
    function displayMap(mapData, app) {
        mapData.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                const texturePath = mapData.tileSet[tile.tile];
                const texture = PIXI.Texture.from(texturePath);

                texture.baseTexture.on('loaded', () => {
                    const sprite = new PIXI.Sprite(texture);
                    sprite.x = x * tileSize;
                    sprite.y = y * tileSize;
                    sprite.width = tileSize;
                    sprite.height = tileSize;
                    app.stage.addChild(sprite);

                    // 衝突判定を表示（デバッグ用）
                    if (tile.collision) {
                        const collisionOverlay = new PIXI.Graphics();
                        collisionOverlay.beginFill(0xff0000, 0.5); // 半透明の赤色
                        collisionOverlay.drawRect(sprite.x, sprite.y, tileSize, tileSize);
                        collisionOverlay.endFill();
                        app.stage.addChild(collisionOverlay);
                    }
                });

                texture.baseTexture.on('error', () => {
                    console.error('Failed to load texture:', texturePath);
                });
            });
        });

        // プレイヤーの初期化
        const player = new Player('勇者', 100, 20);
        player.initSprite('./assets/images/characters/main/d1.png'); // 初期スプライトを設定

        player.sprite.texture.baseTexture.on('loaded', () => {
            player.sprite.width = 16 * 4; // スプライトの幅を4倍に
            player.sprite.height = 16 * 4; // スプライトの高さを4倍に
            player.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // テクスチャのスケールモードを設定
            player.sprite.x = Math.floor(app.screen.width / 2 / tileSize) * tileSize; // プレイヤーの初期位置をタイルに合わせて調整
            player.sprite.y = Math.floor(app.screen.height / 2 / tileSize) * tileSize; // プレイヤーの初期位置をタイルに合わせて調整
            app.stage.addChild(player.sprite); // スプライトをステージに追加
        });

        player.sprite.texture.baseTexture.on('error', () => {
            console.error('Failed to load player texture:', './assets/images/characters/main/d1.png');
        });

        // スプライトのアニメーション
        let currentFrame = 0;
        let animationInterval; // アニメーションのインターバルID
        const frames = {
            up: ['./assets/images/characters/main/u1.png', './assets/images/characters/main/u2.png'],
            down: ['./assets/images/characters/main/d1.png', './assets/images/characters/main/d2.png'],
            left: ['./assets/images/characters/main/l1.png', './assets/images/characters/main/l2.png'],
            right: ['./assets/images/characters/main/r1.png', './assets/images/characters/main/r2.png']
        };

        // プレイヤーの移動
        let targetX = player.sprite.x;
        let targetY = player.sprite.y;
        const speed = 5; // 移動速度

        const movePlayer = (dx, dy, direction) => {
            targetX += dx; // ターゲットXを更新
            targetY += dy; // ターゲットYを更新
            player.sprite.texture = PIXI.Texture.from(frames[direction][0]); // すぐにスプライトを切り替え
            startAnimation(direction); // アニメーションを開始
        };

        // アニメーションの開始
        const startAnimation = (direction) => {
            if (animationInterval) clearInterval(animationInterval); // 既存のアニメーションをクリア
            currentFrame = 0; // フレームをリセット
            animationInterval = setInterval(() => {
                currentFrame = (currentFrame + 1) % frames[direction].length; // フレームを切り替え
                player.sprite.texture = PIXI.Texture.from(frames[direction][currentFrame]); // スプライトのテクスチャを更新
            }, 250); // 0.25秒ごとに切り替え
        };

        // 更新ループ
        const update = () => {
            if (Math.abs(player.sprite.x - targetX) > 1 || Math.abs(player.sprite.y - targetY) > 1) {
                // 目標位置に向かって移動
                player.sprite.x += (targetX - player.sprite.x) * 0.1; // 10%の距離を移動
                player.sprite.y += (targetY - player.sprite.y) * 0.1; // 10%の距離を移動
            }
            requestAnimationFrame(update); // 次のフレームをリクエスト
        };

        // キー操作の設定
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    movePlayer(0, -tileSize, 'up');
                    break;
                case 'ArrowDown':
                    movePlayer(0, tileSize, 'down');
                    break;
                case 'ArrowLeft':
                    movePlayer(-tileSize, 0, 'left');
                    break;
                case 'ArrowRight':
                    movePlayer(tileSize, 0, 'right');
                    break;
            }
        });

        // コントローラーの作成
        const createButton = (text, x, y, onClick) => {
            const button = new PIXI.Text(text, { fontSize: 32, fill: 0xffffff, fontWeight: 'bold' }); // 太字に設定
            button.interactive = true;
            button.buttonMode = true;
            button.x = x;
            button.y = y;
            button.on('pointerdown', onClick);
            app.stage.addChild(button);
            return button;
        };

        // コントローラーのボタンを作成（右下に配置）
        const buttonOffsetX = 20; // ボタンのオフセット
        const buttonOffsetY = 20; // ボタンのオフセット
        createButton('↑', window.innerWidth - 100 - buttonOffsetX, window.innerHeight - 100 - buttonOffsetY, () => {
            movePlayer(0, -tileSize, 'up');
        });
        createButton('↓', window.innerWidth - 100 - buttonOffsetX, window.innerHeight - 50 - buttonOffsetY, () => {
            movePlayer(0, tileSize, 'down');
        });
        createButton('←', window.innerWidth - 150 - buttonOffsetX, window.innerHeight - 75 - buttonOffsetY, () => {
            movePlayer(-tileSize, 0, 'left');
        });
        createButton('→', window.innerWidth - 50 - buttonOffsetX, window.innerHeight - 75 - buttonOffsetY, () => {
            movePlayer(tileSize, 0, 'right');
        });

        // 更新ループを開始
        update();

        // ウィンドウサイズ変更時のリサイズ処理
        window.addEventListener('resize', () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            // タイルの再配置など必要に応じて追加処理を行う
        });
    }
}