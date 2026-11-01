# Como o DuoFuck Funciona por Baixo dos Panos

O DuoFuck é um UserScript construído em Vanilla JavaScript que injeta uma interface de usuário isolada na página (usando o `Shadow DOM` para evitar que a própria plataforma de destino quebre o CSS dele) e utiliza técnicas de travessia do DOM (DOM Traversal) para recuperar dados.

## 1. Captura de Dados (O Segredo do React Fiber)
A plataforma-alvo utiliza a biblioteca **React.js**. O React gerencia o estado da aplicação através de uma árvore invisível chamada de *React Fiber*. Muitas vezes, a resposta correta de um exercício já está carregada na memória do seu navegador antes mesmo de você responder, oculta dentro das propriedades desses componentes.

O script executa a função `getSolution()` que varre os elementos HTML buscando as chaves internas do React. Veja como a lógica principal funciona:

```javascript
function getSolution(element) {
  let node = element;
  
  for (let n = 0; node && n < 8; n++) {
    const name = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    
    if (name) {
      let fiber = node[name];
      for (let i = 0; fiber && i < 42; i++) {
        for (const props of [fiber.memoizedProps, fiber.pendingProps]) {
          const values = [props?.challenge, props?.currentChallenge, props?.data, props];
          
          for (const data of values) {
            if (!data || typeof data !== 'object') continue;
            
            if (Array.isArray(data.correctTokens) && data.correctTokens.length) {
              const words = data.correctTokens.map(item => typeof item === 'string' ? item : item?.text || item?.value || '').filter(Boolean);
              if (words.length) return words.join(' ');
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
```

O código acima pega o elemento da página, encontra a chave secreta `__reactFiber$`, entra nela e começa a subir nível por nível (`fiber.return`) olhando dentro de `memoizedProps`. Quando ele acha um array chamado `correctTokens`, ele extrai o texto e retorna a resposta.

## 2. Quebra do Bloqueio de Copiar/Colar
Algumas plataformas bloqueiam a seleção de texto e os atalhos de teclado (Ctrl+C, Ctrl+V). O DuoFuck resolve isso em duas frentes:
* **CSS Injetado:** Força a propriedade `user-select: text !important;` em todos os elementos da página.
* **Event Interception (Intercepção de Eventos):** Usa a fase de captura do Javascript (`useCapture: true`) para interceptar os eventos de cópia (`copy`, `paste`, `cut`, `keydown`) antes que a plataforma principal consiga bloqueá-los, executando a função `event.stopImmediatePropagation()`.

## 3. Tradução via Bypass de CORS
Geralmente, fazer um `fetch()` para uma API de tradução a partir da página da plataforma seria bloqueado pela política de segurança do navegador (CORS). No entanto, o DuoFuck utiliza a função especial `@grant GM_xmlhttpRequest` do Tampermonkey, que roda com privilégios de extensão e pode fazer requisições para servidores externos (`api.mymemory.translated.net`) sem ser bloqueado pela aba.
