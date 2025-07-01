document.addEventListener("DOMContentLoaded", () => {
});
    const restartButton = document.getElementById("restartButton");  
restartButton.style.display = "block";

    const canvas = document.getElementById("gameCanvas");            
    const ctx = canvas.getContext("2d");
           
    const scoreDisplay = document.getElementById("scoreNumber");
           
    const bestScoreDisplay = document.getElementById("bestScoreNumber");
       
    const eatSound = document.getElementById("eatSound");
         
    const collisionSound = document.getElementById("collisionSound");
                        
    const celebrationSound = document.getElementById("celebrationSound");
                         
    const pauseButton = document.getElementById("pauseButton");

const difficultySelector = document.getElementById("difficultySelector");

    const themeSelector = document.getElementById("themeSelector");
    
    const saveSettings = document.getElementById("saveSettings");
//nova configuracao
const modal = document.getElementById("settingsModal");

const openSettings = document.getElementById("openSettings");

const closeModal = document.querySelector(".close-button");

// som
const volumeButton = document.getElementById("volumeButton");

const volumeValue = document.getElementById("volumeValue");
saveSettings.addEventListener("click", () => {
    modal.style.display = "none";
});

// Definir os níveis de volume
const volumeLevels = [0, 0.1, 1];
const volumeIcons = ["🔇", "🔉", "🔊"];
const volumeTexts = ["0%", "50%", "100%"];

let currentVolumeIndex = 2; // Começa em 100% (índice 2)

// Função para alternar volume
function toggleVolume() {
    currentVolumeIndex = (currentVolumeIndex + 1) % volumeLevels.length;

    // Atualizar botão com novo volume
    volumeButton.innerHTML = `${volumeIcons[currentVolumeIndex]} <span id="volumeValue">${volumeTexts[currentVolumeIndex]}</span>`;

    // Aplicar volume aos sons do jogo
    if (typeof eatSound !== "undefined") eatSound.volume = volumeLevels[currentVolumeIndex];
    if (typeof collisionSound !== "undefined") collisionSound.volume = volumeLevels[currentVolumeIndex];
    if (typeof celebrationSound !== "undefined") celebrationSound.volume = volumeLevels[currentVolumeIndex];

    // Salvar no localStorage
    localStorage.setItem("volume", volumeLevels[currentVolumeIndex]);
}

// Adicionar evento de clique no botão
volumeButton.addEventListener("click", toggleVolume);

// Carregar volume salvo ao abrir o jogo
document.addEventListener("DOMContentLoaded", () => {
    const savedVolume = parseFloat(localStorage.getItem("volume"));

    if (!isNaN(savedVolume)) {
        currentVolumeIndex = volumeLevels.indexOf(savedVolume);
        if (currentVolumeIndex === -1) currentVolumeIndex = 2; // Default 100%

        // Atualizar botão ao carregar
        volumeButton.innerHTML = `${volumeIcons[currentVolumeIndex]} <span id="volumeValue">${volumeTexts[currentVolumeIndex]}</span>`;

        // Aplicar volume aos sons
        if (typeof eatSound !== "undefined") eatSound.volume = volumeLevels[currentVolumeIndex];
        if (typeof collisionSound !== "undefined") collisionSound.volume = volumeLevels[currentVolumeIndex];
        if (typeof celebrationSound !== "undefined") celebrationSound.volume = volumeLevels[currentVolumeIndex];
    }
});

//configuracao do son acaba aqui

// Abrir o modal ao clicar no botão "Configurações"
openSettings.addEventListener("click", () => {
    modal.style.display = "block";
});

// Fechar o modal ao clicar no botão "×"
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fechar o modal ao clicar fora dele
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Definição dos modos de jogo e suas velocidades
    const difficultySettings = {
        easy: 200,   
        medium: 150,
        hard: 100
    };

    // Apenas atualizamos a dificuldade, sem redeclarar `speed`
    function setDifficulty(level) {
        if (difficultySettings[level]) {
            speed = difficultySettings[level]; // Atualizar velocidade do jogo
        }
    }

    // Função para definir o tema
    function setTheme(theme) {
        document.body.className = theme;
    }

    // Carregar configurações ao iniciar o jogo
    function loadSettings() {
        let savedDifficulty = localStorage.getItem("difficulty");
        let savedTheme = localStorage.getItem("theme");

// Se não houver configuração salva, define padrão
        if (!savedDifficulty) {
            savedDifficulty = "easy";
            localStorage.setItem("difficulty", savedDifficulty);
        }
        if (!savedTheme) {
            savedTheme = "default";
          localStorage.setItem("theme", savedTheme);
        }

        // Aplicar as configurações carregadas
        difficultySelector.value = savedDifficulty;
        themeSelector.value = savedTheme;
        setDifficulty(savedDifficulty);
        setTheme(savedTheme);
    }

    // Salvar configurações ao clicar em "Salvar Configurações"
    saveSettings.addEventListener("click", () => {
        const selectedDifficulty = difficultySelector.value;
        const selectedTheme = themeSelector.value;

        // Salvar configurações no localStorage
        localStorage.setItem("difficulty", selectedDifficulty);
        localStorage.setItem("theme", selectedTheme);

        // Aplicar configurações no jogo
        setDifficulty(selectedDifficulty);
        setTheme(selectedTheme);

        // Fechar o modal automaticamente
        document.getElementById("settingsModal").style.display = "none";
    });

    // Chamar função para carregar configurações ao iniciar a página
    loadSettings();
});

let isPaused = false;
let gameRunning = false;
let gameLoopTimeout;

//_<<<<<<<<<<<<<<<<<<<<<<<<__<<<<<__<<<<<<<<<<<<<<<<

const themes = {
    default: (index) => `hsl(${(index * 35) % 360}, 80%, 50%)`, // Padrão
    neon: (index) => `hsl(${(index * 60) % 360}, 100%, 50%)`, // Neon
    dark: (index) => `hsl(${(index * 40) % 360}, 50%, 15%)`, // Noite Sombria
    argentina: (index) => {
        const colors = ["#00cef2", "#ffffff"];
        return colors[index % colors.length]; //argentina
    },
    fire: (index) => {
        const colors = ["#ff4500", "#ff8c00", "#ffd700", "#ff0000", "#ff6347"];
        return colors[index % colors.length]; // Chamas
    },
    pastel: (index) => `hsl(${(index * 70) % 360}, 60%, 80%)`, // Pastel
    jungle: (index) => {
        const colors = ["#004d00", "#008000", "#00cc00", "#66ff66", "#339933"];
        return colors[index % colors.length]; // Selva
    },
    sunset: (index) => {
        const colors = ["#ff4500", "#ff6347", "#ff7f50", "#ffa07a", "#ffd700"];
        return colors[index % colors.length]; // Pôr do Sol
    },
    ice: (index) => {
        const colors = ["#00ffff", "#66ffff", "#ccffff", "#99ccff", "#3399ff"];
        return colors[index % colors.length]; // Gelo
    },
    glowing: (index) => {
        const glowColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
        return glowColors[Math.floor(Date.now() / 200) % glowColors.length]; // Brilho Neon
    },
    rainbow: (index) => `hsl(${(Date.now() / 10 + index * 36) % 360}, 100%, 50%)`, // Arco-Íris
    pulse: (index) => {
        const brightness = (Math.sin(Date.now() / 500) + 1) / 2 * 50 + 50;
        return `hsl(${index * 30 % 360}, 100%, ${brightness}%)`; // Efeito Pulsante
    },
    shadow: (index) => {
        const shadowColors = ["#222", "#444", "#666", "#888", "#aaa", "#ccc"];
        return shadowColors[Math.floor(Date.now() / 300) % shadowColors.length]; // Sombras
    },
    snowfall: (index) => {
        const colors = ["#ffffff", "#f0f8ff", "#e0ffff", "#dcdcdc", "#c0c0c0"];
        return colors[index % colors.length]; // Nevasca
    },
    electricShock: (index) => {
        const shockColors = ["#00ffff", "#00ccff", "#00aaff", "#0077ff", "#0055ff"];
        return shockColors[Math.floor(Date.now() / 100) % shockColors.length];
    },
    pixelArt: (index) => {
        const colors = ["#ffcc00", "#ff9900", "#cc6600", "#996600", "#663300"];
        return colors[index % colors.length];
    },
    threeD: (index) => {
        const colors = ["#0077ff", "#0055cc", "#003399", "#001166", "#000044"];
        return colors[index % colors.length]; // Tons de azul para efeito 3D
    },
    santaCruz: (index) => {
        const colors = ["#FF0000", "#FFFFFF", "#000000"];
        return colors[index % colors.length];
    },
    brasil: (index) => {
    const colors = ["#ffff00", "#00ff00"];
    return colors[index % colors.length];
    },
    sport: (index) => {
    const colors = ["#e4002b", "#000000"];
    return colors[index % colors.length];
    }
};

let currentTheme = themes.default;
themeSelector.addEventListener("change", (event) => {
    currentTheme = themes[event.target.value] || themes.default;
});

document.addEventListener("DOMContentLoaded", () => {
    // Carregar o tema salvo no localStorage
    function loadTheme() {
        let savedTheme = localStorage.getItem("theme");

        if (!savedTheme || !themes[savedTheme]) {
            savedTheme = "default"; // Se não houver tema salvo, usar o padrão
        localStorage.setItem("theme", savedTheme);
        }

        // Atualizar o seletor de temas
        themeSelector.value = savedTheme;

        // Aplicar o tema carregado
        currentTheme = themes[savedTheme];
    }

    // Alterar o tema ao selecionar no menu
    themeSelector.addEventListener("change", (event) => {
        const selectedTheme = event.target.value;

        // Atualizar a variável global
        currentTheme = themes[selectedTheme];

        // Salvar no localStorage
        localStorage.setItem("theme", selectedTheme);
        
        draw();
    });

    // Carregar o tema salvo ao iniciar o jogo
    loadTheme();
});
//_<<<<<<<<<<<<<<<<<<<<<<<<__<<<<<__<<<<<<<<<<<<<<<<

pauseButton.addEventListener("click", () => {
    if (gameOver || !gameRunning) return;
    isPaused = !isPaused;
    if (isPaused) {
        clearTimeout(gameLoopTimeout);
        pauseButton.textContent = "Continuar";
    } else {
        pauseButton.textContent = "Pausar";
        gameLoop();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "p" || event.key === "P") {
        if (gameOver || !gameRunning) return;

        isPaused = !isPaused;

        if (isPaused) {
            clearTimeout(gameLoopTimeout);
            pauseButton.textContent = "Continuar";
        } else {
            pauseButton.textContent = "Pausar";
            gameLoop();
        }
    }
});

let lives = 5;  
const livesDisplay = document.getElementById("livesNumber");  
          
            const gridSize = 15;        
            let tileSize = 30;       
            let canvasSize = gridSize * tileSize;        
        
            if (window.innerWidth < 400) {        
    tileSize = Math.floor(window.innerWidth / gridSize);        
    canvasSize = tileSize * gridSize;        
}        

canvas.width = canvasSize;        
canvas.height = canvasSize;        
    const initialPosition = Math.floor(gridSize / 2);        
        
            let snake = [        
{ x: initialPosition, y: initialPosition, size: tileSize },         
{ x: initialPosition - 1, y: initialPosition, size: tileSize },         
{ x: initialPosition - 2, y: initialPosition, size: tileSize }        
];
        
            let direction = { x: 1, y: 0 };        
            let nextDirection = { x: 1, y: 0 };        
            let food = { x: -1, y: -1 };        
            let score = 0;        
            let speed = 170;       
            let touchStartX = 0;        
            let touchStartY = 0;        
            let gameStarted = false;        
            let gameOver = false;   
            let fruitsEaten = 0;        
            let showHeadEffect = false;        
            let mouthOpen = false;        
            const fruitImage = new Image();        
fruitImage.src = './img/fruit.png'; 
            
let bestScore = localStorage.getItem('bestScore') || 0;
            bestScoreDisplay.textContent = bestScore;                       
               
            function startGame() {
    gameOver = false;
    isPaused = false;
    gameRunning = true;
    jogoIniciado = true; // Atualiza a variável que controla o background
    score = 0;
    lives = 5;
    speed = 170;

    const initialPositionX = Math.floor(gridSize / 2) - 7;
    const initialPositionY = Math.floor(gridSize / 2);

    snake = [
        { x: initialPositionX, y: initialPositionY },
        { x: initialPositionX - 1, y: initialPositionY },
        { x: initialPositionX - 2, y: initialPositionY }
    ];
    
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    restartButton.style.display = "none";
    livesDisplay.textContent = lives;
    scoreDisplay.textContent = score;

    clearTimeout(gameLoopTimeout);
    gameLoopTimeout = setTimeout(gameLoop, speed);

    draw(); // Garante que a tela é redesenhada com o novo fundo
}

 // configuracao do botao restartbutton
restartButton.addEventListener("click", () => {
    gameOver = false;
    isPaused = false;
    score = 0;
    lives = 5;
    speed = 170;
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];  
    direction = { x: 1, y: 0 };
    restartButton.style.display = "none";
    livesDisplay.textContent = lives;
    scoreDisplay.textContent = score;
    clearTimeout(gameLoopTimeout);
    gameLoopTimeout = setTimeout(gameLoop, speed);
});  

function showCelebration() {
    const celebrationContainer = document.createElement("div");
    celebrationContainer.id = "celebration";
    document.body.appendChild(celebrationContainer);

    const message = document.createElement("div");
    message.id = "celebrationMessage";
message.textContent = " Novo Recorde! Parabéns! 🎉🎉 ";
    celebrationContainer.appendChild(message);

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        const angle = Math.random() * 360;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 2 + 1;
        particle.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${distance}px)`;
        particle.style.animationDuration = `${duration}s`;
        fragment.appendChild(particle);
    }
    celebrationContainer.appendChild(fragment);

    setTimeout(() => celebrationContainer.remove(), 5000);
}

//atualizado 3⁰
function checkCollision() {  
    const head = snake[0];  
    const snakeSet = new Set(snake.slice(1).map(s => `${s.x},${s.y}`)); // Converte a cobra em um conjunto para busca mais rápida

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snakeSet.has(`${head.x},${head.y}`)) {  
        handleCollision();  
        return true;  
    }  
    return false;  
}

// Chamamos essa função quando a cobra morrer
function handleCollision() {  
    collisionSound.play();  
    explodeSnake(); // Sempre exibe partículas ao colidir  

    lives--;
    livesDisplay.textContent = lives;

    if (lives <= 0) {  
        gameOver = true;  
        restartButton.style.display = "block";  
        setTimeout(() => {
            drawGameOver();
        }, 1000);
    } else {  
        resetSnakePosition();  
    }  
}

function explodeSnake() {
    for (let i = 0; i < 20; i++) {
        let particle = {
            x: snake[0].x * tileSize + tileSize / 2,
            y: snake[0].y * tileSize + tileSize / 2,
            dx: (Math.random() - 0.5) * 10,
            dy: (Math.random() - 0.5) * 10,
            size: Math.random() * 5 + 3,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        };
        particles.push(particle);
    }

    animateParticles();
}

let particles = [];

// Anima as partículas da explosão
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    particles.forEach((p, index) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Atualiza posição
        p.x += p.dx;
        p.y += p.dy;
        p.size *= 0.95; // Partículas vão diminuindo

        if (p.size < 0.5) {
            particles.splice(index, 1);
        }
    });

    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    }
}

function loseLife() {    
    lives--;     
    livesDisplay.textContent = lives;    
    if (lives <= 0) {    
        collisionSound.play();    
        gameOver = true;    
        drawGameOver();    
        restartButton.style.display = "block";    
    } else {    
        resetSnakePosition();    
    }    
}                  
          
        function resetGame() {        
                const initialPosition = Math.floor(gridSize / 2);        
                snake = [        
      { x: initialPosition, y: initialPosition },         
      { x: initialPosition - 1, y: initialPosition },         
      { x: initialPosition - 2, y: initialPosition }        
                ];        
                direction = { x: 1, y: 0 };        
                nextDirection = { x: 1, y: 0 };        
                score = 0;        
                scoreDisplay.textContent = score;        
                fruitsEaten = 0;      
                speed = 140;      
                gameStarted = false;        
                showHeadEffect = false;         
            }  
  
         function resetSnakePosition() {  
    const initialPosition = Math.floor(gridSize / 2);  
    snake = [  
        { x: initialPosition, y: initialPosition },  
        { x: initialPosition - 1, y: initialPosition },  
        { x: initialPosition - 2, y: initialPosition }  
    ];  
    direction = { x: 1, y: 0 };  
    nextDirection = { x: 1, y: 0 };  
}

            function drawSnake() {        
    snake.forEach((segment, index) => {        
        if (index === 0) {        
            drawSnakeHead(segment);    
        } else {        
            drawSnakeSegment(segment, index);    
        }        
    });        
}

//atualizado 6⁰
function drawSnakeHead(segment) {        
    // Criar efeito de gradiente para a cabeça
    let gradient = ctx.createRadialGradient(
        segment.x * tileSize + tileSize / 2, segment.y * tileSize + tileSize / 2, tileSize / 8,
        segment.x * tileSize + tileSize / 2, segment.y * tileSize + tileSize / 2, tileSize / 2
    );

    gradient.addColorStop(0, "#FFD700"); // Centro dourado
    gradient.addColorStop(1, "#FF4500"); // Bordas avermelhadas

    // Desenhar a cabeça com bordas arredondadas
    ctx.beginPath();
    ctx.roundRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize, 10); 
    ctx.fillStyle = gradient;
    ctx.fill(); // Corrigido: removi `ctx.arc();`, que não era necessário

    ctx.strokeStyle = "#B22222";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Olhos da cobra
    const eyeSize = tileSize * 0.15;
    const eyeOffsetX = tileSize * 0.25;
    const eyeOffsetY = tileSize * 0.3;
    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.arc(segment.x * tileSize + eyeOffsetX, segment.y * tileSize + eyeOffsetY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(segment.x * tileSize + tileSize - eyeOffsetX, segment.y * tileSize + eyeOffsetY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Reflexo dos olhos
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

    ctx.beginPath();
    ctx.arc(segment.x * tileSize + eyeOffsetX - 2, segment.y * tileSize + eyeOffsetY - 2, eyeSize / 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(segment.x * tileSize + tileSize - eyeOffsetX - 2, segment.y * tileSize + eyeOffsetY - 2, eyeSize / 3, 0, Math.PI * 2); // Corrigido erro de sintaxe
    ctx.fill();
}

            function drawFood() {        
                ctx.drawImage(fruitImage, food.x * tileSize, food.y * tileSize, tileSize, tileSize);        
            }        
                     
const backgroundInicial = new Image();
backgroundInicial.src = './img/frente.png'; // Imagem ao abrir o jogo

const backgroundJogo = new Image();
backgroundJogo.src = './img/costa.webp'; // Imagem durante o jogo

let jogoIniciado = false; // Controla o estado do jogo

// Função para desenhar o fundo
function drawBackground() {
    const backgroundImage = jogoIniciado ? backgroundJogo : backgroundInicial;
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

backgroundInicial.onload = () => {
    drawBackground();
};

//atualizado 4⁰
let cachedColors = [];
function draw() {
cachedColors = snake.map((_, i) => currentTheme(i));
ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSnake();
    drawFood();
    
    if (showHeadEffect) {        
        drawHeadEffect();        
    }
}

//atualizado 5⁰
function drawSnakeSegment(segment, index) {        
    let color = cachedColors[index];

    ctx.beginPath();
    ctx.roundRect(segment.x * tileSize, segment.y * tileSize, segment.size, segment.size, 6); 
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Função para iniciar o jogo
function iniciarJogo() {
    if (!jogoIniciado) {
        jogoIniciado = true;
        draw(); // Redesenhar para atualizar o fundo e iniciar o loop do jogo
    }
}

            function drawHeadEffect() {        
                const particleCount = 10;        
                const particleSize = 3;        
                const colors = ['#4CAF50', '#FFC107', '#2196F3']; // Cores para as partículas        
                const head = snake[0];        
        
                for (let i = 0; i < particleCount; i++) {        
                    const color = colors[Math.floor(Math.random() * colors.length)];        
                    const x = head.x * tileSize + tileSize / 2 + Math.random() * 10 - 5;        
                    const y = head.y * tileSize + tileSize / 2 + Math.random() * 10 - 5;        
        
                    ctx.beginPath();        
                    ctx.arc(x, y, particleSize, 0, Math.PI * 2);        
                    ctx.closePath();        
                    ctx.fillStyle = color;        
                    ctx.fill();        
                }        
            }        

let fruitParticles = [];

function createFruitParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        fruitParticles.push({
            x: x * tileSize + tileSize / 2,
            y: y * tileSize + tileSize / 2,
            dx: (Math.random() - 0.5) * 5,
            dy: (Math.random() - 0.5) * 5,
            size: Math.random() * 4 + 2,
            color: `rgba(255, 165, 0, ${Math.random()})`
        });
    }
}

function animateFruitParticles() {
    fruitParticles.forEach((p, i) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Movimento das partículas
        p.x += p.dx;
        p.y += p.dy;
        p.size *= 0.95; // Diminuem de tamanho

        if (p.size < 1) {
            fruitParticles.splice(i, 1);
        }
    });

    if (fruitParticles.length > 0) {
        requestAnimationFrame(animateFruitParticles);
    }
}

// Chamamos essa função quando a cobra come uma fruta
function moveSnake() {
    if (!gameStarted) {
        gameStarted = true;
        placeFood();
    }

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
        size: tileSize
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        fruitsEaten++;
        eatSound.play();

        createFruitParticles(food.x, food.y);
        animateFruitParticles();

        head.size = tileSize * 1.3;
        setTimeout(() => head.size = tileSize, 150);

        placeFood();
    } else if (snake.length < gridSize * gridSize) {
        snake.pop();
    }

    scoreDisplay.textContent = score;
}               
        
       function placeFood() {        
    let availablePositions = [];

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (!snake.some(segment => segment.x === x && segment.y === y)) {
                availablePositions.push({ x, y });
            }
        }
    }

    if (availablePositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        food = availablePositions[randomIndex];
    }
}
 
            function drawGameOver() {      
    // Criando um fundo semi-transparente para destacar o texto
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let fontSize = Math.floor(canvas.width / 10);
    ctx.font = `bold ${fontSize}px 'Press Start 2P', Arial`;        
    ctx.textAlign = "center";        
    ctx.textBaseline = "middle";

    // Criando um efeito neon com gradiente para o "Game Over"
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(1, "#ff9900");

    ctx.fillStyle = gradient;
    ctx.shadowColor = "rgba(255, 0, 0, 0.8)";
    ctx.shadowBlur = 20;  
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;

    // Criando um texto com o nome do criador abaixo do "Game Over"
    let creatorName = "Desenvolvedor BrunoSilva";
    ctx.font = `bold ${Math.floor(fontSize / 3)}px Arial`; // Fonte menor
    ctx.fillStyle = "#ffffff"; // Cor branca para destaque
    ctx.fillText(creatorName, canvas.width / 2, canvas.height / 2 + fontSize); // Posiciona abaixo do Game Over
}

            function handleTouchStart(event) {        
                const touch = event.touches[0];        
                touchStartX = touch.clientX;        
                touchStartY = touch.clientY;        
            }        
        
            function handleTouchMove(event) {        
                event.preventDefault();        
                const touch = event.touches[0];        
                const touchEndX = touch.clientX;        
                const touchEndY = touch.clientY;        
        
              const deltaX = touchEndX - touchStartX;        
              const deltaY = touchEndY - touchStartY;        
        
          if (Math.abs(deltaX) > Math.abs(deltaY)) {        
              if (deltaX > 0 && direction.x !== -1) {        
              nextDirection = { x: 1, y: 0 };        
        } else if (deltaX < 0 && direction.x !== 1) {        
              nextDirection = { x: -1, y: 0 };        
                    }        
                } else {        
              if (deltaY > 0 && direction.y !== -1) {        
              nextDirection = { x: 0, y: 1 };        
        } else if (deltaY < 0 && direction.y !== 1) {        
              nextDirection = { x: 0, y: -1 };        
                    }        
                }        
        
                touchStartX = touchEndX;        
                touchStartY = touchEndY;        
            }        
        
            canvas.addEventListener("touchstart", handleTouchStart);        
            canvas.addEventListener("touchmove", handleTouchMove);        
        
restartButton.addEventListener("click", function () {  
    startGame();  
});        
              
            document.addEventListener("keydown", function(event) {        
                switch (event.key) {        
                    case "ArrowUp":        
                        if (direction.y !== 1) nextDirection = { x: 0, y: -1 };        
                        break;        
                    case "ArrowDown":        
                        if (direction.y !== -1) nextDirection = { x: 0, y: 1 };        
                        break;        
                    case "ArrowLeft":        
                        if (direction.x !== 1) nextDirection = { x: -1, y: 0 };        
                        break;        
                    case "ArrowRight":        
                        if (direction.x !== -1) nextDirection = { x: 1, y: 0 };        
                        break;        
                }        
              });
              
        window.onload = function() {        
    setTimeout(() => {        
          
   },);
    
};

function gameLoop() {      
    if (gameOver || isPaused) return; // Para o jogo se necessário  

    moveSnake();      

    if (checkCollision()) {
        collisionSound.currentTime = 0;
        collisionSound.play().catch(error => console.log("Erro ao reproduzir som de colisão:", error));

        if (lives <= 0) {      
            gameOver = true;      

            // 🔹 Se o jogador fez pontos, salvar no Firebase    
            if (score > 0) {
                finalizarJogo(score);
            }

            if (score > bestScore) {      
                bestScore = score;      
       localStorage.setItem('bestScore', bestScore);      
       bestScoreDisplay.textContent = bestScore;
                
                celebrationSound.currentTime = 0;
                celebrationSound.play().catch(error => console.log("Erro ao reproduzir som de celebração:", error));
                
                showCelebration();
            }

            drawGameOver();
            restartButton.style.display = "block";    
            return; // Interrompe a execução do loop
        }      
    }  

    draw();      

    gameLoopTimeout = setTimeout(gameLoop, speed); // Apenas `setTimeout()`
}

// 🔹 Função para perguntar o nome do jogador e salvar no Firebase
function finalizarJogo(score) {
    if (score > 0) {
        let melhorScoreSalvo = parseInt(localStorage.getItem("melhorScore")) || 0;

        // 🔹 Se o novo score for menor ou igual ao melhor score salvo, não faz nada
        if (score <= melhorScoreSalvo) {
            return;
        }

        const nameModal = document.getElementById("nameModal");
        const playerNameInput = document.getElementById("playerNameInput");
        const confirmButton = document.getElementById("confirmNameButton");

        // 🔹 Pega o nome salvo no localStorage, se existir
        let nomeSalvo = localStorage.getItem("nomeJogador") || "";

        // 🔹 Preenche o input do modal com o nome salvo
        playerNameInput.value = nomeSalvo;

        // Exibir o modal
        nameModal.style.display = "block";

        confirmButton.onclick = function () {
            let nomeJogador = playerNameInput.value.trim();

            if (nomeJogador) { 
                let nomeAntigo = localStorage.getItem("nomeJogador") || nomeJogador;

                // 🔹 Atualiza o nome no localStorage
                localStorage.setItem("nomeJogador", nomeJogador);
                localStorage.setItem("melhorScore", score);

                // 🔹 Salva no Firebase e sobrescreve o nome se necessário
                salvarScoreFirebase(nomeAntigo, nomeJogador, score, () => {
                    nameModal.style.display = "none"; 
                    carregarRanking(); // 🔹 Atualiza o ranking automaticamente
                });
            }
        };
    }
}

function salvarScoreFirebase(nomeAntigo, nomeNovo, score, callback) {
    const scoresRef = window.firebaseRef(window.firebaseDatabase, "ranking");
    let melhorScoreSalvo = parseInt(localStorage.getItem("melhorScore")) || 0;

    window.firebaseGet(scoresRef).then((snapshot) => {
        let chaveJogador = null;
        let maiorScore = score;

        snapshot.forEach((child) => {
            let dados = child.val();
            let nomeNoBanco = dados.nome.trim().toLowerCase();

            // 🔹 Se o nome antigo ou o novo já existir, pegamos a chave do jogador
            if (nomeNoBanco === nomeAntigo.trim().toLowerCase() || nomeNoBanco === nomeNovo.trim().toLowerCase()) { 
                chaveJogador = child.key;
                maiorScore = Math.max(dados.score, score);
            }
        });

        if (chaveJogador) {
            // 🔹 Apaga o registro antigo e cria um novo com o nome atualizado
            const jogadorAntigoRef = window.firebaseRef(window.firebaseDatabase, `ranking/${chaveJogador}`);
            window.firebaseRemove(jogadorAntigoRef)
                .then(() => {
                    return window.firebasePush(scoresRef, { nome: nomeNovo, score: maiorScore, timestamp: Date.now() });
                })
                .then(() => {
                    localStorage.setItem("melhorScore", maiorScore);
                    localStorage.setItem("nomeJogador", nomeNovo); // 🔹 Atualiza o nome no localStorage
                    if (callback) callback();
                })
                .catch(error => console.log("Erro ao atualizar o nome no Firebase:", error));
        } else {
            // 🔹 Se for um novo jogador, adiciona normalmente
            window.firebasePush(scoresRef, { nome: nomeNovo, score: score, timestamp: Date.now() })
                .then(() => {
                    localStorage.setItem("melhorScore", score);
                    localStorage.setItem("nomeJogador", nomeNovo); // 🔹 Atualiza o nome no localStorage
                    if (callback) callback();
                })
                .catch(error => console.log("Erro ao salvar novo jogador:", error));
        }
    }).catch(error => console.log("Erro ao buscar jogadores no Firebase:", error));
}

function carregarRanking() {
    const rankingBody = document.getElementById("rankingBody");
    rankingBody.innerHTML = ""; // Limpa a tabela

    const scoresRef = window.firebaseRef(window.firebaseDatabase, "ranking");
    const rankingQuery = window.firebaseQuery(scoresRef, window.firebaseOrderByChild("score"), window.firebaseLimitToLast(10));

    let meuNome = localStorage.getItem("nomeJogador") || ""; // Nome do jogador no localStorage

    window.firebaseGet(rankingQuery).then((snapshot) => {
        if (snapshot.exists()) {
            let ranking = [];
            snapshot.forEach((child) => {
                ranking.push(child.val());
            });

            ranking.sort((a, b) => b.score - a.score); // Ordena do maior para o menor

            ranking.forEach((jogador, index) => {
                let medalha = "";
                if (index === 0) medalha = "🥇"; // 1º lugar
                if (index === 1) medalha = "🥈"; // 2º lugar
                if (index === 2) medalha = "🥉"; // 3º lugar

                // 🔹 Se for o próprio jogador, adiciona a classe de destaque
                let classe = jogador.nome === meuNome ? "meu-score" : "";

                let row = `
                    <tr class="${classe}">
                        <td>${index + 1}</td>
                        <td>
                            <div class="nome-medalha">
                                <span class="nome-jogador">${jogador.nome}</span>
                                <span class="medal">${medalha}</span>
                            </div>
                        </td>
                        <td>${jogador.score}</td>
                    </tr>
                `;
                rankingBody.innerHTML += row;
            });
        } else {
            rankingBody.innerHTML = "<tr><td colspan='3'>Nenhum jogador no ranking</td></tr>";
        }
    });
}

// 🔹 Carregar o ranking ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarRanking);