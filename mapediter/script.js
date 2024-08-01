document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.getElementById('saveMap');
    const loadButton = document.getElementById('loadMap');
    const fileInput = document.getElementById('fileInput');
    const fileNameInput = document.getElementById('fileNameInput');
    const collisionButton = document.getElementById('checkCollision');
    const tilesetContainer = document.getElementById('tileset-container');

    const tileSize = 16;
    const mapSize = 32;  // 32 * 32 のマップ
    let map = Array(mapSize).fill().map(() => Array(mapSize).fill({tile: 0, collision: false}));

    let selectedTileIndex = 0;
    const tileImages = [];

    let isMouseDown = false;
    let showCollisions = false;

    saveButton.addEventListener('click', saveMap, false);
    loadButton.addEventListener('click', () => fileInput.click(), false);
    fileInput.addEventListener('change', loadMap, false);
    canvas.addEventListener('mousedown', startDrawing, false);
    canvas.addEventListener('mousemove', drawTile, false);
    canvas.addEventListener('mouseup', stopDrawing, false);
    canvas.addEventListener('mouseleave', stopDrawing, false);
    collisionButton.addEventListener('click', toggleCollisions, false);

    function loadTileset() {
        fetch('dataset/tileset.json')
            .then(response => response.json())
            .then(data => {
                data.tiles.forEach((tile, index) => {
                    const img = new Image();
                    img.src = tile.src;
                    img.onload = () => {
                        tileImages[index] = {img, collision: tile.collision};
                        const tileElement = document.createElement('div');
                        tileElement.classList.add('tileset-tile');
                        tileElement.style.backgroundImage = `url(${img.src})`;
                        tileElement.style.backgroundSize = 'cover';
                        tileElement.dataset.index = index;

                        tileElement.addEventListener('click', () => {
                            document.querySelectorAll('.tileset-tile').forEach(t => t.classList.remove('selected'));
                            tileElement.classList.add('selected');
                            selectedTileIndex = index;
                        });

                        tilesetContainer.appendChild(tileElement);
                    };
                });
            })
            .catch(error => {
                console.error('Error loading tileset.json:', error);
            });
    }

    function drawMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const tile = map[y][x].tile;
                if (tileImages[tile]) {
                    const img = tileImages[tile].img;
                    ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
                    if (showCollisions && map[y][x].collision) {
                        ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
                        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    }
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
            const tile = selectedTileIndex;
            const collision = tileImages[tile].collision;
            map[y][x] = {tile, collision}; // マップにタイルを配置
            drawMap();
        }
    }

    function saveMap() {
        const data = {
            map: map,
            tileSet: tileImages.map(img => img.img.src)
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

    function toggleCollisions() {
        showCollisions = !showCollisions;
        drawMap();
    }

    loadTileset();
});