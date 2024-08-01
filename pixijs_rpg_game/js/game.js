// フィールドを表示するためのコード
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window // ウィンドウサイズに合わせてリサイズ
});
document.getElementById('game-container').appendChild(app.view);

// タイルのサイズ
const tileSize = 16 * 4; // 元のタイルのサイズ（16x16ピクセル）を3倍に
const scale = 16; // スプライトの拡大率
const rows = Math.ceil(window.innerHeight / (tileSize)); // 縦のタイル数
const cols = Math.ceil(window.innerWidth / (tileSize)); // 横のタイル数

// テクスチャの読み込み
const grassTexture = PIXI.Texture.from('./assets/images/rpg/map/dq2map/grass_1.png');

// タイルを敷き詰める
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const tile = new PIXI.Sprite(grassTexture);
        tile.x = col * tileSize; // タイルのX座標
        tile.y = row * tileSize; // タイルのY座標
        tile.width = tileSize; // タイルの幅を設定
        tile.height = tileSize; // タイルの高さを設定
        app.stage.addChild(tile);
    }
}

// プレイヤーの初期化
const player = new Player('勇者', 100, 20);
player.initSprite('./assets/images/characters/main/d1.png'); // 初期スプライトを設定
player.sprite.width *= scale; // スプライトの幅を3倍に
player.sprite.height *= scale; // スプライトの高さを3倍に
app.stage.addChild(player.sprite); // スプライトをステージに追加

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