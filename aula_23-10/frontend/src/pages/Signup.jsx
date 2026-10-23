import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrar, entrar, ErroDeValidacao } from "../api.js";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState([]);
  const navigate = useNavigate();

  async function submeter(e) {
    e.preventDefault();
    setErros([]);
    try {
      await registrar(email, senha); // cria a conta (POST /api/auth/register)
      await entrar(email, senha); // já faz login (seta o cookie)
      navigate("/");
    } catch (err) {
      setErros(err instanceof ErroDeValidacao ? err.mensagens : ["Erro ao cadastrar."]);
    }
  }

  return (
    <main className="card auth">
      <h1>Criar conta</h1>
      <p className="sub">Cadastre-se para começar a usar o To-Do.</p>

      <form onSubmit={submeter}>
        <label>E-mail</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" />

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="mínimo 6 caracteres" />

        <button type="submit">Cadastrar</button>

        {erros.length > 0 && (
          <ul className="erros">
            {erros.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </form>

      <p className="troca">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  );
}
