from PIL import Image
import os

def extract_sprites(input_path, output_dir, tile_size, sprites_per_character):
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
        
        # 画像のサイズを取得
        width, height = img.size
        
        character_count = 0
        for y in range(0, height, tile_size):
            for x in range(0, width, tile_size * sprites_per_character):
                character_count += 1
                for sprite_index in range(sprites_per_character):
                    sprite_x = x + sprite_index * tile_size
                    sprite_y = y
                    sprite_img = img.crop((sprite_x, sprite_y, sprite_x + tile_size, sprite_y + tile_size))
                    sprite_img.save(os.path.join(output_dir, f'character_{character_count}_sprite_{sprite_index + 1}.png'))

    print(f'{character_count}個のキャラクター画像を抽出しました。')

# メイン処理
input_path = './pixijs_rpg_game/assets/images/characters/dq2charactor.png'
output_dir = './pixijs_rpg_game/assets/images/characters/dq2charactor3'
tile_size = 16  # スプライトのタイルサイズ
sprites_per_character = 8  # 各キャラクターのスプライト数

os.makedirs(output_dir, exist_ok=True)
extract_sprites(input_path, output_dir, tile_size, sprites_per_character)