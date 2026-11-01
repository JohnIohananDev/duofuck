
 // ==UserScript==
 // @name         DuoFuck by Wohn37
 // @namespace    wohn.duofuck
 // @version      3.4.0
 // @description  Assistente de licoes e traducao
 // @author       JohnIohananDev (Wohn37)
 // @match        https://www.duolingo.com/*
 // @grant        GM_xmlhttpRequest
 // @connect      api.mymemory.translated.net
 // @run-at       document-idle
 // ==/UserScript==

 (() => {
   'use strict';

   if (document.getElementById('duofuck-wohn')) return;

   const host = document.createElement('div');
   host.id = 'duofuck-wohn';
   const root = host.attachShadow({ mode: 'open' });
   const $ = id => root.getElementById(id);

   let answer = '';
   let translation = '';
   let loading = false;
   let signature = '';
   let unlockCopy = false;

   const icon = `
   <svg viewBox="0 0 160 154" xmlns="http://www.w3.org/2000/svg">
     <path fill="#64C904" d="M0 0h160v154H0z"/>
     <polygon fill="#8FDD1D" points="1,44 5,47 5,32 9,25 13,25 54,53 70,55 86,49 95,40 119,3 122,2 125,3 129,9 133,21 140,11 145,11 152,22 157,33 157,122 149,126 138,129 121,129 114,127 108,124 109,116 105,108 98,99 92,96 82,96 71,105 65,130 56,141 45,146 35,148 16,147 7,143 1,138"/>
     <polygon fill="#FEFEFE" points="11,64 19,59 25,57 41,57 54,63 61,70 67,82 68,104 63,116 59,121 6,118 1,110 1,78 5,70"/>
     <polygon fill="#FEFEFE" points="128,37 137,38 145,41 152,46 157,52 157,99 149,107 141,111 133,113 126,113 117,111 109,107 99,96 94,82 94,65 99,53 109,43 117,39"/>
     <polygon fill="#414141" points="42,72 50,77 51,80 45,90 54,97 55,100 54,103 48,109 45,109 37,104 30,113 27,113 19,107 19,103 24,95 16,89 15,84 18,79 22,76 26,77 31,81 33,81 39,73"/>
     <polygon fill="#414141" points="136,55 143,60 143,65 138,73 147,80 147,85 143,91 141,92 138,92 130,87 124,95 121,96 118,95 112,90 112,86 117,78 108,70 108,66 112,60 114,59 118,59 125,64 131,56"/>
     <polygon fill="#FDC501" points="69,117 70,111 73,105 81,98 86,97 93,98 98,101 105,108 109,116 108,118 105,116 99,108 93,105 87,104 78,107 73,112 72,115"/>
     <polygon fill="#944200" points="73,116 79,108 85,106 90,106 96,108 103,115 92,117 87,115 80,118 77,116"/>
     <polygon fill="#F68200" points="107,119 104,117 97,117 93,119 87,127 86,135 90,134 98,129"/>
     <polygon fill="#FEA8D2" points="91,118 86,117 80,120 77,118 73,118 69,122 67,127 66,135 70,142 78,143 82,140 84,136 85,127"/>
     <polygon fill="#51B407" points="117,118 123,120 125,118 124,116 118,115"/>
   </svg>`;

   root.innerHTML = `
   <style>
     :host {
       font-family: system-ui, Arial, sans-serif;
       color-scheme: dark;
     }

     * { box-sizing: border-box; }

     button, textarea, select { font: inherit; }
     button { cursor: pointer; }

     #launcher {
       position: fixed;
       right: 18px;
       bottom: 75px;
       width: 49px;
       height: 49px;
       padding: 0;
       border: 1px solid #36443a;
       background: #181e1a;
       border-radius: 13px;
       overflow: hidden;
       box-shadow: 0 7px 23px #0007;
       z-index: 2147483646;
     }

     #launcher svg {
       width: 100%;
       height: 100%;
       display: block;
     }

     #panel {
       position: fixed;
       right: 18px;
       bottom: 135px;
       width: min(330px, calc(100vw - 36px));
       max-height: 76vh;
       overflow-y: auto;
       background: #171c19;
       border: 1px solid #344239;
       border-radius: 13px;
       box-shadow: 0 15px 40px #0009;
       color: #eaf1eb;
       font-size: 13px;
       z-index: 2147483646;
       display: none;
     }

     #panel.open { display: block; }

     #panel::-webkit-scrollbar { width: 5px; }
     #panel::-webkit-scrollbar-thumb {
       background: #435448;
       border-radius: 5px;
     }

     header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 13px 15px;
       border-bottom: 1px solid #303a33;
     }

     .identity {
       display: flex;
       gap: 10px;
       align-items: center;
     }

     .avatar {
       width: 39px;
       height: 39px;
       border-radius: 9px;
       overflow: hidden;
     }

     .avatar svg {
       width: 100%;
       height: 100%;
     }

     .logo {
       font-size: 19px;
       font-weight: 800;
       letter-spacing: -.6px;
       line-height: 1.2;
     }

     .logo span { color: #8bdc9c; }

     .subtitle {
       font-size: 11px;
       color: #8d9d91;
     }

     #close {
       border: 0;
       background: none;
       color: #a9b9ad;
       font-size: 22px;
       padding: 4px;
     }

     main { padding: 15px; }

     .label {
       font-size: 10px;
       color: #93a596;
       letter-spacing: 1px;
       font-weight: 750;
       margin-bottom: 8px;
       text-transform: uppercase;
     }

     #answer, #result {
       background: #222d26;
       border: 1px solid #394b3e;
       border-radius: 9px;
       padding: 12px;
       white-space: pre-wrap;
       overflow-wrap: anywhere;
       line-height: 1.5;
       user-select: text;
     }

     #answer { min-height: 62px; }
     #result { min-height: 42px; margin-top: 10px; }

     .muted {
       color: #9eafa2;
       font-size: 11px;
       line-height: 1.5;
       margin-top: 7px;
     }

     .actions {
       display: flex;
       flex-wrap: wrap;
       gap: 7px;
       margin-top: 12px;
     }

     .btn {
       border: 1px solid #44574a;
       border-radius: 8px;
       background: #2b382f;
       color: #eef4ee;
       padding: 9px 11px;
       font-size: 12px;
       font-weight: 650;
     }

     .primary {
       background: #86d99b;
       border-color: #86d99b;
       color: #172619;
     }

     .btn:disabled {
       opacity: .45;
       cursor: default;
     }

     details {
       border-top: 1px solid #303b33;
       margin-top: 16px;
       padding-top: 13px;
     }

     summary {
       cursor: pointer;
       user-select: none;
       font-weight: 650;
       color: #c7d5ca;
     }

     textarea {
       display: block;
       width: 100%;
       margin-top: 12px;
       padding: 10px;
       min-height: 70px;
       resize: vertical;
       border: 1px solid #45594b;
       border-radius: 8px;
       background: #202923;
       color: #f0f5f0;
       outline: none;
       user-select: text;
     }

     textarea:focus { border-color: #86d99b; }

     select {
       background: #202923;
       color: #eaf0eb;
       padding: 8px;
       border: 1px solid #45594b;
       border-radius: 8px;
       font-size: 11px;
       min-width: 0;
     }

     .copy-row {
       display: flex;
       align-items: center;
       justify-content: space-between;
       gap: 10px;
       margin-top: 15px;
       padding: 10px;
       border-radius: 9px;
       background: #212a24;
       border: 1px solid #354438;
     }

     .copy-text {
       font-size: 12px;
       font-weight: 600;
     }

     .switch {
       width: 38px;
       height: 22px;
       border: 0;
       background: #465149;
       border-radius: 20px;
       padding: 3px;
       flex-shrink: 0;
       transition: background .15s;
     }

     .switch::before {
       content: '';
       display: block;
       width: 16px;
       height: 16px;
       border-radius: 50%;
       background: white;
       transition: transform .15s;
     }

     .switch.active { background: #71c98a; }
     .switch.active::before {
       transform: translateX(16px);
     }

     footer {
       border-top: 1px solid #303b33;
       padding: 12px 15px;
       display: flex;
       justify-content: space-between;
       align-items: center;
       font-size: 11px;
       color: #85968a;
     }

     footer a {
       color: #8bdc9c;
       text-decoration: none;
     }
   </style>

   <button id="launcher" title="Abrir DuoFuck">
     ${icon}
   </button>

   <section id="panel">
     <header>
       <div class="identity">
         <div class="avatar">${icon}</div>
         <div>
           <div class="logo">Duo<span>Fuck</span></div>
           <div class="subtitle">by Wohn37 · v3.4</div>
         </div>
       </div>
       <button id="close" title="Fechar">×</button>
     </header>

     <main>
       <div class="label">Resposta sugerida</div>

       <div id="answer">
         Abra uma lição para começar.
       </div>

       <div id="state" class="muted">
         Aguardando exercício.
       </div>

       <div class="actions">
         <button id="scan" class="btn primary">
           Analisar
         </button>
         <button id="copy" class="btn" disabled>
           Copiar
         </button>
       </div>

       <details>
         <summary>Tradutor</summary>

         <textarea
           id="source"
           maxlength="450"
           placeholder="Digite uma frase..."
         ></textarea>

         <div class="actions">
           <select id="language">
             <option value="en|pt-BR">EN → PT</option>
             <option value="pt-BR|en">PT → EN</option>
           </select>

           <button id="translate" class="btn primary">
             Traduzir
           </button>

           <button id="clear" class="btn">
             Limpar
           </button>
         </div>

         <div id="result">
           A tradução aparece aqui.
         </div>

         <div class="actions">
           <button id="copyTranslation" class="btn" disabled>
             Copiar tradução
           </button>
         </div>

         <div id="translationStatus" class="muted"></div>
       </details>

       <div class="copy-row">
         <div class="copy-text">Liberar copiar e colar</div>
         <button id="copyToggle" class="switch"
           role="switch"
           aria-checked="false"
           aria-label="Liberar copiar e colar">
         </button>
       </div>

       <div id="copyStatus" class="muted"></div>
     </main>

     <footer>
       <span>FuckDuo © 2026</span>
       <a href="https://github.com/JohnIohananDev"
         target="_blank"
         rel="noopener noreferrer">GitHub</a>
     </footer>
   </section>`;

   document.documentElement.appendChild(host);

   const clean = value =>
     String(value ?? '').replace(/\s+/g, ' ').trim();

   const key = 'duofuck-copy-enabled';

   try {
     unlockCopy = localStorage.getItem(key) === 'true';
   } catch {}

   const copyStyle = document.createElement('style');
   copyStyle.textContent = `
     body, body * {
       user-select: text !important;
       -webkit-user-select: text !important;
     }
     input, textarea, [contenteditable="true"] {
       user-select: text !important;
       -webkit-user-select: text !important;
     }
   `;

   function updateCopyMode() {
     if (unlockCopy) {
       if (!copyStyle.isConnected) {
         document.head.appendChild(copyStyle);
       }
     } else {
       copyStyle.remove();
     }

     $('copyToggle').classList.toggle(
       'active', unlockCopy
     );

     $('copyToggle').setAttribute(
       'aria-checked', String(unlockCopy)
     );

     $('copyStatus').textContent = unlockCopy
       ? 'Seleção e atalhos de cópia ativados.'
       : '';
   }

   function nativeCopyHandler(event) {
     if (!unlockCopy) return;

     if (event.composedPath().includes(host)) return;

     event.stopImmediatePropagation();
   }

   function keyHandler(event) {
     if (!unlockCopy) return;

     if (!(event.ctrlKey || event.metaKey)) return;

     const key = event.key.toLowerCase();

     if (['c', 'v', 'x'].includes(key)) {
       event.stopImmediatePropagation();
     }
   }

   document.addEventListener(
     'copy', nativeCopyHandler, true
   );

   document.addEventListener(
     'paste', nativeCopyHandler, true
   );

   document.addEventListener(
     'cut', nativeCopyHandler, true
   );

   document.addEventListener(
     'keydown', keyHandler, true
   );

   $('copyToggle').onclick = () => {
     unlockCopy = !unlockCopy;

     try {
       localStorage.setItem(key, String(unlockCopy));
     } catch {}

     updateCopyMode();
   };

   updateCopyMode();

   $('launcher').onclick = () => {
     $('panel').classList.toggle('open');
   };

   $('close').onclick = () => {
     $('panel').classList.remove('open');
   };

   async function copy(text) {
     if (!text) return;

     try {
       await navigator.clipboard.writeText(text);
     } catch {
       const temp = document.createElement('textarea');
       temp.value = text;
       temp.style.position = 'fixed';
       temp.style.opacity = '0';

       root.appendChild(temp);
       temp.focus();
       temp.select();

       document.execCommand('copy');
       temp.remove();
     }
   }

   function getChallenge() {
     return document.querySelector(
       '[data-test*="challenge challenge"],' +
       '[data-test^="challenge-"]'
     );
   }

   function getSolution(element) {
     let node = element;

     for (let n = 0; node && n < 8; n++) {
       const name = Object.keys(node).find(k =>
         k.startsWith('__reactFiber$') ||
         k.startsWith('__reactInternalInstance$')
       );

       if (name) {
         let fiber = node[name];

         for (let i = 0; fiber && i < 42; i++) {
           for (const props of [
             fiber.memoizedProps,
             fiber.pendingProps
           ]) {
             const values = [
               props?.challenge,
               props?.currentChallenge,
               props?.data,
               props
             ];

             for (const data of values) {
               if (!data || typeof data !== 'object') {
                 continue;
               }

               if (
                 Array.isArray(data.correctTokens) &&
                 data.correctTokens.length
               ) {
                 const words = data.correctTokens
                   .map(item =>
                     typeof item === 'string'
                       ? item
                       : item?.text || item?.value || ''
                   )
                   .filter(Boolean);

                 if (words.length) {
                   return words.join(' ');
                 }
               }

               if (
                 Number.isInteger(data.correctIndex) &&
                 data.correctIndex >= 0
               ) {
                 const choices =
                   data.choices ||
                   data.options ||
                   data.answers;

                 const choice = Array.isArray(choices)
                   ? choices[data.correctIndex]
                   : null;

                 const value =
                   typeof choice === 'string'
                     ? choice
                     : choice?.text ||
                       choice?.value ||
                       choice?.sentence;

                 if (typeof value === 'string' && value) {
                   return value;
                 }
               }

               const value =
                 data.correctAnswer ||
                 data.correctSolution ||
                 data.correctSolutions?.[0];

               if (typeof value === 'string' && value) {
                 return value;
               }
             }
           }

           fiber = fiber.return;
         }
       }

       node = node.parentElement;
     }

     return '';
   }

   function scan() {
     const element = getChallenge();

     if (!element) {
       answer = '';
       $('answer').textContent =
         'Abra uma lição para começar.';
       $('state').textContent = 'Aguardando exercício.';
       $('copy').disabled = true;
       return;
     }

     const type = String(
       element.getAttribute('data-test') || ''
     ).toLowerCase();

     const pageText = clean(
       document.querySelector('main')?.innerText || ''
     ).slice(0, 350).toLowerCase();

     if (
       /challenge-speak|challenge-speech/.test(type) ||
       /fale esta frase|fale em voz alta|speak this sentence/
         .test(pageText)
     ) {
       answer = '';
       $('answer').textContent = 'Exercício de fala.';
       $('state').textContent =
         'Use o microfone para responder.';
     } else {
       answer = clean(getSolution(element));

       $('answer').textContent =
         answer || 'Resposta não identificada.';

       $('state').textContent = answer
         ? 'Sugestão encontrada nos dados da lição.'
         : 'Você pode usar o tradutor.';
     }

     $('copy').disabled = !answer;
   }

   $('scan').onclick = scan;
   $('copy').onclick = () => copy(answer);

   $('copyTranslation').onclick = () =>
     copy(translation);

   $('translate').onclick = () => {
     if (loading) return;

     const text = clean($('source').value).slice(0, 450);

     if (!text) {
       $('translationStatus').textContent =
         'Digite uma frase.';
       return;
     }

     loading = true;
     $('translate').disabled = true;
     $('result').textContent = 'Traduzindo...';

     const url =
       'https://api.mymemory.translated.net/get?q=' +
       encodeURIComponent(text) +
       '&langpair=' +
       encodeURIComponent($('language').value);

     const finish = () => {
       loading = false;
       $('translate').disabled = false;
     };

     GM_xmlhttpRequest({
       method: 'GET',
       url,
       timeout: 12000,

       onload: response => {
         try {
           if (response.status !== 200) {
             throw Error('HTTP ' + response.status);
           }

           const data = JSON.parse(
             response.responseText
           );

           if (Number(data.responseStatus) !== 200) {
             throw Error('Tradução indisponível');
           }

           translation = clean(
             data.responseData?.translatedText
           );

           if (!translation) {
             throw Error('Resposta vazia');
           }

           $('result').textContent = translation;
           $('copyTranslation').disabled = false;
           $('translationStatus').textContent =
             'Tradução recebida.';
         } catch (error) {
           translation = '';
           $('result').textContent =
             'Não foi possível traduzir.';
           $('copyTranslation').disabled = true;
           $('translationStatus').textContent =
             error.message;
         }

         finish();
       },

       onerror: () => {
         translation = '';
         $('result').textContent = 'Erro de conexão.';
         $('copyTranslation').disabled = true;
         finish();
       },

       ontimeout: () => {
         translation = '';
         $('result').textContent = 'Tempo esgotado.';
         $('copyTranslation').disabled = true;
         finish();
       }
     });
   };

   $('clear').onclick = () => {
     $('source').value = '';
     translation = '';
     $('result').textContent =
       'A tradução aparece aqui.';
     $('copyTranslation').disabled = true;
     $('source').focus();
   };

   let timer;

   new MutationObserver(() => {
     clearTimeout(timer);

     timer = setTimeout(() => {
       const element = getChallenge();

       const next = element
         ? clean(element.textContent).slice(0, 500)
         : '';

       if (next !== signature) {
         signature = next;
         scan();
       }
     }, 350);
   }).observe(document.body, {
     childList: true,
     subtree: true
   });

   scan();
 })();
