import streamlit as st
from PIL import Image
import numpy as np
import os
from skimage import measure
from skimage.color import rgb2gray
from io import BytesIO

def extract_characters(image, min_size=10, max_size=10000):
    # RGBAの場合はRGBに変換
    if image.mode == 'RGBA':
        image = Image.fromarray(np.array(image)[:,:,:3])
    
    # グレースケールに変換
    gray = rgb2gray(np.array(image))
    
    # 二値化（閾値を調整）
    thresh = gray < 0.99  # 背景が明るい場合を想定
    
    # ラベリング
    labels = measure.label(thresh, connectivity=2, background=0)
    
    # プロパティの計算
    props = measure.regionprops(labels)
    
    characters = []
    for prop in props:
        if min_size < prop.area < max_size:
            minr, minc, maxr, maxc = prop.bbox
            character = image.crop((minc, minr, maxc, maxr))
            characters.append(character)
    
    return characters

def get_unique_export_folder(input_folder):
    base_export_folder = os.path.join(input_folder, "export")
    export_folder = base_export_folder
    counter = 2
    while os.path.exists(export_folder):
        export_folder = f"{base_export_folder}_{counter}"
        counter += 1
    return export_folder

st.title("キャラクター画像抽出アプリ")

uploaded_file = st.file_uploader("キャラクター画像をアップロードしてください", type=["png", "jpg", "jpeg", "gif"])

if uploaded_file is not None:
    img = Image.open(uploaded_file).convert('RGBA')
    st.image(img, caption="アップロードされた画像", use_column_width=True)

    min_size = st.slider("最小キャラクターサイズ", 1, 1000, 10)
    max_size = st.slider("最大キャラクターサイズ", 20, 1000, 100)

    if st.button("キャラクターを抽出"):
        try:
            characters = extract_characters(img, min_size, max_size)
            
            if characters:
                st.success(f"{len(characters)}個のキャラクター画像を抽出しました。")
                
                # 出力フォルダの作成（この例ではStreamlitの一時ディレクトリを使用）
                output_dir = st.session_state.get('output_dir', None)
                if not output_dir:
                    output_dir = get_unique_export_folder(os.path.join(os.getcwd(), 'temp'))
                    os.makedirs(output_dir, exist_ok=True)
                    st.session_state['output_dir'] = output_dir
                
                st.info(f"抽出された画像は {output_dir} に保存されました。")
                
                # 抽出されたキャラクター画像を表示
                for i, char in enumerate(characters):
                    img_path = os.path.join(output_dir, f'character_{i+1}.png')
                    char.save(img_path)
                    
                    # 画像をバイトストリームに変換
                    img_byte_arr = BytesIO()
                    char.save(img_byte_arr, format='PNG')
                    img_byte_arr = img_byte_arr.getvalue()
                    
                    st.image(img_byte_arr, caption=f"キャラクター {i+1}", use_column_width=True)
            else:
                st.warning("キャラクターが見つかりませんでした。パラメータを調整してみてください。")
        except Exception as e:
            st.error(f"エラーが発生しました: {str(e)}")
            st.error("画像の処理中に問題が発生しました。別の画像を試すか、パラメータを調整してください。")

st.markdown("---")
st.write("注意: このアプリは様々な背景色や小さなスプライトにも対応しています。必要に応じてサイズパラメータを調整してください。")