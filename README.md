🎙️ Projeto LIBRAS BETWEEN LENS : TRADUTOR DE LIBRAS EM TEMPO REAL

🌟 UMA PONTE PARA A COMUNICAÇÃO INCLUSIVA

Este projeto representa mais do que um exercício de programação; é uma iniciativa de responsabilidade social e tecnológica. O repositório abriga o código-fonte de uma aplicação web dedicada a quebrar barreiras comunicacionais, utilizando a câmera do dispositivo para interpretar a Língua Brasileira de Sinais (Libras) em tempo real. Nossa missão é transformar a tecnologia em uma ferramenta ativa de inclusão.

🎓 Contexto Acadêmico e Visão Comunitária

Este trabalho é a culminância dos conhecimentos adquiridos no 4º semestre do curso de Engenharia da Computação do Centro Universitario Meta.

Propósito Social e Impacto:

Reconhecemos que a comunicação é o alicerce da dignidade humana. Por isso, nosso propósito fundamental é desenvolver uma solução acessível e funcional que beneficie diretamente a comunidade surda e ouvintes, facilitando a interação e o entendimento mútuo em ambientes digitais e cotidianos. Buscamos dar um passo significativo na redução da exclusão social por meio da tecnologia.

✨ Arquitetura e Objetivo Central

A aplicação atua como um intérprete visual, orquestrando hardware e software para reconhecimento preciso de gestos.

Captura de Vídeo e Input: Utilização eficiente da webcam ou câmera móvel para captação da linguagem gestual.

Processamento e Rastreamento: Aplicação de bibliotecas robustas de visão computacional (como MediaPipe) para o rastreamento dinâmico e preciso das articulações das mãos.

Mapeamento e Tradução: Desenvolvimento de um sistema lógico para mapear os padrões gestuais detectados a um vocabulário correspondente em Libras, exibindo a tradução textual instantaneamente.

🛠️ Stack Tecnológico

A escolha das tecnologias foi estratégica, visando leveza, escalabilidade e performance no processamento em tempo real.

Backend Core: O micro-framework Python Flask serve como espinha dorsal da aplicação, garantindo uma estrutura ágil e de baixo overhead.

Interface Dinâmica: O Frontend é construído em HTML5, CSS e JavaScript, proporcionando uma experiência de usuário fluida e responsiva.

Inteligência Visual: A detecção de mãos é potencializada pela MediaPipe Hands (via CDN), uma tecnologia de ponta para análise de esqueleto de mão.

🚀 Guia de Implantação Rápida

Para testar a capacidade de inclusão do projeto localmente, siga este guia:

Pré-requisitos Essenciais

Python 3.x

A biblioteca Flask (pip install flask)

Passos para Configuração

Clonagem e Preparação:

git clone [https://www.youtube.com/watch?v=RqfwLeY952s](https://www.youtube.com/watch?v=RqfwLeY952s)
cd [Nome da Pasta do Projeto]


Instalação de Dependências:

pip install -r requirements.txt 
(Ou apenas 'pip install flask' se não houver requirements.txt)


Inicialização do Servidor (Ponto de Entrada: main.py):
O ambiente será iniciado em modo de debug para fácil desenvolvimento.

python main.py

Acesso à Aplicação:
Abra o seu navegador e navegue para o endereço local:

[http://127.0.0.1:5000/](http://127.0.0.1:5000/)

Atenção: Certifique-se de que sua câmera está acessível e desbloqueada para o navegador.

Desenvolvedor(a) Líder: Grupo Fellas
A tecnologia deve servir à humanidade, e este projeto é o nosso compromisso com essa visão.
