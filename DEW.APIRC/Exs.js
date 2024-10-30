//QUESTÃO 1
//O trecho de código abaixo mostra uma rota para criar e listar usuários. No entanto, ele está no Nível 1 do modelo de maturidade e precisa ser ajustado para o Nível 2.
  app.post('/users/create', (req, res) => {
      const newUser = { id: users.length + 1, ...req.body };
      users.push(newUser);
      res.status(201).json(newUser);
  });
   
  app.get('/users/getAll', (req, res) => {
      res.status(200).json(users);
  });
  

//Pergunta:

//a) Qual é o problema com o uso das rotas acima?
//R:A.1)O problema com o uso das rotas acima é que elas não seguem as boas práticas de 
//design de API  como a separação das operações de criação e 
//listagem em rotas mais intuitivas e restful. 

//b) Explique como o código pode ser ajustado para se adequar ao Nível 2.
//R:B.1)Para chegar ao Nível 2, as rotas devem ser mais representativas 
//dos recursos e operações disponíveis. O método de criação de 
//usuários deve estar no endpoint /users, e a listagem pode ser 
//feita através do mesmo endpoint

//c) Corrija o código.
/*R:C.1)*/app.post('/users', (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
    res.status(200).json(users);
});

//QUESTÃO 2
//O código abaixo tenta implementar a exclusão de um usuário específico, mas não atende aos requisitos de uso correto de códigos de status HTTP.
  app.delete('/users/:id', (req, res) => {
      const id = parseInt(req.params.id);
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex !== -1) {
          users.splice(userIndex, 1);
          res.json({ message: 'Usuário excluído' });
      } else {
          res.json({ message: 'Usuário não encontrado' });
      }
 });
  

//Pergunta:
//a) Identifique o problema com os códigos de status HTTP usados no código.
//R:A.2) O problema com os códigos de status HTTP é que o código de resposta em caso de 
//sucesso (200) deve ser 204 (No Content) para exclusões e 404 (Not Found) deve ser usado 
//quando o usuário não é encontrado.

//b) Corrija o código, adicionando os status HTTP adequados para uma resposta RESTful.
/*R:B.2*/app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(204).send(); 
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});



//QUESTÃO 3
//Abaixo, há uma rota para atualizar um usuário existente. Porém, o código não diferencia uma atualização parcial de uma atualização completa.
 app.put('/users/:id', (req, res) => {
     const id = parseInt(req.params.id);
     const user = users.find(user => user.id === id);
     if (user) {
          user.name = req.body.name;
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: 'Usuário não encontrado' });
      }
 });
  

//Pergunta:
//a) Explique a diferença entre os métodos PUT e PATCH em uma API REST.
//R:A.3) A diferença entre PUT e PATCH é que o PUT é utilizado para atualizar um 
//recurso completamente, enquanto o PATCH é utilizado para atualizar apenas partes de um 
//recurso.

//b) Corrija o código acima, implementando uma rota PATCH para permitir atualizações parciais.
/*R:B.3)*/
app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        Object.assign(user, req.body); 
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});


//QUESTÃO 4
//A resposta da API no trecho abaixo não inclui hipermídia (HATEOAS), necessária para atingir o Nível 3 do modelo de maturidade de Richardson.
  app.get('/users/:id', (req, res) => {
      const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: 'Usuário não encontrado' });
      }
  });
  

//Pergunta:
//a) Explique o que é HATEOAS e por que ele é importante no modelo REST.
//R:A.4)HATEOAS é um princípio do REST que permite que os clientes interajam com uma 
//aplicação de maneira dinâmica, utilizando links 
//que descrevem as ações disponíveis. É importante porque promove uma interface 
//auto-descritiva,permitindo que o cliente descubra como interagir com a API sem precisar de documentação externa.

//b) Altere o código para incluir links HATEOAS na resposta da API.
/*R:B.4)*/
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        res.status(200).json({
            user,
            links: {
                self: `/users/${id}`,
                update: `/users/${id}`,
                delete: `/users/${id}`
            }
        });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});


//QUESTÃO 5
//Observe o código abaixo, que faz uma busca por um usuário específico. Identifique o problema relacionado à validação e segurança.
  app.get('/users/:id', (req, res) => {
      const id = req.params.id;
      const user = users.find(user => user.id === id);
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: 'Usuário não encontrado' });
      }
  });
  

//Pergunta:
//a) Qual é o problema relacionado à validação nesse código?
//R:A.5)O problema relacionado à validação é que não há verificação do tipo do id, 
//o que pode causar erros caso o id não seja um número válido.

//b) Corrija o código para incluir a validação adequada.
/*R:B.5)*/
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }
    const user = users.find(user => user.id === id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});


//QUESTÃO 6
//Abaixo temos uma rota que adiciona um novo usuário, mas não faz validação do corpo da requisição.
 app.post('/users', (req, res) => {
     const newUser = { id: users.length + 1, ...req.body };
     users.push(newUser);
     res.status(201).json(newUser);
 });
  

//Pergunta:
//a) Qual é o problema de segurança com a falta de validação no corpo da requisição?
//R:A.6)A falta de validação no corpo da requisição pode permitir a inserção de dados 
//inválidos ou malformados, comprometendo a integridade dos dados e a segurança da aplicação.

//b) Corrija o código para validar se o campo name está presente e atende a requisitos básicos, como ser uma string com pelo menos 3 caracteres.
/*R:B.6)*/
app.post('/users', (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ message: 'Nome é obrigatório e deve ter pelo menos 3 caracteres.' });
    }
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});
