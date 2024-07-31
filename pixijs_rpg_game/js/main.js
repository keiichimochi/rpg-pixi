// メインゲームの初期化と制御
// メインゲームの初期化と制御

// 必要なモジュールのインポート
import { BattleSystem } from './battle/battleSystem.js';
import { Player } from './characters/player.js';
import { Monster } from './characters/monster.js';

// ゲームの初期化
function initGame() {
    const player = new Player('勇者', 100, 20); // プレイヤーの初期化
    const monster = new Monster('スライム', 50, 10); // モンスターの初期化

    const battleSystem = new BattleSystem(player, monster); // 戦闘システムの初期化
    battleSystem.startBattle(); // 戦闘開始
}

// ゲームを開始
initGame();