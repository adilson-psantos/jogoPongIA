let bolaImg, raqueteJogadorImg, raqueteComputadorImg; // Variáveis para armazenar as imagens da bola e das raquetes
let bola; // Variável para armazenar a posição da bola
let velocidadeBolaX, velocidadeBolaY; // Variáveis para a velocidade da bola em X e Y
let larguraRaquete = 10, alturaRaquete = 80; // Dimensões das raquetes
let espessuraBarra = 5; // Espessura das barras superior e inferior
let posicaoJogadorY, posicaoComputadorY; // Posições verticais das raquetes do jogador e do computador
let pontosJogador = 0; // Pontuação do jogador
let pontosComputador = 0; // Pontuação do computador
let fundo; // Variável para armazenar a imagem de fundo

let audioContext; // Variável para armazenar o contexto de áudio
let somColisaoBuffer; // Variável para armazenar o buffer do som de colisão

function setup() {
    createCanvas(800, 400); // Cria o canvas com largura de 800 e altura de 400 pixels
    fundo = loadImage('assets/fundo2.png'); // Carrega a imagem de fundo
    bolaImg = loadImage('assets/bola.png'); // Carrega a imagem da bola
    raqueteJogadorImg = loadImage('assets/barra01.png'); // Carrega a imagem da raquete do jogador
    raqueteComputadorImg = loadImage('assets/barra02.png'); // Carrega a imagem da raquete do computador
    resetarBola(); // Inicializa a posição e a velocidade da bola
    posicaoJogadorY = height / 2 - alturaRaquete / 2; // Centraliza a raquete do jogador na tela
    posicaoComputadorY = height / 2 - alturaRaquete / 2; // Centraliza a raquete do computador na tela
    
    // Configura para iniciar o áudio após a interação do usuário
    document.addEventListener('click', iniciarAudio); // Inicia o contexto de áudio ao clicar na página
}

// Função que é chamada pelo usuário para iniciar o áudio
function iniciarAudio() {
    if (!audioContext) { // Verifica se o áudio já foi iniciado
        audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Cria o contexto de áudio
        
        // Carrega o arquivo de som 'bounce.wav' e armazena no buffer
        fetch('assets/sounds/bounce.wav') // Faz uma solicitação para obter o arquivo de áudio
            .then(response => response.arrayBuffer()) // Converte a resposta em um array de bytes
            .then(data => audioContext.decodeAudioData(data)) // Decodifica o áudio e retorna um buffer
            .then(buffer => {
                somColisaoBuffer = buffer; // Armazena o buffer decodificado para o som de colisão
            })
            .catch(error => console.error("Erro ao carregar o áudio:", error)); // Exibe um erro se o carregamento falhar
    }
}

function draw() {
    imageMode(CORNER); // Define o modo de desenho da imagem para começar do canto superior esquerdo
    image(fundo, 0, 0, width, height); // Desenha a imagem de fundo cobrindo todo o canvas
    desenharBarras(); // Chama a função para desenhar as barras superior e inferior
    desenharBola(); // Chama a função para desenhar a bola
    desenharRaquetes(); // Chama a função para desenhar as raquetes do jogador e do computador
    moverBola(); // Atualiza a posição da bola
    moverRaqueteComputador(); // Atualiza a posição da raquete do computador
    verificarColisoes(); // Verifica colisões da bola com as raquetes e as bordas

    // Atualiza a posição da raquete do jogador com base na posição do mouse
    posicaoJogadorY = constrain(mouseY - alturaRaquete / 2, 0, height - alturaRaquete);

    // Exibe a pontuação do jogador e do computador
    textSize(32); // Define o tamanho do texto
    fill(255); // Define a cor do texto como branca
    textAlign(CENTER, TOP); // Alinha o texto no centro horizontal e no topo vertical
    text(pontosJogador, width / 4, 20); // Exibe a pontuação do jogador no lado esquerdo
    text(pontosComputador, (width / 4) * 3, 20); // Exibe a pontuação do computador no lado direito
}

function resetarBola() {
    bola = createVector(width / 2, height / 2); // Centraliza a bola no canvas
    velocidadeBolaX = random([-5, 5]); // Define a velocidade inicial da bola em X de forma aleatória
    velocidadeBolaY = random(-3, 3); // Define a velocidade inicial da bola em Y de forma aleatória
}

// Função para narrar o placar atual
function narrarPlacar() {
    const mensagem = `${pontosComputador} a ${pontosJogador}`; // Define a mensagem com o placar atual
    const sintese = new SpeechSynthesisUtterance(mensagem); // Cria um objeto de síntese de fala com a mensagem
    window.speechSynthesis.speak(sintese); // Reproduz a fala usando a API de síntese de voz do navegador
}

function moverBola() {
    bola.x += velocidadeBolaX; // Atualiza a posição horizontal da bola
    bola.y += velocidadeBolaY; // Atualiza a posição vertical da bola

    // Verifica colisão da bola com a barra superior e inferior
    if (bola.y < espessuraBarra || bola.y > height - espessuraBarra) {
        velocidadeBolaY *= -1; // Inverte a direção da bola em Y ao bater nas bordas
    }

    // Verifica se a bola sai pela esquerda (ponto para o computador)
    if (bola.x < 0) {
        pontosComputador++; // Adiciona ponto para o computador
        narrarPlacar(); // Narra o placar após o gol
        resetarBola(); // Reinicializa a posição da bola
    }

    // Verifica se a bola sai pela direita (ponto para o jogador)
    if (bola.x > width) {
        pontosJogador++; // Adiciona ponto para o jogador
        narrarPlacar(); // Narra o placar após o gol
        resetarBola(); // Reinicializa a posição da bola
    }
}

function desenharBarras() {
    fill(color('#2b3fd6')); // Define a cor azul para as barras
    noStroke(); // Remove as bordas das barras

    // Desenha a barra superior
    rect(0, 0, width, espessuraBarra, 5); // Barra com bordas arredondadas

    // Desenha a barra inferior
    rect(0, height - espessuraBarra, width, espessuraBarra, 5); // Barra com bordas arredondadas
}

function desenharBola() {
    // Desenha a imagem da bola na posição atual, centralizando a imagem
    imageMode(CENTER);
    image(bolaImg, bola.x, bola.y, 20, 20); // Define a largura e altura da bola como 20x20 pixels
}

function desenharRaquetes() {
    // Desenha a imagem da raquete do jogador na posição atual
    imageMode(CORNER); // Define o modo de desenho para desenhar do canto superior esquerdo
    image(raqueteJogadorImg, 30, posicaoJogadorY, larguraRaquete, alturaRaquete); // Define as dimensões da raquete

    // Desenha a imagem da raquete do computador na posição atual
    image(raqueteComputadorImg, width - 40, posicaoComputadorY, larguraRaquete, alturaRaquete); // Define as dimensões da raquete
}

// Função para tocar o som de colisão
function tocarSomColisao() {
    if (audioContext && somColisaoBuffer) { // Verifica se o contexto de áudio e o buffer estão prontos
        const som = audioContext.createBufferSource(); // Cria uma nova fonte de áudio
        som.buffer = somColisaoBuffer; // Define o buffer da fonte como o som de colisão
        som.connect(audioContext.destination); // Conecta a fonte ao destino (alto-falantes)
        som.start(0); // Inicia o som imediatamente
    }
}

function verificarColisoes() {
    // Verifica colisão da bola com a raquete do jogador
    if (
        bola.x - 10 < 40 && 
        bola.y > posicaoJogadorY && 
        bola.y < posicaoJogadorY + alturaRaquete
    ) {
        velocidadeBolaX *= -1; // Inverte a direção horizontal da bola
        alterarVelocidadeBola(); // Ajusta a velocidade da bola após a colisão
        let diferencaY = bola.y - (posicaoJogadorY + alturaRaquete / 2);
        velocidadeBolaY = diferencaY * 0.2;
        bola.x = 40 + 10;

        tocarSomColisao(); // Toca o som quando há colisão com a raquete do jogador
    }

    // Verifica colisão da bola com a raquete do computador
    if (
        bola.x + 10 > width - 50 && 
        bola.y > posicaoComputadorY && 
        bola.y < posicaoComputadorY + alturaRaquete
    ) {
        velocidadeBolaX *= -1; // Inverte a direção horizontal da bola
        alterarVelocidadeBola(); // Ajusta a velocidade da bola após a colisão
        let diferencaY = bola.y - (posicaoComputadorY + alturaRaquete / 2);
        velocidadeBolaY = diferencaY * 0.2;
        bola.x = width - 50 - 10;

        tocarSomColisao(); // Toca o som quando há colisão com a raquete do computador
    }
}

function moverRaqueteComputador() {
    let velocidadeComputador = 3; // Define a velocidade de movimento da raquete do computador
    if (bola.y < posicaoComputadorY + alturaRaquete / 2 - 10) {
        posicaoComputadorY -= velocidadeComputador; // Move a raquete para cima
    } else if (bola.y > posicaoComputadorY + alturaRaquete / 2 + 10) {
        posicaoComputadorY += velocidadeComputador; // Move a raquete para baixo
    }

    posicaoComputadorY = constrain(posicaoComputadorY, 0, height - alturaRaquete); // Restringe a posição da raquete
}

function alterarVelocidadeBola() {
    let incrementoVelocidade = random(0.5, 1.5); // Gera um incremento aleatório na velocidade
    velocidadeBolaX = velocidadeBolaX < 0 ? -incrementoVelocidade : incrementoVelocidade; // Aplica a mudança na direção atual da bola
    velocidadeBolaY = random(-3, 3); // Ajusta a velocidade em Y de forma aleatória
}
