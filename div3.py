import os
from PIL import Image
import numpy as np

def split_and_save_map_chips(image_path, output_dir):
    # 画像を開く
    with Image.open(image_path) as img:
        # RGBAモードに変換（アルファチャンネルがない場合はRGBモードになります）
        img = img.convert('RGBA')
        # NumPy配列に変換
        img_array = np.array(img)

    # 画像の寸法を取得
    height, width, channels = img_array.shape

    # チップのユニークさを追跡するための辞書
    unique_chips = {}

    # 16x16ピクセルごとに画像を分割
    for y in range(0, height, 16):
        for x in range(0, width, 16):
            # 16x16のチップを抽出
            chip = img_array[y:y+16, x:x+16]
            
            # チップのハッシュ値を計算（ユニーク性の確認用）
            chip_hash = hash(chip.tobytes())

            # このチップがまだ保存されていない場合
            if chip_hash not in unique_chips:
                # チップの種類を判断
                chip_type = classify_chip(chip)
                
                # ファイル名を生成
                filename = f"{chip_type}_{len(unique_chips):03d}.png"
                
                # チップを保存
                chip_image = Image.fromarray(chip)
                chip_image.save(os.path.join(output_dir, filename))
                
                # ユニークチップとして記録
                unique_chips[chip_hash] = filename

def classify_chip(chip):
    # RGBチャンネルの平均値を計算
    r_mean = np.mean(chip[:,:,0])
    g_mean = np.mean(chip[:,:,1])
    b_mean = np.mean(chip[:,:,2])
    
    # 青色が支配的な場合、海として分類
    if b_mean > r_mean and b_mean > g_mean and b_mean > 150:
        return "sea"
    
    # 緑色が支配的な場合、草原として分類
    elif g_mean > r_mean and g_mean > b_mean and g_mean > 150:
        return "grass"
    
    # 灰色や茶色の場合、城や山として分類
    elif abs(r_mean - g_mean) < 20 and abs(r_mean - b_mean) < 20 and r_mean < 150:
        return "castle_or_mountain"
    
    # その他の場合
    else:
        return "other"

# スクリプトの使用例
if __name__ == "__main__":
    input_image = "./pixijs_rpg_game/assets/images/characters/dq2charactor.png"
    output_directory = "./pixijs_rpg_game/assets/images/characters/dq2_chips"
    
    # 出力ディレクトリが存在しない場合は作成
    os.makedirs(output_directory, exist_ok=True)
    
    split_and_save_map_chips(input_image, output_directory)
    print("Map chips have been split and saved.")