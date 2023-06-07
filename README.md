# Arquitetura de Microsserviços e Event Driven Architecture

Este repositório contém o material desenvolvido nos cursos Arquitetura de Microsserviços e Event Driven Architecture do curso Full Cycle 3.0

Aqui estão os seguintes projetos

- Diagramas de Contexto e Containers do modelo C4 do Walletcore
- Projeto walletcore
- Projeto balance-ms (solução do desafio do módulo de EDA - Event Driven Architecture)

## Walletcore

O Walletcore é um microsserviço desenvolvido em **golang** e é responsável pelo cadastro de clientes, contas e transações. Esses dados são persistidos em um banco de dados relacional MySQL.

Sempre que uma transação é criada, é disparado um evento `TransactionCreated`. Na transação, também ocorre a atualização do saldo das contas do cliente que realiza a transação para o cliente que recebe o valor. Ao realizar a atualização do saldo, é disparado um evento `BalanceUpdated`. Esses eventos são enviados para o **Kafka** e são armazenados nos topicos `transactions` e `balances`.

A criação de clientes, contas e transações é feita através de endpoints REST.

## Balance-ms

O Balance-ms é um microsserviço desenvolvido em **NodeJS** utilizando o **Typescript** como linguagem. Esse sistema é responsável por recuperar os eventos publicados no topico `balances` do **Kafka** e disponibilizar através de um endpoint REST a consulta do saldo para cada conta. Os dados do saldo atualizados são persistidos em um banco de dados MySQL.

## Executando a aplicação

Os microsserviços walletcore e balance-ms, banco de dados MySQL e Kafka estão disponiveis em containers. Para executar as aplicações, execute o seguinte comando no seu terminal na raiz do projeto:

```shell
docker-compose up
```

Na pasta `.docker/mysql` o script `initdb.sql` cria os bancos de dados, as tabelas e popula as tabelas com dados iniciais.

O service `init-kafka` é responsável por criar os tópicos `transactions` e `balances` no **Kafka**

### Criando um novo cliente no Walletcore

Para criar um novo cliente, acesse o arquivo `walletcore/api/client.http` e realize a requisição **POST http://localhost:8080/clients** incuindo o nome e email do cliente no corpo da requisição.

### Criar uma nova conta no Walletcore

Para criar uma nova conta, acesse o arquivo `walletcore/api/client.http` e realize a requisição **POST http://localhost:8080/accounts** incluindo no corpo da requisição o id do cliente. O id do cliente é retornado no corpo da requisição de cadastro de cliente.

### Realizando uma transação entre duas contas no Walletcore

Para criar uma nova conta, acesse o arquivo `walletcore/api/client.http` e realize a requisição **POST http://localhost:8080/transactions** incluindo no corpo da requisição o id da conta e valor da conta da retirada e o id da conta que irá receber o valor. O valor do id da conta é recuperado no corpo da requisição de criação de conta.

### Consultando o saldo de uma determinada conta no Balance-ms

Para realizar a consulta do saldo para uma determinada conta, acesse o arquivo `balance-ms/api/client.http` e realize a requisição **GET http://localhost:3003/balances/{{account-id}}**, informando no path param `{{account-id}}` o id da conta cadastrada no Walletcore



