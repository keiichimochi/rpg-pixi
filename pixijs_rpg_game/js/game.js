import { Player } from './player.js';

export function initializeGame() {
    const PIXI = window.PIXI;

    const app = new PIXI.Application({
        width: 14 * 64, // 横14タイル分のサイズ
        height: 12 * 64, // 縦12タイル分のサイズ
        resizeTo: window // ウィンドウサイズに合わせてリサイズ
    });
    document.getElementById('game-container').appendChild(app.view);

    const tileSize = 64; // タイルのサイズを4倍に設定

    // プレイヤーの固定位置
    const playerFixedX = 7 * tileSize; // 横7タイル目
    const playerFixedY = 6 * tileSize; // 縦6タイル目

    let mapData;
    let player;
    let mapSprites = []; // マップスプライトの格納用
    let currentMapX = 0; // マップの表示開始X位置
    let currentMapY = 0; // マップの表示開始Y位置

    // サウンドの初期化
    const fieldSound = new Audio('./assets/sounds/field.mp3');
    fieldSound.loop = true; // ループ再生

    // プレイヤーの初期化
    function initPlayer() {
        player = new Player('勇者', 100, 20);
        player.initSprite(player.frames.down[0]); // 初期スプライトを設定

        player.sprite.texture.baseTexture.on('loaded', () => {
            player.setSize(16 * 4, 16 * 4); // スプライトのサイズを設定
            player.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // テクスチャのスケールモードを設定
            player.setPosition(playerFixedX, playerFixedY);
            app.stage.addChild(player.sprite); // スプライトをステージに追加
            player.startAnimation(); // プレイヤーのアニメーションを開始
            displayMap(); // マップの表示
            setupControls(); // キー操作の設定
            fieldSound.play(); // サウンドを再生
        });

        player.sprite.texture.baseTexture.on('error', () => {
            console.error('Failed to load player texture:', player.frames.down[0]);
        });
    }

    // マップデータを読み込む
    fetch('./assets/images/map/dataset/map0.json')
        .then(response => response.json())
        .then(data => {
            mapData = data;
            initPlayer();
        })
        .catch(error => {
            console.error('Error loading map:', error);
        });

    // マップを表示する関数
    function displayMap() {
        // 既存のマップスプライトを削除
        mapSprites.forEach(sprite => app.stage.removeChild(sprite));
        mapSprites = [];

        // マップを表示
        for (let y = 0; y < 12; y++) {
            for (let x = 0; x < 14; x++) {
                const mapX = currentMapX + x;
                const mapY = currentMapY + y;
                if (mapData.map[mapY] && mapData.map[mapY][mapX]) {
                    const tile = mapData.map[mapY][mapX];
                    const texturePath = mapData.tileSet[tile.tile];
                    const texture = PIXI.Texture.from(texturePath);

                    const sprite = new PIXI.Sprite(texture);
                    sprite.x = x * tileSize;
                    sprite.y = y * tileSize;
                    sprite.width = tileSize;
                    sprite.height = tileSize;
                    app.stage.addChild(sprite);
                    mapSprites.push(sprite);
                }
            }
        }

        // プレイヤーを再描画
        if (player && player.sprite) {
            app.stage.addChild(player.sprite);
        }
    }

    // キー操作の設定
    function setupControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    if (currentMapY > 0) {
                        player.currentDirection = 'up';
                        player.updateSprite(); // すぐにスプライトを切り替え
                        currentMapY--;
                        displayMap();
                    }
                    break;
                case 'ArrowDown':
                    if (currentMapY < mapData.map.length - 12) {
                        player.currentDirection = 'down';
                        player.updateSprite(); // すぐにスプライトを切り替え
                        currentMapY++;
                        displayMap();
                    }
                    break;
                case 'ArrowLeft':
                    if (currentMapX > 0) {
                        player.currentDirection = 'left';
                        player.updateSprite(); // すぐにスプライトを切り替え
                        currentMapX--;
                        displayMap();
                    }
                    break;
                case 'ArrowRight':
                    if (currentMapX < mapData.map[0].length - 14) {
                        player.currentDirection = 'right';
                        player.updateSprite(); // すぐにスプライトを切り替え
                        currentMapX++;
                        displayMap();
                    }
                    break;
            }
        });

        const musicControl = document.getElementById('music-control');
        musicControl.addEventListener('click', () => {
            if (fieldSound.paused) {
                fieldSound.play();
                musicControl.textContent = '音楽停止';
            } else {
                fieldSound.pause();
                musicControl.textContent = '音楽開始';
            }
        });
    }
}