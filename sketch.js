let bola;
let velocidadeBolaX, velocidadeBolaY;
let larguraRaquete = 10, alturaRaquete = 80;
let espessuraBarra = 5;
let posicaoJogadorY, posicaoComputadorY;

function setup() {
    createCanvas(800, 400);
    resetarBola();
    posicaoJogadorY = height / 2 - alturaRaquete / 2;
    posicaoComputadorY = height / 2 - alturaRaquete / 2;
}

function draw() {
    background(0);
    desenharBarras();
    desenharBola();
    desenharRaquetes();
    moverBola();
    moverRaqueteComputador();
    verificarColisoes();
}

function resetarBola() {
    bola = createVector(width / 2, height / 2);
    velocidadeBolaX = random([-5, 5]);
    velocidadeBolaY = random(-3, 3);
}

function desenharBarras() {
    // Barra superior
    rect(0, 0, width, espessuraBarra);

    // Barra inferior
    rect(0, height - espessuraBarra, width, espessuraBarra);
}

function desenharBola() {
    ellipse(bola.x, bola.y, 20, 20);
}

function desenharRaquetes() {
    // Raquete do Jogador
    rect(30, posicaoJogadorY, larguraRaquete, alturaRaquete);

    // Raquete do Computador
    rect(width - 40, posicaoComputadorY, larguraRaquete, alturaRaquete);
}

function moverBola() {
    bola.x += velocidadeBolaX;
    bola.y += velocidadeBolaY;

    // Colisão da bola com as barras superior e inferior
    if (bola.y < espessuraBarra || bola.y > height - espessuraBarra) {
        velocidadeBolaY *= -1;
    }

    // Bola sai pela esquerda ou direita (resetar)
    if (bola.x < 0 || bola.x > width) {
        resetarBola();
    }
}

function mousePressed() {
    // Mover raquete do jogador para a posição vertical do mouse ao clicar
    posicaoJogadorY = mouseY - alturaRaquete / 2;

    // Restringir raquete do jogador dentro da tela
    posicaoJogadorY = constrain(posicaoJogadorY, 0, height - alturaRaquete);
}

function verificarColisoes() {
    // Verificar colisão com a raquete do jogador
    if (
        bola.x < 40 && 
        bola.y > posicaoJogadorY && 
        bola.y < posicaoJogadorY + alturaRaquete
    ) {
        velocidadeBolaX *= -1;
        // Quando a bola é devolvida pelo jogador, aleatorizar a posição da raquete do computador
        posicaoComputadorY = random(height - alturaRaquete);
    }

    // Verificar colisão com a raquete do computador
    if (
        bola.x > width - 50 && 
        bola.y > posicaoComputadorY && 
        bola.y < posicaoComputadorY + alturaRaquete
    ) {
        velocidadeBolaX *= -1;
    }
}

function moverRaqueteComputador() {
    // A raquete do computador irá lentamente para a posição aleatória
    let velocidadeComputador = 3;
    if (posicaoComputadorY < bola.y - alturaRaquete / 2) {
        posicaoComputadorY += velocidadeComputador;
    } else if (posicaoComputadorY > bola.y - alturaRaquete / 2) {
        posicaoComputadorY -= velocidadeComputador;
    }

    // Restringir raquete do computador dentro da tela
    posicaoComputadorY = constrain(posicaoComputadorY, 0, height - alturaRaquete);
}
