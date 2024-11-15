let bola;
let velocidadeBolaX, velocidadeBolaY;
let larguraRaquete = 10, alturaRaquete = 80;
let espessuraBarra = 5;
let posicaoJogadorY, posicaoComputadorY;
let pontosJogador = 0;
let pontosComputador = 0;
let fundo, imagemRaqueteJogador, imagemRaqueteComputador; // Variável para armazenar a imagem de fundo



function setup() {
    createCanvas(800, 400);
    fundo = loadImage('assets/fundo2.png'); // Carregando a imagem
    resetarBola();
    posicaoJogadorY = height / 2 - alturaRaquete / 2;
    posicaoComputadorY = height / 2 - alturaRaquete / 2;
}


function draw() {
    imageMode(CORNER); // Modo de imagem para desenhar a partir do canto superior esquerdo
    image(fundo, 0, 0, width, height); // Desenha a imagem no canvas, sem distorção, mantendo a proporção
    desenharBarras();
    desenharBola();
    desenharRaquetes();
    moverBola();
    moverRaqueteComputador();
    verificarColisoes();

    // Movimentação contínua da raquete do jogador
    posicaoJogadorY = constrain(mouseY - alturaRaquete / 2, 0, height - alturaRaquete);

    // Exibir pontuação
    textSize(32);
    fill(255);
    textAlign(CENTER, TOP);
    text(pontosJogador, width / 4, 20);
    text(pontosComputador, (width / 4) * 3, 20);
}



function resetarBola() {
    bola = createVector(width / 2, height / 2);
    velocidadeBolaX = random([-5, 5]);
    velocidadeBolaY = random(-3, 3);
}


function desenharBarras() {
    // Definir cor para as barras
    fill(color('#2b3fd6')); // Cor branca para as barras Azul
    noStroke(); // Remover bordas das barras

    // Barra superior
    rect(0, 0, width, espessuraBarra, 5); // Bordas arredondadas com raio 5

    // Barra inferior
    rect(0, height - espessuraBarra, width, espessuraBarra, 5); // Bordas arredondadas com raio 5
}

function desenharBola() {
    // Definir cor para a bola
    fill(0, 255, 255); // Cor ciano para a bola
    noStroke(); // Remover bordas da bola
    ellipse(bola.x, bola.y, 20, 20); // Desenhar a bola
}

function desenharRaquetes() {
    // Raquete do Jogador
    fill(0, 255, 0); // Cor verde para a raquete do jogador
    rect(30, posicaoJogadorY, larguraRaquete, alturaRaquete, 5); // Borda arredondada com raio 5

    // Raquete do Computador
    fill(255, 0, 0); // Cor vermelha para a raquete do computador
    rect(width - 40, posicaoComputadorY, larguraRaquete, alturaRaquete, 5); // Borda arredondada com raio 5
}


function moverBola() {
    bola.x += velocidadeBolaX;
    bola.y += velocidadeBolaY;

    // Colisão da bola com as barras superior e inferior
    if (bola.y < espessuraBarra || bola.y > height - espessuraBarra) {
        velocidadeBolaY *= -1;
    }

    // Verificar se a bola sai pela esquerda (ponto para o computador)
    if (bola.x < 0) {
        pontosComputador++;
        resetarBola();
    }

    // Verificar se a bola sai pela direita (ponto para o jogador)
    if (bola.x > width) {
        pontosJogador++;
        resetarBola();
    }
}


// Pode ser removida pois a movimentação será contínua.
// function mousePressed() {
//     posicaoJogadorY = mouseY - alturaRaquete / 2;
//     posicaoJogadorY = constrain(posicaoJogadorY, 0, height - alturaRaquete);
// }

function verificarColisoes() {
    // Verificar colisão com a raquete do jogador
    if (
        bola.x - 10 < 40 && // Ajustar para considerar o raio da bola
        bola.y > posicaoJogadorY && 
        bola.y < posicaoJogadorY + alturaRaquete
    ) {
        velocidadeBolaX *= -1;

        // Calcular a diferença entre o centro da raquete e o ponto de colisão da bola
        let diferencaY = bola.y - (posicaoJogadorY + alturaRaquete / 2);
        velocidadeBolaY = diferencaY * 0.2; // Ajustar o multiplicador para um ângulo bacana

        bola.x = 40 + 10; // Ajustar para fora da raquete, considerando o raio da bola
    }

    // Verificar colisão com a raquete do computador
    if (
        bola.x + 10 > width - 50 && // Ajustar para considerar o raio da bola
        bola.y > posicaoComputadorY && 
        bola.y < posicaoComputadorY + alturaRaquete
    ) {
        velocidadeBolaX *= -1;

        // Calcular a diferença entre o centro da raquete e o ponto de colisão da bola
        let diferencaY = bola.y - (posicaoComputadorY + alturaRaquete / 2);
        velocidadeBolaY = diferencaY * 0.2; // Ajustar o multiplicador para um ângulo bacana

        bola.x = width - 50 - 10; // Ajustar para fora da raquete, considerando o raio da bola
    }
}

function moverRaqueteComputador() {
    // A raquete do computador tentará antecipar a posição da bola
    let velocidadeComputador = 3;
    if (bola.y < posicaoComputadorY + alturaRaquete / 2 - 10) {
        posicaoComputadorY -= velocidadeComputador;
    } else if (bola.y > posicaoComputadorY + alturaRaquete / 2 + 10) {
        posicaoComputadorY += velocidadeComputador;
    }

    // Restringir raquete do computador dentro da tela
    posicaoComputadorY = constrain(posicaoComputadorY, 0, height - alturaRaquete);
}


function alterarVelocidadeBola() {
    // Aumenta ou diminui a velocidade da bola aleatoriamente após colisão com raquete
    let incrementoVelocidade = random(0.5, 1.5);
    velocidadeBolaX = velocidadeBolaX < 0 ? -incrementoVelocidade : incrementoVelocidade;
    velocidadeBolaY = random(-3, 3);
}
