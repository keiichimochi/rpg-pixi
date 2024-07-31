// プレイヤーキャラクタークラス
class Player {
    constructor(name, hp, attackPower) {
        this.name = name;
        this.hp = hp;
        this.attackPower = attackPower;
        this.sprite = null; // スプライトを保持するプロパティ
    }

    // スプライトの初期化
    initSprite(texturePath) {
        this.sprite = new PIXI.Sprite(PIXI.Texture.from(texturePath));
        this.sprite.anchor.set(0.5); // スプライトの中心を基準にする
        this.sprite.x = 400; // 初期X座標
        this.sprite.y = 300; // 初期Y座標
        this.sprite.scale.set(4); // スプライトのサイズを4倍に
    }

    // 攻撃メソッド
    attack() {
        return this.attackPower;
    }
}