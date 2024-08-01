document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.getElementById('saveMap');
    const loadButton = document.getElementById('loadMap');
    const fileInput = document.getElementById('fileInput');
    const fileNameInput = document.getElementById('fileNameInput');
    const tilesetContainer = document.getElementById('tileset-container');

    const tileSize = 16;
    const mapSize = 32;  // 32 * 32 のマップ
    let map = Array(mapSize).fill().map(() => Array(mapSize).fill({tile: 0, collision: false}));

    let selectedTileIndex = 0;
    const tileImages = [];

    let isMouseDown = false;

    saveButton.addEventListener('click', saveMap, false);
    loadButton.addEventListener('click', () => fileInput.click(), false);
    fileInput.addEventListener('change', loadMap, false);
    canvas.addEventListener('mousedown', startDrawing, false);
    canvas.addEventListener('mousemove', drawTile, false);
    canvas.addEventListener('mouseup', stopDrawing, false);
    canvas.addEventListener('mouseleave', stopDrawing, false);

    function loadTileset() {
        const numTiles = 256;  // 仮に256個のタイルがあるとする（必要に応じて調整）
        for (let i = 1; i <= numTiles; i++) {
            const path = `map/tile${i}.png`;
            const img = new Image();
            img.src = path;
            img.onload = () => {
                tileImages[i - 1] = img;
                const tile = document.createElement('div');
                tile.classList.add('tileset-tile');
                tile.style.backgroundImage = `url(${img.src})`;
                tile.style.backgroundSize = 'cover';
                tile.dataset.index = i - 1;

                tile.addEventListener('click', () => {
                    document.querySelectorAll('.tileset-tile').forEach(t => t.classList.remove('selected'));
                    tile.classList.add('selected');
                    selectedTileIndex = i - 1;
                });

                tilesetContainer.appendChild(tile);
            };
        }
    }

    function drawMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const tile = map[y][x].tile;
                const img = tileImages[tile];
                if (img) {
                    ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
    }

    function startDrawing(event) {
        isMouseDown = true;
        placeTile(event);
    }

    function drawTile(event) {
        if (isMouseDown) {
            placeTile(event);
        }
    }

    function stopDrawing() {
        isMouseDown = false;
    }

    function placeTile(event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / tileSize);
        const y = Math.floor((event.clientY - rect.top) / tileSize);

        if (x >= 0 && x < mapSize && y >= 0 && y < mapSize) {
            map[y][x] = {tile: selectedTileIndex, collision: false}; // マップにタイルを配置
            drawMap();
        }
    }

    function saveMap() {
        const data = {
            map: map,
            tileSet: tileImages.map(img => img.src)
        };
        const fileName = fileNameInput.value || 'map';
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type: 'application/json'}));
        a.download = `${fileName}.json`;
        a.click();
    }

    function loadMap(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            map = data.map;
            drawMap();
        };
        reader.readAsText(file);
    }

    loadTileset();
});