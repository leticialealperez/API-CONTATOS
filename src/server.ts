import express, { Request, Response } from 'express';
import 'dotenv/config';
import { Contact, ResponseAPI } from './types';
import { v4 as uuid } from 'uuid';

const app = express();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});

app.use(express.json());

const listaContatos: Contact[] = []

// id, name, phone

//   ?nome='Joao' - query params - caso de uso - filtragem de dados
//   /numeros/:identificador - params - caso de uso salvar um registro para um usuario específico

// GET - buscar - listagem - READ
app.get('/contatos', (request: Request, response: Response) => {
    
    const resposta: ResponseAPI = {
      success: true,
      message: 'Contatos buscados com sucesso',
      data: listaContatos,
    };

    return response.status(200).send(resposta);
})


// POST - criar - CREATE
app.post('/contatos', (request: Request, response: Response) => {
  const { name, phone } = request.body; // { "numero": 80 }

  if (!name || !phone) {
    // bad request - 400 - requisição inválida
    const resposta: ResponseAPI = {
        success: false,
        message: 'As propriedades "name" e "phone" são obrigatórias.',
        data: null
    }
    return response.status(400).send(resposta);
  }

    // remove caracteres especiais do telefone enviado pelo client
    const phoneParsed = phone
        .normalize('NFD')
        .replace(/([\u0300-\u036f]|[^0-9])/g, '');

    if(phoneParsed.length < 11) {
        const resposta: ResponseAPI = {
          success: false,
          message: 'O telefone é inválido. Por favor, informe o DDD e o telefone corretamente.',
          data: null,
        };
        return response.status(400).send(resposta);
    }

    const exist = listaContatos.some((contact) => contact.phone === phoneParsed);

    if(exist) {
        const resposta: ResponseAPI = {
          success: false,
          message: 'Este telefone já foi cadastrado anteriormente. Verique sua lista de contatos!',
          data: null,
        };
        return response.status(400).send(resposta);
    }

    const novoContato: Contact = {
      id: uuid(),
      name,
      phone: phoneParsed,
    };

    listaContatos.push(novoContato);

    const resposta: ResponseAPI = {
      success: true,
      message: 'Contato adicionado com sucesso!',
      data: novoContato,
    };

    // SUCCESS - CREATED - 201
    return response.status(201).send(resposta);
});


// PUT - atualizar - UPDATE
app.put('/contatos/:identificador', (request: Request, response: Response) => {
    const { identificador } = request.params;
    const { teste } = request.body;

    //...
    // verificar se existe o registro pelo id
    // se existir modificar o registro na lista e retornar o objeto atualizado
    // usuario deve poder atualizar uma ou todas as propriedades do contato

    return response.send(identificador);
});


// DELETE - deletar - DELETE
app.delete('', () => {})