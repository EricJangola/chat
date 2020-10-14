# Take Coolest Chat

Node version
--------
- v11.6.0


Uma aplicação simples de chat feita em NodeJs nativo, sem uso de bibliotecas externas. A solução é composta de dois projetos distintos ( aplicação cliente/servidor), desse modo é possível executar em máquinas distintas ambos, tendo conhecimento previamente do IP da aplicação servidora e a porta em que a mesma roda. Para isso foi utilizado as variáveis de ambiente da maquina ( process.env ) para reconhecer as portas, url's e demais arquivos. Tambem é possível usar a biblioteca dotenv para gerar um arquivo .env de configuração das aplicações.

- cliente: CHAT_PORT e CHAT_URL, respectivamente a porta do servidor do chat e a url do mesmo ( IP ) 
- server: process.env.CHAT_PORT, porta ao qual o servidor fica escutando as conexões socket

Lembrando que caso não sejam preenchidos, é possível rodar a aplicação na mesma máquina ( default 127.0.0.1 ).

Com o servidor online, ele fica no aguardo de novas conexões via socket em seu endereço/porta e ao receber uma conexão o mesmo responde à esse cliente esperando receber o seu nome/apelido, fazendo assim a verificação de existencia do mesmo e retornando ao cliente em caso positivo ou não.

Após a escolha de apelido válido a sua conexão é salva pelo servidor, array de sockets, onde o socket.name é o apelido escolhido e o socket.room sua sala atual sendo a sala "#general" escolhida como default. Sendo assim o cliente consegue executar as ações abaixo, que são tratadas pelo servidor:

Exemplos
--------
 
 - mensagem privada: /p nomeUsuario mensagem. Ex: /p take ola, como está?
 - sair do chat: /exit
 - criar sala: /cr nomeSala Ex: /cr troopers
 - mudar de sala: /r nomeSala Ex: /r troopers
 -ajuda: /help assim verá essa mensagem novamente
 - mensagem para todos: escrita normal sem comando

Para isso foram utilizadas as libs nativas:

- net: solução nativa de sockets
- readline: tem como função interceptar os eventos de escrita na linha de comando para envio de mensagens ( cliente )


Também foram criados testes automatizados utilizando a biblioteca mochajs:
- mochajs: https://mochajs.org/
- github: foi configurado um workflow para rodar automaticamente os testes assim que um commit/merge é feito na branch main

Features
--------

- Registro de apelidos
- Gestão de apelidos ( não podem haver repetidos )
- Conexão de multiplos clientes
- Envio de mensagem para sala
- Criação e mudança de salas
- Pedido de ajuda /help
- Mensagem privada para membros da sala
- Sair do chat


Melhorias
-------

Revisão do código do servidor e implementação de melhores tratamentos de erros e crashes. Criação e componentização do mesmo via docker, estudar e implementar uma estrategia com várias instancias que compartilham as conexões entre si, utilizando um nginx para realizar o proxy reverso.

Melhorar casos de testes, cobrindo as funcionalidades extras, adicionando edge cases e forçando "crashes" inesperados da aplicação. Criação de interface web com login e seleção de apelido. O cliente pode se tornar tão escalável quando o servidor ( mesma arquitetura ).



License
-------

    EricJS (C) 2020 

