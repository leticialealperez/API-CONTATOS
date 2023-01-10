import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import { Contact, ResponseAPI, User } from './types';
import { v4 as uuid } from 'uuid';
import cors from 'cors';


const app = express();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});

app.use(express.json());
app.use(cors());

const listUsers: User[] = []

// ------ USUARIOS -----------
app.get('/users', (request: Request, response: Response) => {
  
  const resposta: ResponseAPI = {
    success: true,
    message: 'Usuários buscados com sucesso.',
    data: listUsers,
  };

  return response.status(200).send(resposta);
});


app.post('/users', (request: Request, response: Response) => {
  const { name, email, password } = request.body;

  /*
  {
    name: '',
    email: '',
    password: '',
  }
  */

  if(!name || !email || !password ) {
    const resposta: ResponseAPI = {
      success: false,
      message: 'As propriedades "name", "email" e "password" são obrigatórias',
      data: null,
    };

    return response.status(400).send(resposta);
  }


  if(listUsers.some((user) => user.email === email)) {
     const resposta: ResponseAPI = {
       success: false,
       message: 'Este e-mail já foi cadastrado.',
       data: null,
     };

     return response.status(400).send(resposta);
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    password,
    contacts: [],
  };

  listUsers.push(newUser);


  const resposta: ResponseAPI = {
    success: true,
    message: 'Usuário criado com sucesso',
    data: newUser,
  };

  return response.status(201).send(resposta);
  
});



// -------   CONTATOS -------
// id, name, phone

//   ?nome='Joao' - query params - caso de uso - filtragem de dados
//   /numeros/:identificador - params - caso de uso salvar um registro para um usuario específico

// GET - buscar - listagem - READ
app.get('/users/:id/contacts', (request: Request, response: Response) => {
    const { id } = request.params

    const user = listUsers.find((user) => user.id === id);

    if(!user) {
      const resposta: ResponseAPI = {
        success: true,
        message: 'Usuário não encontrado',
        data: null,
      };

      return response.status(400).send(resposta);
    }


    const resposta: ResponseAPI = {
      success: true,
      message: 'Contatos buscados com sucesso',
      data: user.contacts,
    };

    return response.status(200).send(resposta);
})


// POST - criar - CREATE
app.post('/users/:id/contacts', (request: Request, response: Response) => {
  const { id } = request.params;
  const { name, phone } = request.body;

  if(!name || !phone) {
    const resposta: ResponseAPI = {
      success: false,
      message: 'As propriedades "name" e "phone" são obrigatórias',
      data: null,
    };

    return response.status(400).send(resposta);
  }

  // remove caracteres especiais do telefone enviado pelo client
  const phoneParsed = phone
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9])/g, '');

  if(phoneParsed.length !== 11 ) {
      const resposta: ResponseAPI = {
        success: false,
        message: 'O telefone é inválido. Por favor, informe o DDD e o telefone corretamente.',
        data: null,
      };
      
      return response.status(400).send(resposta);
  }

  const indice = listUsers.findIndex((user) => user.id === id);

  if (indice === -1) {
    const resposta: ResponseAPI = {
      success: false,
      message: 'Usuário não encontrado',
      data: null,
    };

    return response.status(400).send(resposta);
  }

  // verificar se o contato já foi cadastrado anteriormente para este usuário
  if(listUsers[indice].contacts.some((contact) => contact.phone === phoneParsed)) {
    const resposta: ResponseAPI = {
      success: false,
      message: 'Telefone já cadastrado para sua lista de contatos. Verifique!',
      data: null,
    };

    return response.status(400).send(resposta);
  }

  const newContact: Contact = {
    id: uuid(),
    name,
    phone: phoneParsed,
  };

  listUsers[indice].contacts.push(newContact);

  
  const resposta: ResponseAPI = {
    success: true,
    message: 'Contato cadastrado com sucesso!',
    data: newContact,
  };

  return response.status(201).send(resposta);
});


// PUT - atualização - UPDATED
app.put('/users/:idUser/contacts/:idContact', (request: Request, response: Response) => {
  const { idUser, idContact } = request.params;
  const { name, phone } = request.body;

  const indice = listUsers.findIndex((user) => user.id === idUser);

  if(indice === -1) {
    const resposta: ResponseAPI = {
      success: false,
      message: 'Usuário não encontrado',
      data: null,
    };

    return response.status(400).send(resposta);
  }

  const indiceContato = listUsers[indice].contacts.findIndex((contact) => contact.id === idContact);

  if(indiceContato === -1) {
    const resposta: ResponseAPI = {
      success: false,
      message: 'Contato não encontrado',
      data: null,
    };

    return response.status(400).send(resposta);
  }

  if(name) {
    listUsers[indice].contacts[indiceContato].name = name
  }

  if(phone) {
    const phoneParsed = phone
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9])/g, '');

    if (phoneParsed.length !== 11) {
      const resposta: ResponseAPI = {
        success: false,
        message:
          'O telefone é inválido. Por favor, informe o DDD e o telefone corretamente.',
        data: null,
      };

      return response.status(400).send(resposta);
    }

    listUsers[indice].contacts[indiceContato].phone = phoneParsed; 
  }
  
  const resposta: ResponseAPI = {
    success: true,
    message: 'Contato atualizado com sucesso.',
    data: listUsers[indice].contacts[indiceContato],
  };

  return response.status(200).send(resposta);

});


// DELETE - deletar - DELETE
app.delete('/users/:idUser/contacts/:idContact', (request: Request, response: Response) => {
  const { idUser, idContact } = request.params;

   const indice = listUsers.findIndex((user) => user.id === idUser);

   if (indice === -1) {
     const resposta: ResponseAPI = {
       success: false,
       message: 'Usuário não encontrado',
       data: null,
     };

     return response.status(400).send(resposta);
   }

   const newListContact = listUsers[indice].contacts.filter((contact) => contact.id !== idContact);

   listUsers[indice].contacts = newListContact;

   const resposta: ResponseAPI = {
     success: true,
     message: 'Contato excluído da lista com sucesso',
     data: null,
   };

   return response.status(200).send(resposta);

})