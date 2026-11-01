# DuoFuck - Assistant & Translation

DuoFuck é um script (UserScript) de interface flutuante projetado para auxiliar na resolução de lições e tradução de textos, criado estritamente para fins de análise e educação sobre exposição de dados em arquiteturas web.

DuoFuck is a floating interface UserScript designed to assist with lessons and text translation, created strictly for educational and data exposure analysis purposes in web architectures.

---

## ⚠️ Avisos Importantes | Important Disclaimers

**Educacional:** Este script foi desenvolvido como uma Prova de Conceito (Proof of Concept - PoC) para demonstrar como frameworks de interface modernos (como o React Fiber) podem acabar expondo estados internos e respostas corretas no lado do cliente (navegador).
**Educational:** This script was developed as a Proof of Concept (PoC) to demonstrate how modern UI frameworks (like React Fiber) can end up exposing internal states and correct answers on the client side (browser).

**Risco de Banimento | Ban Risk:** O uso de scripts de terceiros ou ferramentas que facilitam lições viola diretamente os Termos de Serviço da plataforma. **O seu uso pode (e provavelmente vai) resultar em banimento da conta.** O uso é inteiramente por sua conta e risco.
The use of third-party scripts or tools that ease lessons directly violates the platform's Terms of Service. **Its use can (and probably will) result in an account ban.** Use entirely at your own risk.

**Sem Servidores Ocultos | No Hidden Servers:** Este script roda 100% localmente no seu navegador. Nós não puxamos dados ocultos e não existe nenhum servidor nosso rodando por trás. (A única conexão externa é feita diretamente para a API pública de tradução MyMemory).
This script runs 100% locally in your browser. We do not pull hidden data and there is no server of ours running behind it.

---

## 🎯 Funcionalidades | Features

- **Análise de Componentes / Component Analysis:**
    Lê os nós ocultos do React Fiber da página para localizar a string com a resposta sugerida da lição atual.
    Reads the hidden React Fiber nodes of the page to locate the suggested answer for the current lesson.
- **Liberação de Copiar/Colar / Copy-Paste Unlocker:**
    Desativa bloqueios de eventos do DOM, permitindo que o usuário selecione e cole textos através de atalhos de teclado (Ctrl+C / Ctrl+V).
    Disables DOM event blockers, allowing the user to select and paste text using keyboard shortcuts.
- **Tradutor Free Integrado / Free Built-in Translator:**
    Possui um tradutor totalmente gratuito embutido na interface (via MyMemory API), permitindo traduções rápidas sem precisar trocar de aba.
    Has a completely free built-in translator in the UI (via MyMemory API), allowing quick translations without switching tabs.

---

## 🛑 Limitações e Bugs Conhecidos | Limitations & Known Bugs

**Histórico de Versões:** O núcleo deste script foi construído no final de 2024. Diversos erros estruturais foram corrigidos em uma atualização no dia **22/10/2026**, no entanto, algumas instabilidades ainda estão presentes.
**Version History:** The core of this script was built in late 2024. Several structural errors were fixed in an update on **Oct 22, 2026**, however, some instabilities are still present.

*   ❌ **Exercícios de Fala (Microfone):** O script não funciona em missões onde você precisa falar a frase no microfone.
*   ❌ **Múltipla Escolha Complexa:** O script pode falhar ou não exibir a resposta correta em exercícios que exigem marcar *mais de uma* opção correta simultaneamente.
*   *English:* Does not work on speaking exercises and may fail on multiple-choice questions that require selecting more than one correct answer.

---

## ⚙️ Como Instalar | How to Install

Para rodar este código no seu navegador, você precisa de um "Gerenciador de Scripts" (UserScript Manager).
To run this code in your browser, you need a UserScript Manager.

1. **Instale a Extensão / Install the Extension**
    Instale a extensão **[Tampermonkey](https://www.tampermonkey.net/)** no seu navegador (disponível para Chrome, Edge, Firefox, etc.).
    Install the **Tampermonkey** extension in your browser.

2. **Adicione o Script / Add the Script**
    * Abra o painel do Tampermonkey e clique em **"Criar novo script"** (Create a new script).
    * Apague todo o conteúdo que vier escrito lá dentro.
    * Acesse o arquivo com o script clicando aqui: **[DuoFuck.user.js](https://github.com/JohnIohananDev/duofuck/blob/main/DuoFuck.user.js)**
    * Copie todo o código, cole no Tampermonkey e vá em **Arquivo > Salvar** (File > Save) ou aperte `Ctrl + S`.

3. **Pronto! / Done!**
    O botão flutuante verde aparecerá no canto inferior direito sempre que você entrar na plataforma alvo.
    The floating green button will appear in the bottom right corner whenever you enter the target platform.
