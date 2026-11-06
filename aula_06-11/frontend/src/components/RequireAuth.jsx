import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { eu } from "../api.js";

// Protege uma rota: pergunta ao backend (GET /api/auth/me) se há sessão válida.
// - enquanto verifica: mostra "Carregando"
// - sem sessão (401): redireciona para /login
// - com sessão: renderiza a tela protegida
export default function RequireAuth({ children }) {
  const [estado, setEstado] = useState("checando");

  useEffect(() => {
    eu()
      .then(() => setEstado("ok"))
      .catch(() => setEstado("negado"));
  }, []);

  if (estado === "checando") {
    return (
      <main className="card">
        <p>Carregando...</p>
      </main>
    );
  }

  if (estado === "negado") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
