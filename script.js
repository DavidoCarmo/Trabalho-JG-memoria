// todo o artigo foi traduzido e explicado para melhor entendimento


// Array contendo os dados de cada carta (nome e imagem)
const cardsArray = [
    { name: 'goofy01', img: 'assets/foto1.jpg' },
    { name: 'goofy02', img: 'assets/foto2.jpg' },
    { name: 'goofy03', img: 'assets/foto3.jpg' },
    { name: 'goofy04', img: 'assets/foto4.jpg' },
    { name: 'goofy05', img: 'assets/foto5.jpg' },
    { name: 'goofy06', img: 'assets/foto6.jpg' },
    { name: 'goofy07', img: 'assets/foto7.jpg' },
    { name: 'goofy08', img: 'assets/foto8.jpg' }
];

// Duplicando o array para criar pares de cada carta
let cards = [...cardsArray, ...cardsArray];

// Variáveis para controlar o estado do jogo
let hasFlippedCard = false; // Para verificar se uma carta já foi virada
let firstCard, secondCard; // Armazenam as cartas viradas
let lockBoard = false; // Bloqueia o tabuleiro temporariamente durante verificações
let matchedCards = 0; // Contador de pares de cartas correspondentes
let timer; // Armazena o cronômetro
let timeStart = false; // Para verificar se o cronômetro já foi iniciado
let totalTime = 0; // Total de tempo gasto no jogo



// Embaralhar as cartas aleatoriamente (usando sort com comparação randômica)
cards = cards.sort(() => 0.5 - Math.random());



// Criar o tabuleiro de jogo (adicionando as cartas ao HTML)
const gameBoard = document.getElementById('game-board');
cards.forEach(card => {
    // Criação de cada carta com a classe 'memory-card'
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    cardElement.setAttribute('data-name', card.name); // Definindo o nome da carta para comparação futura


    // Definição da estrutura da carta (frente e verso)
    cardElement.innerHTML = `
        <div class="memory-card-inner">
            <div class="memory-card-front"></div> <!-- Parte da frente da carta (vazia ou com estilo padrão) -->
            <div class="memory-card-back"> <!-- Parte de trás da carta com a imagem -->
                <img src="${card.img}" alt="${card.name}">
            </div>
        </div>
    `;
    

    // Adicionar a carta criada ao tabuleiro
    gameBoard.appendChild(cardElement);
});


// Função responsável por virar a carta
function flipCard() {


    // Se o tabuleiro estiver bloqueado ou a mesma carta for clicada novamente, não faz nada
    if (lockBoard) return;
    if (this === firstCard) return;


    // Adiciona a classe 'flip' para girar a carta
    this.classList.add('flip');


    // Se ainda não há carta virada, armazena a primeira carta virada
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;



        // Iniciar o cronômetro ao virar a primeira carta
        if (!timeStart) {
            startTimer();
            timeStart = true;
        }
        return;
    }


    // Se há uma carta virada, armazena a segunda e verifica se são iguais
    secondCard = this;
    checkForMatch();
}



// Função para verificar se as duas cartas viradas são iguais
function checkForMatch() {


    // Verifica se o nome das duas cartas é igual
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    // Se forem iguais, desabilita o clique nelas, senão desvira as cartas
    isMatch ? disableCards() : unflipCards();
}

// Função que desabilita o clique nas cartas correspondentes (pares encontrados)
function disableCards() {

    // Remove o evento de clique nas cartas que foram correspondidas
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);


    // Incrementa o número de cartas correspondentes
    matchedCards += 2;

    // Se todas as cartas foram correspondidas, encerra o jogo
    if (matchedCards === cards.length) {
        clearInterval(timer); // Para o cronômetro
        alert(`Você venceu! Tempo: ${formatTime(totalTime)}`); // Exibe o tempo total
    }

    // Reseta o estado das variáveis de controle
    resetBoard();
}

// Função para desvirar as cartas se não forem correspondentes
function unflipCards() {


    // Bloqueia o tabuleiro enquanto as cartas são desviradas
    lockBoard = true;

    // Espera 1 segundo para que as cartas sejam desviradas
    setTimeout(() => {

        firstCard.classList.remove('flip'); // Remove o efeito de giro da primeira carta
        secondCard.classList.remove('flip'); // Remove o efeito de giro da segunda carta
        resetBoard(); // Reseta o estado das variáveis
    }, 1000);
}

// Função para resetar as variáveis de controle (para uma nova rodada)
function resetBoard() {
    // Reseta o estado de controle
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Função para iniciar o cronômetro ao virar a primeira carta
function startTimer() {
    
    // Inicia um cronômetro que incrementa a cada segundo
    timer = setInterval(() => {
        totalTime++;
        document.getElementById('timer').innerText = `Tempo: ${formatTime(totalTime)}`; // Atualiza o contador no HTML
    }, 1000); // Atualiza a cada 1 segundo
}

// Função para formatar o tempo em minutos e segundos (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60); // Calcula os minutos
    const secs = seconds % 60; // Calcula os segundos restantes
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`; // Retorna o tempo formatado como mm:ss
}

// Adicionando o evento de clique a todas as cartas
document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('click', flipCard); // Ativa o flipCard ao clicar na carta
});
