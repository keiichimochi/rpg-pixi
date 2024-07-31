// 戦闘システムの中核ロジック
// 戦闘システムのクラス
class BattleSystem {
    constructor(player, monster) {
        this.player = player;
        this.monster = monster;
        this.isBattleActive = true;
    }

    // 戦闘開始
    startBattle() {
        while (this.isBattleActive) {
            this.playerTurn();
            if (!this.isBattleActive) break;
            this.monsterTurn();
        }
        this.displayBattleResult();
    }

    // プレイヤーのターン
    playerTurn() {
        // コマンド選択のロジック
        // 例: たたかう、じゅもん、どうぐ、にげる
        // コマンド実行
        this.executeCommand('attack'); // 例として攻撃を実行
    }

    // モンスターのターン
    monsterTurn() {
        // モンスターの行動ロジック
        this.monster.attack(this.player);
        this.checkBattleStatus();
    }

    // コマンド実行
    executeCommand(command) {
        if (command === 'attack') {
            const damage = this.player.attack();
            this.monster.takeDamage(damage);
        }
        this.checkBattleStatus();
    }

    // 戦闘状況の確認
    checkBattleStatus() {
        if (this.player.hp <= 0) {
            this.isBattleActive = false; // ゲームオーバー
        } else if (this.monster.hp <= 0) {
            this.isBattleActive = false; // 勝利
        }
    }

    // 戦闘結果の表示
    displayBattleResult() {
        if (this.player.hp <= 0) {
            console.log("ゲームオーバー");
        } else {
            console.log("勝利!");
        }
    }
}