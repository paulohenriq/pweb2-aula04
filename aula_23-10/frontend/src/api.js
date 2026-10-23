// Funções que falam com a API. Usamos credentials:'include' para que o
// navegador ENVIE e RECEBA o cookie httpOnly do login em todas as requisições.
const API = "/api";

export class ErroDeValidacao extends Error {
  constructor(mensagens) {
    super("Erro de validação");
    this.mensagens = mensagens;
  }
}

async function tratar(resposta) {
  if (resposta.status === 204) return null;
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const msgs = Array.isArray(corpo.message)
      ? corpo.message
      : [corpo.message || "Ocorreu um erro."];
    throw new ErroDeValidacao(msgs);
  }
  return corpo;
}

function pedir(caminho, opcoes = {}) {
  return fetch(`${API}${caminho}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
}

// ---- Autenticação ----
export async function registrar(email, senha) {
  return tratar(await pedir("/auth/register", { method: "POST", body: JSON.stringify({ email, senha }) }));
}

export async function entrar(email, senha) {
  return tratar(await pedir("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) }));
}

export async function sair() {
  await pedir("/auth/logout", { method: "POST" });
}

// Retorna { userId, email } se autenticado; lança erro se não estiver.
export async function eu() {
  const resposta = await pedir("/auth/me");
  if (!resposta.ok) throw new Error("não autenticado");
  return resposta.json();
}

// ---- Tarefas (rotas protegidas) ----
export async function listarTarefas() {
  const resposta = await pedir("/tarefas");
  if (!resposta.ok) throw new Error("falha ao listar");
  return resposta.json();
}

export async function criarTarefa(dados) {
  return tratar(await pedir("/tarefas", { method: "POST", body: JSON.stringify(dados) }));
}

export async function atualizarTarefa(id, campos) {
  return tratar(await pedir(`/tarefas/${id}`, { method: "PUT", body: JSON.stringify(campos) }));
}

export async function removerTarefa(id) {
  const resposta = await pedir(`/tarefas/${id}`, { method: "DELETE" });
  if (!resposta.ok) throw new Error("falha ao remover");
}
