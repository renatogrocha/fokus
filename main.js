//Declaração de referências
const html = document.querySelector('html');
const focoBotao = document.querySelector('.app__card-button--foco');
const curtoBotao = document.querySelector('.app__card-button--curto');
const longoBotao = document.querySelector('.app__card-button--longo');
const iniciarTempo = document.querySelector('.app__card-primary-button');
const botoes = document.querySelectorAll('.app__card-button');
const displayTempo = document.getElementById('timer');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const musicaFocoInput = document.getElementById('alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop = true;
const somPlay = new Audio('/sons/play.wav');
const somPause = new Audio('/sons/pause.mp3');
const somConcluido = new Audio('/sons/beep.mp3');
let tempoDecorridoEmSegundos = 15;
let intervalo = null;
const startPauseBt = document.getElementById('start-pause');
const textoStarPauseBt = document.querySelector('#start-pause span');
const imgStartPauseBt = document.querySelector('.app__card-primary-button-icon');
const tempoNaTela = document.getElementById('timer');
const tempoFoco = 15;
const tempoDescansoCurto = 10;
const tempoDescansoLongo = 20;

//Alternando entre os botões de 'foco', 'descanso curto' e 'descanso longo', atualizando o texto da página
function alterarContexto(contexto) {
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = 'Otimize sua produtividade, <strong class="app__title-strong">mergulhe no que importa.</strong>';
            break;
        case "descanso-curto":
            titulo.innerHTML = 'Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>';
            break;
        case "descanso-longo":
            titulo.innerHTML = 'Hora de voltar à superfície. <strong class="app__title-strong">Faça uma pausa longa.</strong>';
            break;
        default:
            break;
    }
}

//*Funções*
//Função responsável por iniciar e pausar, conforme evento de clique, a contagem do tempo e alterar visualmente os elementos relacionados
function comecarOuPausar() {
    if (intervalo) {
        somPause.play();
        zerar();
        textoStarPauseBt.textContent = 'Começar';
        imgStartPauseBt.setAttribute('src', '/imagens/play_arrow.png');
        return
    }
    somPlay.play();
    intervalo = setInterval(contagemRegressiva, 1000);
    textoStarPauseBt.textContent = 'Pausar';
    imgStartPauseBt.setAttribute('src', '/imagens/pause.png');
}

//Zera o tempo de contagem
function zerar() {
    clearInterval(intervalo);
    intervalo = null;
}

//Formata o tempo que aparece na tela ao padrão desejado
function imprimirTempoNaTela() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    let tempoFormatado = tempo.toLocaleTimeString('pt-BR', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = tempoFormatado;
}

//Realiza a contagem regressiva e cria o evento ao ser concluída no modo 'foco'
const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        //somConcluido.play();
        alert('Tempo concluído!');
        textoStarPauseBt.textContent = 'Começar';
        imgStartPauseBt.setAttribute('src', '/imagens/play_arrow.png');
        zerar();
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const eventoFocoFinalizado = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(eventoFocoFinalizado);
        }
        return;
    }
    else {
        tempoDecorridoEmSegundos -= 1;
        imprimirTempoNaTela()
    }
}

//*Eventos*
//Alterna o estado da música entre play e pause conforme clique
musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    }
    else {
        musica.pause();
    }
})

//Evento de clique do botão de 'foco', alterando o visual, o tempo conforme o contexto e atualizando as informações na tela
focoBotao.addEventListener('click', () => {
    alterarContexto('foco');
    focoBotao.classList.add('active');
    tempoDecorridoEmSegundos = tempoFoco;
    imprimirTempoNaTela()
})

//Evento de clique do botão de 'descanso curto', alterando o visual, o tempo conforme o contexto e atualizando as informações na tela
curtoBotao.addEventListener('click', () => {
    alterarContexto('descanso-curto');
    curtoBotao.classList.add('active');
    tempoDecorridoEmSegundos = tempoDescansoCurto;
    imprimirTempoNaTela()
})

//Evento de clique do botão de 'descanso longo', alterando o visual, o tempo conforme o contexto e atualizando as informações na tela
longoBotao.addEventListener('click', () => {
    alterarContexto('descanso-longo');
    longoBotao.classList.add('active');
    tempoDecorridoEmSegundos = tempoDescansoLongo;
    imprimirTempoNaTela()
})

//Evento de clique do botão de 'começar' e 'pausar' a contagem regressiva
startPauseBt.addEventListener('click', comecarOuPausar);

//Chama a função responsável pro mostrar o tempo na tela
imprimirTempoNaTela()