import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import ListaTarefas from "./lista";

export const dynamic = "force-dynamic";

export default async function TarefasPage() {
  if (!supabaseConfigurado) redirect("/auth/login");

  const supabase = await criarClienteServidor();
  const { data: { user }, error: erroLogin } = await supabase.auth.getUser();
  if (erroLogin || !user) redirect("/auth/login");

  const { data, error } = await supabase
    .from("tarefas")
    .select("id, titulo, concluida")
    .order("criada_em", { ascending: false })
    .order("id");

  return (
    <>
      <h1>Minhas tarefas</h1>
      <p className="conta">Conta: {user.email}</p>
      <ListaTarefas tarefasIniciais={data ?? []} falhaAoCarregar={Boolean(error)} />
    </>
  );
}
