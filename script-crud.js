//Declaração de referências
const formulario = document.querySelector('.app__form-add-task');
const btAdicionarTarefa = document.querySelector('.app__button--add-task');
const btCancelar = document.querySelector('.app__form-footer__button--cancel');
const btRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btRemoverTodas = document.querySelector('#btn-remover-todas')
const textoArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
let paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

//Referência para iniciar a Lista das tarefas ou chamar as já adicionadas
let listaDeTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

//*Funções*
//Função que irá inserir visualmente na página as tarefas criadas
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    
    //Referência do ícone de status da tarefa
    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="#FFF"></circle> <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path> </svg>
    `
    //Elemento referente a tarefa adicionada
    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    //Botão de edição
    const botao = document.createElement('button');
    botao.classList.add('app__button-edit');
    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    //Para quando o botão de edição for clicado
    botao.addEventListener('click', () => {
        const novaDescricao = prompt('Digite a edição da tarefa:');
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    })

    //Trecho que controla a funcionalidade de selecionar dos elementos da lista
    if (tarefa.completa !== true) {
        li.addEventListener('click', () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active');
            })

            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }

            li.classList.add('app__section-task-list-item-active');
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
        })
    }
    //Se a tarefa já estiver completa, este trecho alterará visualmente e desabilitará o botão de edição
    else {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
        li.removeEventListener('click', null);
    }

    return li;
}

//Função responsável por atualizar as informações no LocalStorage
function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(listaDeTarefas));
}

function limparFormulario() {
    textoArea.value = '';
    formulario.classList.add('hidden');
}

//Remove todas as tarefas ou somente as completas, de acordo com a condição, determinada de acordo com qual botão foi clicado 
const removerTarefas = (somenteCompletas) => {
    let seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    listaDeTarefas = somenteCompletas ? listaDeTarefas.filter(tarefas => !tarefas.completa) : [];
    atualizarTarefas();
}

//*Eventos*
//EventListener responsável por carregar a página com as tarefas já inseridas anteriormente
document.addEventListener('DOMContentLoaded', function () {
    listaDeTarefas.forEach(tarefa => {
        const elementoTarefa = criarElementoTarefa(tarefa);
        ulTarefas.append(elementoTarefa);
    })
})

//Habilita o formulário para inserção da atividade
btAdicionarTarefa.addEventListener('click', () => {
    formulario.classList.toggle('hidden');
})

//Chama as funções para atualizar o visual da página e as informações da array de tarefas no LocalStorage
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textoArea.value
    }
    listaDeTarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    limparFormulario();
})

//Cancela a adição da tarefa com o 'click' do botão Cancelar no formulário
btCancelar.addEventListener('click', limparFormulario)

//Ao receber o evento do tempo de foco finalizado, remove a seleção visual da tarefa e altera para concluído
document.addEventListener('FocoFinalizado', () => {
    liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
    liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
    liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
    tarefaSelecionada.completa = true;
    atualizarTarefas();
})

btRemoverConcluidas.addEventListener('click', () => {
    removerTarefas(true);
    paragrafoDescricaoTarefa.textContent = ''
})
    
btRemoverTodas.addEventListener('click', () => {
    removerTarefas(false);
    paragrafoDescricaoTarefa.textContent = '';
})