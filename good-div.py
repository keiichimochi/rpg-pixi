from PIL import Image
import os

def extract_characters(input_path, output_dir, tile_size):
    # 画像を開く
    with Image.open(input_path) as img:
        # 背景色を透明にする
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # 背景色（例えば黄土色に近い色）を透明にする
            if item[0] > 150 and item[1] > 100 and item[2] < 50:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        
        img.putdata(newData)
        
        # 画像を走査して個々のキャラクターを見つける
        width, height = img.size
        visited = set()
        
        def flood_fill(x, y):
            stack = [(x, y)]
            character_pixels = []
            
            while stack:
                px, py = stack.pop()
                if (px, py) in visited or px < 0 or px >= width or py < 0 or py >= height:
                    continue
                
                pixel = img.getpixel((px, py))
                if pixel[3] != 0:  # 透明でない場合
                    visited.add((px, py))
                    character_pixels.append((px, py))
                    stack.extend([(px+1, py), (px-1, py), (px, py+1), (px, py-1)])
            
            return character_pixels
        
        character_count = 0
        for y in range(0, height, tile_size):
            for x in range(0, width, tile_size):
                if (x, y) not in visited and img.getpixel((x, y))[3] != 0:
                    character_pixels = flood_fill(x, y)
                    if len(character_pixels) > 10:  # 小さすぎる領域は無視
                        character_count += 1
                        # キャラクターの領域を切り出す
                        min_x = min(p[0] for p in character_pixels)
                        max_x = max(p[0] for p in character_pixels)
                        min_y = min(p[1] for p in character_pixels)
                        max_y = max(p[1] for p in character_pixels)
                        
                        character_img = img.crop((min_x, min_y, max_x+1, max_y+1))
                        character_img.save(os.path.join(output_dir, f'character_{character_count}.png'))

    print(f'{character_count}個のキャラクター画像を抽出しました。')

# メイン処理
#input_path = './pixijs_rpg_game/assets/images/characters/dq2charactor.png'
input_path = './pixijs_rpg_game/assets/images/characters/dq2charactor_transparent.png'
output_dir = './pixijs_rpg_game/assets/images/characters/dq2charactor3'
tile_size = 16  # キャラクターのタイルサイズ

os.makedirs(output_dir, exist_ok=True)
extract_characters(input_path, output_dir, tile_size)