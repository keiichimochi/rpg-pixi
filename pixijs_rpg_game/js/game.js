// フィールドを表示するためのコード
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window // ウィンドウサイズに合わせてリサイズ
});
document.getElementById('game-container').appendChild(app.view);

// タイルのサイズ
const tileSize = 16; // 元のタイルのサイズ（16x16ピクセル）
const scale = 4; // 拡大率
const rows = Math.ceil(window.innerHeight / (tileSize * scale)); // 縦のタイル数
const cols = Math.ceil(window.innerWidth / (tileSize * scale)); // 横のタイル数

// テクスチャの読み込み
const grassTexture = PIXI.Texture.from('./assets/images/rpg/map/dq2map/grass_1.png');

// タイルを敷き詰める
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const tile = new PIXI.Sprite(grassTexture);
        tile.x = col * tileSize * scale; // タイルのX座標
        tile.y = row * tileSize * scale; // タイルのY座標
        tile.width = tileSize * scale; // タイルの幅を拡大
        tile.height = tileSize * scale; // タイルの高さを拡大
        app.stage.addChild(tile);
    }
}

// プレイヤーの初期化
const player = new Player('勇者', 100, 20);
player.initSprite('./assets/images/characters/main/d1.png'); // 初期スプライトを設定
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
const movePlayer = (dx, dy, direction) => {
    player.sprite.x += dx;
    player.sprite.y += dy;
    player.sprite.texture = PIXI.Texture.from(frames[direction][currentFrame % frames[direction].length]);
};

// アニメーションの開始
const startAnimation = (direction) => {
    if (animationInterval) clearInterval(animationInterval); // 既存のアニメーションをクリア
    currentFrame = 0; // フレームをリセット
    animationInterval = setInterval(() => {
        currentFrame = (currentFrame + 1) % frames[direction].length; // フレームを切り替え
        player.sprite.texture = PIXI.Texture.from(frames[direction][currentFrame]); // スプライトのテクスチャを更新
    }, 500); // 0.5秒ごとに切り替え
};

// キー操作の設定
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -tileSize * scale, 'up');
            startAnimation('up');
            break;
        case 'ArrowDown':
            movePlayer(0, tileSize * scale, 'down');
            startAnimation('down');
            break;
        case 'ArrowLeft':
            movePlayer(-tileSize * scale, 0, 'left');
            startAnimation('left');
            break;
        case 'ArrowRight':
            movePlayer(tileSize * scale, 0, 'right');
            startAnimation('right');
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
createButton('↑', window.innerWidth - 100, window.innerHeight - 100, () => {
    movePlayer(0, -tileSize * scale, 'up');
    startAnimation('up');
});
createButton('↓', window.innerWidth - 100, window.innerHeight - 50, () => {
    movePlayer(0, tileSize * scale, 'down');
    startAnimation('down');
});
createButton('←', window.innerWidth - 150, window.innerHeight - 75, () => {
    movePlayer(-tileSize * scale, 0, 'left');
    startAnimation('left');
});
createButton('→', window.innerWidth - 50, window.innerHeight - 75, () => {
    movePlayer(tileSize * scale, 0, 'right');
    startAnimation('right');
});

// ウィンドウサイズ変更時のリサイズ処理
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    // タイルの再配置など必要に応じて追加処理を行う
});