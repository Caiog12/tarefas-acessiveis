"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { criarClienteNavegador } from "@/lib/supabase/browser";

export default function FormularioConta({ cadastro = false, configurado }: {
  cadastro?: boolean;
  configurado: boolean;
}) {
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (ocupado || !configurado) return;
    const formulario = new FormData(evento.currentTarget);
    const email = String(formulario.get("email")).trim();
    const password = String(formulario.get("senha"));
    setOcupado(true);
    setErro("");
    setMensagem("");

    try {
      const supabase = criarClienteNavegador();
      if (cadastro) {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: new URL("/auth/confirm", window.location.origin).href },
        });
        if (error) {
          setErro("Não foi possível criar a conta. Confira o e-mail e use uma senha com pelo menos 8 caracteres.");
        } else if (data.session) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- A sessão mudou e a navegação completa limpa o cache de rotas.
          window.location.assign("/tarefas");
        } else {
          setMensagem("Confira sua caixa de entrada e abra o link para confirmar o cadastro.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErro("Não foi possível entrar. Confira o e-mail, a senha e a confirmação do cadastro.");
        } else {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- A sessão mudou e a navegação completa limpa o cache de rotas.
          window.location.assign("/tarefas");
        }
      }
    } catch {
      setErro("Não foi possível conectar. Tente novamente.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      {!configurado && <p role="alert">Configure o Supabase no arquivo .env.local seguindo o README.</p>}
      <form onSubmit={enviar}>
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" required
          autoComplete={cadastro ? "new-password" : "current-password"}
          minLength={cadastro ? 8 : undefined} />
        {cadastro && <p>Use pelo menos 8 caracteres.</p>}
        <button aria-disabled={ocupado || !configurado}>
          {ocupado ? "Aguarde…" : cadastro ? "Criar conta" : "Entrar"}
        </button>
      </form>
      <p role="alert">{erro}</p>
      <p role="status">{mensagem}</p>
      <Link href={cadastro ? "/auth/login" : "/auth/cadastro"}>
        {cadastro ? "Já tenho conta" : "Criar uma conta"}
      </Link>
    </>
  );
}
