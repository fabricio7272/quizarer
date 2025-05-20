fetch('http://127.0.0.1:1880/podioresposta')
  .then(res => res.text())
  .then(texto => {
    try {
      const jogadores = JSON.parse(texto);

      jogadores.sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        return a.tempo - b.tempo;
      });

      const lista = document.getElementById('ranking');
      lista.innerHTML = '';
      jogadores.forEach(({ nome, pontos, tempo }, i) => {
        const li = document.createElement('li');
        li.innerHTML =
          `<strong>${i + 1}º:</strong> ${nome} - ${pontos} pts - ${(tempo / 1000).toFixed(2)} s`;
        lista.appendChild(li);
      });

      /* 3. Atualiza o pódio (1º, 2º, 3º) */
      const nomesPodio = document.querySelectorAll('.podio .nome-jogador');
      if (jogadores[2]) nomesPodio[0].textContent = jogadores[2].nome; 
      if (jogadores[0]) nomesPodio[1].textContent = jogadores[0].nome; 
      if (jogadores[1]) nomesPodio[2].textContent = jogadores[1].nome; 

    } catch (erro) {
      console.error('Erro ao converter p/ JSON:', erro.message);
    }
  })
  .catch(console.error);
