```javascript
(function () {
  'use strict';

  /*
   * =========================================================
   * DICAS TECH WEBER
   * QUIZ INTERATIVO — JAVASCRIPT
   *
   * Este script atua SOMENTE dentro de:
   * .dicas-tech-blog .tech-quiz-box
   *
   * CSS e JavaScript permanecem hospedados no GitHub.
   * =========================================================
   */


  /* =========================================================
     INICIALIZAÇÃO DO QUIZ
     ========================================================= */

  function inicializarQuiz(quiz) {

    if (!quiz) return;

    /* Evita inicialização duplicada */
    if (quiz.dataset.quizInicializado === 'true') {
      return;
    }

    quiz.dataset.quizInicializado = 'true';


    /* =======================================================
       VARIÁVEIS
       ======================================================= */

    let indiceAtual = 0;
    let pontuacao = 0;

    const perguntas = Array.from(
      quiz.querySelectorAll('.tech-quiz-pergunta')
    );

    const totalPerguntas = perguntas.length;

    const progresso =
      quiz.querySelector('.tech-quiz-progresso');

    const numAtual =
      quiz.querySelector('.num-atual');

    const placar =
      quiz.querySelector('.placar-parcial');

    const resultadoFinal =
      quiz.querySelector('.tech-resultado-final');

    const resultadoTexto =
      quiz.querySelector('.resultado-texto');


    /* =======================================================
       VALIDAÇÃO
       ======================================================= */

    if (!perguntas.length) {
      return;
    }


    /* =======================================================
       GARANTE TYPE="BUTTON"
       Evita comportamento indesejado em formulários do Blogger
       ======================================================= */

    quiz.querySelectorAll('button').forEach(function (botao) {
      botao.type = 'button';
    });


    /* =======================================================
       ATUALIZA SELEÇÃO
       ======================================================= */

    function atualizarSelecao(container) {

      if (!container) return;

      container
        .querySelectorAll('.tech-opcao')
        .forEach(function (opcao) {

          const radio =
            opcao.querySelector('input[type="radio"]');

          opcao.classList.toggle(
            'selecionada',
            !!radio && radio.checked
          );

        });
    }


    /* =======================================================
       MOSTRAR PERGUNTA
       ======================================================= */

    function mostrarPergunta(indice) {

      perguntas.forEach(function (pergunta, i) {

        pergunta.classList.toggle(
          'ativa',
          i === indice
        );

      });

      if (numAtual) {
        numAtual.textContent =
          String(indice + 1);
      }
    }


    /* =======================================================
       RESPONDER PERGUNTA
       ======================================================= */

    function responder(btn) {

      const container =
        btn.closest('.tech-quiz-pergunta');

      if (!container) return;


      const correta =
        Number(container.dataset.correta);


      const opcoes =
        Array.from(
          container.querySelectorAll('.tech-opcao')
        );


      const selecionado =
        container.querySelector(
          'input[type="radio"]:checked'
        );


      const feedback =
        container.querySelector(
          '.tech-feedback-msg'
        );


      const btnProxima =
        container.querySelector(
          '.tech-btn-proxima'
        );


      /* =====================================================
         VERIFICA SE O USUÁRIO ESCOLHEU UMA RESPOSTA
         ===================================================== */

      if (!selecionado) {

        if (feedback) {

          feedback.className =
            'tech-feedback-msg erro';

          feedback.textContent =
            '⚠️ Por favor, escolha uma alternativa antes de responder!';
        }

        return;
      }


      /* =====================================================
         BLOQUEIA AS RESPOSTAS
         ===================================================== */

      container
        .querySelectorAll('input[type="radio"]')
        .forEach(function (input) {

          input.disabled = true;

        });


      btn.disabled = true;


      /* =====================================================
         ESCONDE BOTÃO RESPONDER
         ===================================================== */

      btn.classList.add('oculto');


      /* =====================================================
         VERIFICA RESPOSTA
         ===================================================== */

      const valorEscolhido =
        Number(selecionado.value);


      opcoes.forEach(function (opcao, idx) {

        opcao.classList.remove(
          'correta',
          'incorreta'
        );


        if (idx === correta) {

          opcao.classList.add('correta');

        }


        if (
          idx === valorEscolhido &&
          idx !== correta
        ) {

          opcao.classList.add('incorreta');

        }

      });


      /* =====================================================
         FEEDBACK
         ===================================================== */

      if (valorEscolhido === correta) {

        pontuacao++;

        if (feedback) {

          feedback.className =
            'tech-feedback-msg acerto';

          feedback.textContent =
            '✓ Parabéns! Resposta correta.';
        }

      } else {

        if (feedback) {

          feedback.className =
            'tech-feedback-msg erro';

          feedback.textContent =
            '✕ Resposta incorreta. A opção correta está indicada em verde.';
        }
      }


      /* =====================================================
         ATUALIZA PLACAR
         ===================================================== */

      if (placar) {

        placar.textContent =
          'Pontos: ' + pontuacao;

      }


      /* =====================================================
         MOSTRA PRÓXIMA PERGUNTA
         ===================================================== */

      if (btnProxima) {

        btnProxima.classList.add('visivel');

      }

    }


    /* =======================================================
       PRÓXIMA PERGUNTA
       ======================================================= */

    function proximaPergunta() {

      if (!perguntas[indiceAtual]) {
        return;
      }


      perguntas[indiceAtual]
        .classList.remove('ativa');


      indiceAtual++;


      /* =====================================================
         AINDA EXISTEM PERGUNTAS
         ===================================================== */

      if (indiceAtual < totalPerguntas) {

        mostrarPergunta(indiceAtual);

        return;
      }


      /* =====================================================
         FINAL DO QUIZ
         ===================================================== */

      if (progresso) {

        progresso.classList.add('oculto');

      }


      if (resultadoFinal) {

        resultadoFinal.classList.add('ativo');

      }


      let mensagem;


      if (pontuacao === totalPerguntas) {

        mensagem =
          'Excelente! Você gabaritou o quiz sobre IA! 🚀';

      } else if (
        pontuacao >= Math.ceil(totalPerguntas * 0.6)
      ) {

        mensagem =
          'Muito bem! Você tem um bom conhecimento sobre o assunto!';

      } else {

        mensagem =
          'Vale a pena reler o artigo para fixar ainda mais os conceitos!';

      }


      if (resultadoTexto) {

        resultadoTexto.innerHTML =

          '<p style="margin:0 0 10px;font-size:22px;">' +
          '🎉 <strong>Quiz Concluído!</strong>' +
          '</p>' +

          '<p style="margin:0 0 10px;">' +
          'Você acertou <strong>' +
          pontuacao +
          ' de ' +
          totalPerguntas +
          '</strong> perguntas.' +
          '</p>' +

          '<p style="margin:0;color:#55725e;">' +
          mensagem +
          '</p>';

      }

    }


    /* =======================================================
       REINICIAR QUIZ
       ======================================================= */

    function reiniciarQuiz() {

      indiceAtual = 0;
      pontuacao = 0;


      perguntas.forEach(function (pergunta, i) {

        pergunta.classList.toggle(
          'ativa',
          i === 0
        );


        pergunta
          .querySelectorAll('input[type="radio"]')
          .forEach(function (input) {

            input.checked = false;
            input.disabled = false;

          });


        pergunta
          .querySelectorAll('.tech-opcao')
          .forEach(function (opcao) {

            opcao.classList.remove(
              'correta',
              'incorreta',
              'selecionada'
            );

          });


        const feedback =
          pergunta.querySelector(
            '.tech-feedback-msg'
          );


        if (feedback) {

          feedback.className =
            'tech-feedback-msg';

          feedback.textContent = '';

        }


        const btnResponder =
          pergunta.querySelector(
            '.btn-responder'
          );


        if (btnResponder) {

          btnResponder.disabled = false;

          btnResponder.classList.remove('oculto');

        }


        const btnProxima =
          pergunta.querySelector(
            '.tech-btn-proxima'
          );


        if (btnProxima) {

          btnProxima.classList.remove('visivel');

        }

      });


      if (resultadoFinal) {

        resultadoFinal.classList.remove('ativo');

      }


      if (progresso) {

        progresso.classList.remove('oculto');

      }


      if (numAtual) {

        numAtual.textContent = '1';

      }


      if (placar) {

        placar.textContent = 'Pontos: 0';

      }

    }


    /* =======================================================
       EVENTO CHANGE
       ======================================================= */

    quiz.addEventListener(
      'change',
      function (event) {

        if (
          event.target.matches(
            'input[type="radio"]'
          )
        ) {

          const container =
            event.target.closest(
              '.tech-quiz-pergunta'
            );


          if (container) {

            atualizarSelecao(container);

          }

        }

      }
    );


    /* =======================================================
       EVENTO CLICK
       ======================================================= */

    quiz.addEventListener(
      'click',
      function (event) {

        const responderBtn =
          event.target.closest(
            '.btn-responder'
          );


        const proximaBtn =
          event.target.closest(
            '.tech-btn-proxima'
          );


        const reiniciarBtn =
          event.target.closest(
            '.btn-reiniciar'
          );


        if (responderBtn) {

          responder(responderBtn);

          return;

        }


        if (proximaBtn) {

          proximaPergunta();

          return;

        }


        if (reiniciarBtn) {

          reiniciarQuiz();

        }

      }
    );


    /* =======================================================
       ESTADO INICIAL
       ======================================================= */

    mostrarPergunta(0);

  }


  /* =========================================================
     INICIALIZAÇÃO GERAL
     ========================================================= */

  function iniciar() {

    document
      .querySelectorAll(
        '.dicas-tech-blog .tech-quiz-box'
      )
      .forEach(inicializarQuiz);

  }


  /* =========================================================
     DOM READY
     ========================================================= */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      iniciar
    );

  } else {

    iniciar();

  }

})();
```
