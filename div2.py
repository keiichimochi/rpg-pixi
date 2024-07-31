from PIL import Image
import os

def extract_monsters(input_path, output_dir):
    # 画像を開く
    with Image.open(input_path) as img:
        # 画像をRGBA形式に変換
        img = img.convert("RGBA")
        
        # 青色の背景を透明にする
        datas = img.getdata()
        newData = []
        for item in datas:
            # 青色の背景を透明にする（RGBが(0, 0, 255)に近い場合）
            if item[0] < 50 and item[1] < 50 and item[2] > 200:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        
        img.putdata(newData)
        
        # 画像を走査して個々のモンスターを見つける
        width, height = img.size
        visited = set()
        
        def flood_fill(x, y):
            stack = [(x, y)]
            monster_pixels = []
            
            while stack:
                px, py = stack.pop()
                if (px, py) in visited or px < 0 or px >= width or py < 0 or py >= height:
                    continue
                
                pixel = img.getpixel((px, py))
                if pixel[3] != 0:  # 透明でない場合
                    visited.add((px, py))
                    monster_pixels.append((px, py))
                    stack.extend([(px+1, py), (px-1, py), (px, py+1), (px, py-1)])
            
            return monster_pixels
        
        monster_count = 0
        for y in range(height):
            for x in range(width):
                if (x, y) not in visited and img.getpixel((x, y))[3] != 0:
                    monster_pixels = flood_fill(x, y)
                    if len(monster_pixels) > 10:  # 小さすぎる領域は無視
                        monster_count += 1
                        # モンスターの領域を切り出す
                        min_x = min(p[0] for p in monster_pixels)
                        max_x = max(p[0] for p in monster_pixels)
                        min_y = min(p[1] for p in monster_pixels)
                        max_y = max(p[1] for p in monster_pixels)
                        
                        monster_img = img.crop((min_x, min_y, max_x+1, max_y+1))
                        monster_img.save(os.path.join(output_dir, f'monster_{monster_count}.png'))

    print(f'{monster_count}個のモンスター画像を抽出しました。')

# メイン処理
def process_image(input_path, output_dir):
    # 入力ファイルの拡張子を取得
    _, ext = os.path.splitext(input_path)
    ext = ext.lower()

    if ext in ['.png', '.jpg', '.jpeg', '.gif']:
        os.makedirs(output_dir, exist_ok=True)
        extract_monsters(input_path, output_dir)
    else:
        print(f"サポートされていないファイル形式です: {ext}")

# 使用例
input_path = './pixijs_rpg_game/assets/images/monsters/monsters.png'  # .png, .jpg, .jpeg, .gif のいずれかに変更可能
output_dir = './pixijs_rpg_game/assets/images/monsters/extracted'

process_image(input_path, output_dir)
