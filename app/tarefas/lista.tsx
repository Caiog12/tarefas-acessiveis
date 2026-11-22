"use client";

import { useRef, useState, type FormEvent } from "react";
import { criarClienteNavegador } from "@/lib/supabase/browser";

type Tarefa = {
  id: string;
  titulo: string;
  concluida: boolean;
};

export default function ListaTarefas({ tarefasIniciais, falhaAoCarregar }: {
  tarefasIniciais: Tarefa[];
  falhaAoCarregar: boolean;
}) {
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [titulo, setTitulo] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const campoTitulo = useRef<HTMLInputElement>(null);
  const listaIndisponivel = ocupado || falhaAoCarregar;

  async function executar(acao: () => Promise<void>, erroDaAcao: string) {
    if (ocupado) return;
    setOcupado(true);
    setErro("");
    setMensagem("");

    try {
      await acao();
    } catch {
      setErro(erroDaAcao);
    } finally {
      setOcupado(false);
    }
  }

  async function adicionar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (listaIndisponivel) return;

    const tituloLimpo = titulo.trim();
    if (!tituloLimpo || tituloLimpo.length > 200) {
      setMensagem("");
      setErro("Digite um título de 1 a 200 caracteres.");
      campoTitulo.current?.focus();
      return;
    }

    await executar(async () => {
      const supabase = criarClienteNavegador();
      // O banco preenche user_id com a identidade de quem está logado.
      const { data, error } = await supabase.from("tarefas")
        .insert({ titulo: tituloLimpo })
        .select("id, titulo, concluida")
        .single();
      if (error) throw error;

      setTarefas((lista) => [data, ...lista]);
      setTitulo("");
      setMensagem("Tarefa adicionada.");
      campoTitulo.current?.focus();
    }, "Não foi possível adicionar a tarefa. Tente novamente.");
  }

  async function mudarEstado(tarefa: Tarefa) {
    if (listaIndisponivel) return;

    await executar(async () => {
      const supabase = criarClienteNavegador();
      const { data, error } = await supabase.from("tarefas")
        .update({ concluida: !tarefa.concluida })
        .eq("id", tarefa.id)
        .select("id, titulo, concluida")
        .single();
      if (error) throw error;

      setTarefas((lista) => lista.map((item) => item.id === data.id ? data : item));
      setMensagem(data.concluida ? "Tarefa concluída." : "Tarefa marcada como pendente.");
    }, "Não foi possível alterar a tarefa. Recarregue a página e tente novamente.");
  }

  async function excluir(tarefa: Tarefa) {
    if (listaIndisponivel || !window.confirm(`Excluir a tarefa “${tarefa.titulo}”?`)) return;

    await executar(async () => {
      const supabase = criarClienteNavegador();
      const { error } = await supabase.from("tarefas")
        .delete()
        .eq("id", tarefa.id)
        .select("id")
        .single();
      if (error) throw error;

      setTarefas((lista) => lista.filter((item) => item.id !== tarefa.id));
      setMensagem("Tarefa excluída.");
      campoTitulo.current?.focus();
    }, "Não foi possível excluir a tarefa. Recarregue a página e tente novamente.");
  }

  async function sair() {
    await executar(async () => {
      const supabase = criarClienteNavegador();
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- A sessão mudou e a navegação completa limpa o cache de rotas.
      window.location.assign("/auth/login");
    }, "Não foi possível sair. Tente novamente.");
  }

  return (
    <>
      <button type="button" className="secundario" onClick={sair} aria-disabled={ocupado}>Sair</button>
      <form className="nova-tarefa" onSubmit={adicionar}>
        <label htmlFor="titulo">Nova tarefa</label>
        <input ref={campoTitulo} id="titulo" name="titulo" value={titulo}
          onChange={(evento) => setTitulo(evento.target.value)}
          maxLength={200} required readOnly={listaIndisponivel} />
        <button aria-disabled={listaIndisponivel}>Adicionar</button>
      </form>
      <p role="status">{ocupado ? "Aguarde…" : mensagem}</p>
      <p role="alert">{erro}</p>
      <h2>Lista de tarefas</h2>
      {falhaAoCarregar ? (
        <p role="alert">Não foi possível carregar as tarefas. Recarregue a página para tentar novamente.</p>
      ) : tarefas.length === 0 ? (
        <p>Você ainda não tem tarefas.</p>
      ) : (
        <ul>
          {tarefas.map((tarefa) => (
            <li key={tarefa.id}>
              <span className="titulo">{tarefa.titulo}</span>
              <span className="estado">{tarefa.concluida ? "Concluída" : "Pendente"}</span>
              <div className="acoes">
                <button type="button" className="secundario" aria-disabled={ocupado}
                  aria-label={`${tarefa.concluida ? "Desmarcar" : "Concluir"}: ${tarefa.titulo}`}
                  onClick={() => mudarEstado(tarefa)}>
                  {tarefa.concluida ? "Desmarcar" : "Concluir"}
                </button>
                <button type="button" className="secundario excluir" aria-disabled={ocupado}
                  aria-label={`Excluir: ${tarefa.titulo}`} onClick={() => excluir(tarefa)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
