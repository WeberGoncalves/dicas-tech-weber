(function () {
  'use strict';

  function inicializarQuiz(quiz) {
    if (!quiz || quiz.dataset.quizInicializado === 'true') return;
    quiz.dataset.quizInicializado = 'true';

    let indiceAtual = 0;
    let pontuacao = 0;
    const perguntas = Array.from(quiz.querySelectorAll('.tech-quiz-pergunta'));
    const totalPerguntas = perguntas.length;
    const progresso = quiz.querySelector('.tech-quiz-progresso');
    const numAtual = quiz.querySelector('.num-atual');
    const placar = quiz.querySelector('.placar-parcial');
    const resultadoFinal = quiz.querySelector('.resultado-final');
    const resultadoTexto = quiz.querySelector('.resultado-texto');

    if (!perguntas.length) return;

    function atualizarSelecao(container) {
      container.querySelectorAll('.tech-opcao').forEach(opcao => {
        const radio = opcao.querySelector('input[type="radio"]');
        opcao.classList.toggle('selecionada', !!radio && radio.checked);
      });
    }

    function mostrarPergunta(indice) {
      perguntas.forEach((p, i) => p.classList.toggle('ativa', i === indice));
      if (numAtual) numAtual.textContent = String(indice + 1);
    }

    function responder(btn) {
      const container = btn.closest('.tech-quiz-pergunta');
      if (!container) return;

      const correta = Number(container.dataset.correta);
      const opcoes = Array.from(container.querySelectorAll('.tech-opcao'));
      const selecionado = container.querySelector('input[type="radio"]:checked');
      const feedback = container.querySelector('.tech-feedback-msg');
      const btnProxima = container.querySelector('.tech-btn-proxima');

      if (!selecionado) {
        feedback.className = 'tech-feedback-msg erro';
        feedback.textContent = '⚠️ Por favor, escolha uma alternativa antes de responder!';
        return;
      }

      container.querySelectorAll('input[type="radio"]').forEach(input => {
        input.disabled = true;
      });
      btn.disabled = true;
      btn.style.display = 'none';

      const valorEscolhido = Number(selecionado.value);

      opcoes.forEach((opcao, idx) => {
        opcao.classList.remove('correta', 'incorreta');
        if (idx === correta) opcao.classList.add('correta');
        if (idx === valorEscolhido && idx !== correta) opcao.classList.add('incorreta');
      });

      if (valorEscolhido === correta) {
        pontuacao++;
        feedback.className = 'tech-feedback-msg acerto';
        feedback.textContent = '✓ Parabéns! Resposta correta.';
      } else {
        feedback.className = 'tech-feedback-msg erro';
        feedback.textContent = '✕ Resposta incorreta. A opção correta está indicada em verde.';
      }

      if (placar) placar.textContent = `Pontos: ${pontuacao}`;
      if (btnProxima) btnProxima.style.display = 'inline-block';
    }

    function proximaPergunta() {
      perguntas[indiceAtual].classList.remove('ativa');
      indiceAtual++;

      if (indiceAtual < totalPerguntas) {
        mostrarPergunta(indiceAtual);
      } else {
        if (progresso) progresso.style.display = 'none';
        if (resultadoFinal) resultadoFinal.style.display = 'block';

        let mensagem;
        if (pontuacao === totalPerguntas) {
          mensagem = 'Excelente! Você gabaritou o quiz sobre IA! 🚀';
        } else if (pontuacao >= Math.ceil(totalPerguntas * 0.6)) {
          mensagem = 'Muito bem! Você tem um bom conhecimento sobre o assunto!';
        } else {
          mensagem = 'Vale a pena reler o artigo para fixar ainda mais os conceitos!';
        }

        if (resultadoTexto) {
          resultadoTexto.innerHTML = `
            <p style="margin: 0 0 10px; font-size: 22px;">🎉 <strong>Quiz Concluído!</strong></p>
            <p style="margin: 0 0 10px;">Você acertou <strong>${pontuacao} de ${totalPerguntas}</strong> perguntas.</p>
            <p style="margin: 0; color: #55725e;">${mensagem}</p>
          `;
        }
      }
    }

    function reiniciarQuiz() {
      indiceAtual = 0;
      pontuacao = 0;

      perguntas.forEach((p, i) => {
        p.classList.toggle('ativa', i === 0);
        p.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
          input.disabled = false;
        });
        p.querySelectorAll('.tech-opcao').forEach(opcao => {
          opcao.classList.remove('correta', 'incorreta', 'selecionada');
        });
        const feedback = p.querySelector('.tech-feedback-msg');
        if (feedback) feedback.className = 'tech-feedback-msg';
        const btnResponder = p.querySelector('.btn-responder');
        if (btnResponder) {
          btnResponder.disabled = false;
          btnResponder.style.display = 'inline-block';
        }
        const btnProxima = p.querySelector('.tech-btn-proxima');
        if (btnProxima) btnProxima.style.display = 'none';
      });

      if (resultadoFinal) resultadoFinal.style.display = 'none';
      if (progresso) progresso.style.display = 'flex';
      if (numAtual) numAtual.textContent = '1';
      if (placar) placar.textContent = 'Pontos: 0';
    }

    quiz.addEventListener('change', function (event) {
      if (event.target.matches('input[type="radio"]')) {
        const container = event.target.closest('.tech-quiz-pergunta');
        if (container) atualizarSelecao(container);
      }
    });

    quiz.addEventListener('click', function (event) {
      const responderBtn = event.target.closest('.btn-responder');
      const proximaBtn = event.target.closest('.tech-btn-proxima');
      const reiniciarBtn = event.target.closest('.btn-reiniciar');

      if (responderBtn) responder(responderBtn);
      else if (proximaBtn) proximaPergunta();
      else if (reiniciarBtn) reiniciarQuiz();
    });

    mostrarPergunta(0);
  }

  function iniciar() {
    document.querySelectorAll('.tech-quiz-box').forEach(inicializarQuiz);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
