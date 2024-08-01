export class Player {
    constructor(name, hp, atk) {
        this.name = name;
        this.hp = hp;
        this.atk = atk;
        this.sprite = new PIXI.Sprite();
        this.currentDirection = 'down';
        this.animationFrame = 0;
        this.animationSpeed = 500; // ミリ秒単位のアニメーション速度

        this.frames = {
            up: ['./assets/images/characters/main/u1.png', './assets/images/characters/main/u2.png'],
            down: ['./assets/images/characters/main/d1.png', './assets/images/characters/main/d2.png'],
            left: ['./assets/images/characters/main/l1.png', './assets/images/characters/main/l2.png'],
            right: ['./assets/images/characters/main/r1.png', './assets/images/characters/main/r2.png']
        };

        this.animationInterval = null;
    }

    initSprite(texturePath) {
        this.sprite.texture = PIXI.Texture.from(texturePath);
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // テクスチャのスケールモードを設定
    }

    setSize(width, height) {
        this.sprite.width = width;
        this.sprite.height = height;
    }

    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    startAnimation() {
        this.stopAnimation(); // 既存のアニメーションを停止

        this.animationInterval = setInterval(() => {
            this.animationFrame = (this.animationFrame + 1) % this.frames[this.currentDirection].length;
            this.updateSprite();
        }, this.animationSpeed);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    updateSprite() {
        const texturePath = this.frames[this.currentDirection][this.animationFrame];
        this.sprite.texture = PIXI.Texture.from(texturePath);
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // スケールモードを設定
    }
}