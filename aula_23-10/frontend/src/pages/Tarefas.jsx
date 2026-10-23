import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  eu,
  sair,
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  removerTarefa,
  ErroDeValidacao,
} from "../api.js";

export default function Tarefas() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [tarefas, setTarefas] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erros, setErros] = useState([]);

  const [editandoId, setEditandoId] = useState(null);
  const [textoEdicao, setTextoEdicao] = useState("");

  async function carregar() {
    setTarefas(await listarTarefas());
  }

  useEffect(() => {
    eu().then(setUsuario).catch(() => {});
    carregar().catch(() => {});
  }, []);

  async function sairDaConta() {
    await sair();
    navigate("/login");
  }

  async function adicionar(e) {
    e.preventDefault();
    setErros([]);
    try {
      await criarTarefa({ titulo, descricao: descricao || undefined });
      setTitulo("");
      setDescricao("");
      carregar();
    } catch (err) {
      setErros(err instanceof ErroDeValidacao ? err.mensagens : ["Não foi possível criar a tarefa."]);
    }
  }

  async function alternarConcluida(t) {
    try {
      await atualizarTarefa(t.id, { concluida: !t.concluida });
      carregar();
    } catch {
      /* ignorado */
    }
  }

  function iniciarEdicao(t) {
    setEditandoId(t.id);
    setTextoEdicao(t.titulo);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTextoEdicao("");
  }

  async function salvarEdicao(id) {
    try {
      await atualizarTarefa(id, { titulo: textoEdicao });
      cancelarEdicao();
      carregar();
    } catch (err) {
      alert(err instanceof ErroDeValidacao ? err.mensagens.join(" ") : "Erro ao salvar.");
    }
  }

  async function excluir(id) {
    try {
      await removerTarefa(id);
      carregar();
    } catch {
      /* ignorado */
    }
  }

  return (
    <main className="card">
      <header className="topo">
        <div>
          <h1>✅ Minhas Tarefas</h1>
          {usuario && <p className="sub">Logado como {usuario.email}</p>}
        </div>
        <button className="btn-sair" onClick={sairDaConta}>
          Sair
        </button>
      </header>

      <form className="form-nova" onSubmit={adicionar}>
        <input type="text" placeholder="Título da tarefa" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <textarea placeholder="Descrição (opcional)" rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <button type="submit">Adicionar</button>

        {erros.length > 0 && (
          <ul className="erros">
            {erros.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </form>

      {tarefas.length === 0 && <div className="aviso">Nenhuma tarefa ainda. Adicione a primeira!</div>}

      <ul className="lista">
        {tarefas.map((t) =>
          editandoId === t.id ? (
            <li key={t.id} className="item editando">
              <input
                className="edit-input"
                type="text"
                autoFocus
                value={textoEdicao}
                onChange={(e) => setTextoEdicao(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") salvarEdicao(t.id);
                  if (e.key === "Escape") cancelarEdicao();
                }}
              />
              <button className="btn-ok" title="Salvar" onClick={() => salvarEdicao(t.id)}>✓</button>
              <button className="btn-cancel" title="Cancelar" onClick={cancelarEdicao}>✗</button>
            </li>
          ) : (
            <li key={t.id} className={"item" + (t.concluida ? " concluida" : "")}>
              <input type="checkbox" checked={t.concluida} title="Marcar como concluída" onChange={() => alternarConcluida(t)} />
              <div className="conteudo">
                <span className="titulo" title="Clique para editar" onClick={() => iniciarEdicao(t)}>
                  {t.titulo}
                </span>
                {t.descricao && <span className="descricao">{t.descricao}</span>}
              </div>
              <button className="btn-del" title="Excluir" onClick={() => excluir(t.id)}>🗑</button>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
