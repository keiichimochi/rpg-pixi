import os

# PNGファイルをリスト化
png_files = sorted([f for f in os.listdir() if f.endswith('.png')])

for i, old_file_name in enumerate(png_files):
    new_file_name = f'tile{i + 1}.png'  # 変換後のファイル名をtile1.png形式に変更
    os.rename(old_file_name, new_file_name)