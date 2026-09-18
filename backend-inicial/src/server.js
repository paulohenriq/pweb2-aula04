import express from "express";

const app = express();
const PORT = 3000;

// Middleware: interpreta o corpo (body) das requisições em JSON.
// Sem isto, req.body ficaria indefinido nos POST/PUT.
app.use(express.json());

// "Banco de dados" em memória (por enquanto, sem banco real).
// Ao reiniciar o servidor, os dados voltam ao estado inicial.
let tarefas = [
  { id: 1, titulo: "Estudar API REST", concluida: false },
];
let proximoId = 2;

// =====================================================================
// AS ROTAS DA API SERÃO CRIADAS DURANTE A AULA.
// Siga o passo a passo em ROTEIRO-AULA.md:
//
//   GET    /api/tarefas          -> listar   (query + header)
//   POST   /api/tarefas          -> criar    (body)
//   PUT    /api/tarefas/:id      -> editar   (path + body)
//   DELETE /api/tarefas/:id      -> excluir  (path)
//
// Escreva as rotas ABAIXO desta linha.
// =====================================================================


app.listen(PORT, () => {
  console.log(`API To-Do rodando em http://localhost:${PORT}`);
});
