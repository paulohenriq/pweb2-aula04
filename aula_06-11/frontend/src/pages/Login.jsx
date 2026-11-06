import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { entrar, ErroDeValidacao } from "../api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState([]);
  const navigate = useNavigate();

  async function submeter(e) {
    e.preventDefault();
    setErros([]);
    try {
      await entrar(email, senha); // seta o cookie httpOnly no servidor
      navigate("/"); // vai para as tarefas (rota protegida)
    } catch (err) {
      setErros(err instanceof ErroDeValidacao ? err.mensagens : ["Erro ao entrar."]);
    }
  }

  return (
    <main className="card auth">
      <h1>Entrar</h1>
      <p className="sub">Acesse sua conta para ver suas tarefas.</p>

      <form onSubmit={submeter}>
        <label>E-mail</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" />

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••" />

        <button type="submit">Entrar</button>

        {erros.length > 0 && (
          <ul className="erros">
            {erros.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </form>

      <p className="troca">
        Não tem conta? <Link to="/signup">Cadastre-se</Link>
      </p>
    </main>
  );
}
