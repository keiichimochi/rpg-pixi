from PIL import Image
import os

def convert_gif_to_png(gif_path, png_path):
    with Image.open(gif_path) as img:
        img.save(png_path, 'PNG')
    print(f'Converted {gif_path} to {png_path}')

def extract_tiles(input_path, output_dir, tile_size):
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
        
        # 画像を走査して個々のタイルを見つける
        width, height = img.size
        visited = set()
        
        def flood_fill(x, y):
            stack = [(x, y)]
            tile_pixels = []
            
            while stack:
                px, py = stack.pop()
                if (px, py) in visited or px < 0 or px >= width or py < 0 or py >= height:
                    continue
                
                pixel = img.getpixel((px, py))
                if pixel[3] != 0:  # 透明でない場合
                    visited.add((px, py))
                    tile_pixels.append((px, py))
                    stack.extend([(px+1, py), (px-1, py), (px, py+1), (px, py-1)])
            
            return tile_pixels
        
        tile_count = 0
        for y in range(height):
            for x in range(width):
                if (x, y) not in visited and img.getpixel((x, y))[3] != 0:
                    tile_pixels = flood_fill(x, y)
                    if len(tile_pixels) > 10:  # 小さすぎる領域は無視
                        tile_count += 1
                        # タイルの領域を切り出す
                        min_x = min(p[0] for p in tile_pixels)
                        max_x = max(p[0] for p in tile_pixels)
                        min_y = min(p[1] for p in tile_pixels)
                        max_y = max(p[1] for p in tile_pixels)
                        
                        tile_img = img.crop((min_x, min_y, max_x+1, max_y+1))
                        tile_img.save(os.path.join(output_dir, f'tile_{tile_count}.png'))

    print(f'{tile_count}個のタイル画像を抽出しました。')

if __name__ == '__main__':
    gif_path = './pixijs_rpg_game/assets/images/map/tiles-2.gif'
    png_path = './pixijs_rpg_game/assets/images/map/tiles-2.png'
    output_dir = './pixijs_rpg_game/assets/images/map/extracted'
    tile_size = 16  # タイルサイズ

    os.makedirs(output_dir, exist_ok=True)
    
    # GIFをPNGに変換
    convert_gif_to_png(gif_path, png_path)
    
    # PNGからタイルを抽出
    extract_tiles(png_path, output_dir, tile_size)