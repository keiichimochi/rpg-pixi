export class Player {
    constructor(name, hp, attack) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.sprite = null;
    }

    initSprite(imagePath) {
        this.sprite = PIXI.Sprite.from(imagePath);
        this.sprite.anchor.set(0.5); // スプライトの中心をアンカーに設定
    }
}