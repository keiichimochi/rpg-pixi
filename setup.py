import os

# プロジェクトのルートディレクトリ
root_dir = "pixijs_rpg_game"

# ディレクトリ構造
directories = [
    "styles",
    "js",
    "js/battle",
    "js/utils",
    "assets",
    "assets/images",
    "assets/images/characters",
    "assets/images/monsters",
    "assets/images/ui",
    "assets/sounds"
]

# ファイル構造
files = {
    "index.html": """<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PixiJS RPG Battle</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <div id="game-container"></div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.7/pixi.min.js"></script>
    <script src="js/utils/assetLoader.js"></script>
    <script src="js/utils/eventHandler.js"></script>
    <script src="js/battle/character.js"></script>
    <script src="js/battle/monster.js"></script>
    <script src="js/battle/ui.js"></script>
    <script src="js/battle/battleSystem.js"></script>
    <script src="js/game.js"></script>
    <script src="js/main.js"></script>
</body>
</html>""",
    "styles/main.css": """body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
}

#game-container {
    width: 800px;
    height: 600px;
}""",
    "js/main.js": "// メインゲームの初期化と制御",
    "js/game.js": "// ゲームのメインロジック",
    "js/battle/battleSystem.js": "// 戦闘システムの中核ロジック",
    "js/battle/character.js": "// プレイヤーキャラクタークラス",
    "js/battle/monster.js": "// モンスタークラス",
    "js/battle/ui.js": "// 戦闘画面のUI管理",
    "js/utils/assetLoader.js": "// アセット読み込み用ユーティリティ",
    "js/utils/eventHandler.js": "// イベント処理用ユーティリティ"
}

# ディレクトリ作成
for directory in directories:
    os.makedirs(os.path.join(root_dir, directory), exist_ok=True)
    print(f"ディレクトリを作成しました: {directory}")

# ファイル作成
for file_path, content in files.items():
    full_path = os.path.join(root_dir, file_path)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"ファイルを作成しました: {file_path}")

print("プロジェクト構造の作成が完了しました。")
