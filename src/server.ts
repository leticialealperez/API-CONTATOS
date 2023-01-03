import express, { Request, Response } from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});

const listaNumeros: number[] = []

// GET - buscar - listagem - READ
app.get('/numeros', (request: Request, response: Response) => {
    const dobro = listaNumeros.map((v) => v * 2)


    const resposta = {
      mensagem: 'Deu bom',
      numeros: dobro,
    };

    return response.status(200).send(resposta);
})


// POST - criar - CREATE
app.post('/numeros', (request: Request, response: Response) => {
    const { numero } = request.body // { numero: 80 }

    if(!numero) {
        return response.status(400).send({
          mensagem: 'Deu ruim, a propriedade número é obrigatória',
        });
    }

    listaNumeros.push(numero);

    return response.status(201).send({
        mensagem: 'Deu bom, numero adicionado com sucesso!'
    })

});


// PUT - atualizar - UPDATE


// DELETE - deletar - DELETE