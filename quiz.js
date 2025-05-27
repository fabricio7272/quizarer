// Declara variáveis globais do jogo
let pais;
let bandeira;
let pais_br;
let rodadaAtual = 0;
let pontuacao = 0;
let tempo = 0;
let intervaloTimer;
let api = [];

// Seleciona elementos para manipulação
const timerElemento = document.getElementById("timer");
const img = document.querySelector('.bandeira');
const frm = document.getElementById('input-resposta'); 
const botao = document.getElementById('btn-resposta');
const pontuacaoElemento = document.getElementById('pontuacao');
const nome_pais = document.getElementById('nome_pais'); 

// Obtém nome do usuário salvo no localStorage 
const nomeUsuario = localStorage.getItem("nomeUsuario") || "Anônimo";
document.getElementById("nomeUsuario").textContent = nomeUsuario;


document.addEventListener("DOMContentLoaded", () => {
    iniciarTimer();
    carregarAPI();
});

// Atualiza o nome do usuário se estiver salvo no localStorage
document.addEventListener("DOMContentLoaded", function () {
    const nomeSalvo = localStorage.getItem("nome");
    if (nomeSalvo) {
        document.getElementById("nomeUsuario").innerText = nomeSalvo;
    }
});

// Inicia o timer regressivo com 90 segundos
function iniciarTimer() {
    tempo = 90;
    timerElemento.innerText = `Tempo restante: ${tempo}s`;

    intervaloTimer = setInterval(() => {
        tempo--;
        timerElemento.innerText = `Tempo restante: ${tempo}s`;

        if (tempo <= 0) {
            pararTimer();
            finalizarJogo(); // Acaba o jogo automaticamente quando o tempo chega a 0
        }
    }, 1000);
}

// Para o timer
function pararTimer() {
    clearInterval(intervaloTimer);
}

// Carrega dados dos países da API REST Countries
function carregarAPI() {
    fetch('https://restcountries.com/v2/all')
        .then(response => response.json())
        .then(data => {
            api = data;
            sortPais();
        })
        .catch(error => console.error("Erro ao carregar API:", error));
}

// Escolhe um país aleatório da lista da API e atualiza a bandeira na tela
function sortPais() {    
    const paisAleatorio = api[Math.floor(Math.random() * api.length)];
    pais = paisAleatorio.name;
    bandeira = paisAleatorio.flags.png;
    pais_br = paisAleatorio.translations.pt || paisAleatorio.name;

    img.src = bandeira;
    nome_pais.innerText = "";
}

// Evento ao clicar no botão para enviar resposta
botao.addEventListener("click", () => {
    const resposta_pais = frm.value.trim();

    if (rodadaAtual < 10) {
        if (resposta_pais.toLowerCase() === pais_br.toLowerCase()) {
            pontuacao += 10;



            // popup de acerto
            document.getElementById("popupAcerto").style.display = "block";

            document.getElementById("somAcerto").play();

            document.getElementById("closePopupAcerto").onclick = () => {
                document.getElementById("popupAcerto").style.display = "none";

                pontuacaoElemento.innerText = `Pontos: ${pontuacao}`;
                frm.value = "";
                rodadaAtual++;

                if (rodadaAtual < 10) {
                    sortPais();
                } else {
                    finalizarJogo();
                }
            };

        } else {
            pontuacao -= 5;


            // popup de erro 
            document.getElementById("erroNomePais").innerHTML = `<strong>Resposta Correta:</strong><br>${pais_br}`;
            document.getElementById("popupErro").style.display = "block";

            document.getElementById("somErro").play();

            document.getElementById("closePopupErro").onclick = () => {
                document.getElementById("popupErro").style.display = "none";

                pontuacaoElemento.innerText = `Pontos: ${pontuacao}`;
                frm.value = "";
                rodadaAtual++;

                if (rodadaAtual < 10) {
                    sortPais();
                } else {
                    finalizarJogo();
                }
            };
        }
    }
});


// Finaliza o jogo, para o timer e envia dados para o servidor antes de ir para o pódio
function finalizarJogo() {
    pararTimer();
    const nome = localStorage.getItem("nome");
    if (nome) {
        enviarDadosParaServidor(nome, pontuacao, tempo);
    }
    window.location.href = "podio.html";
}

// Envia dados do jogador para o servidor via requisição fetch
function enviarDadosParaServidor(nome, pontos, tempo) {
    const url = `http://127.0.0.1:1880/resposta?usuario=${encodeURIComponent(nome)}&pontuacao=${pontos}&segundos=${tempo}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log("Dados enviados com sucesso!");
            } else {
                console.error("Erro ao enviar dados para o servidor.");
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });
}
