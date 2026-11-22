import FormularioConta from "../formulario";
import { supabaseConfigurado } from "@/lib/supabase/config";

export const metadata = { title: "Entrar | Minhas tarefas" };

export default async function Login({ searchParams }: {
  searchParams: Promise<{ confirmacao?: string }>;
}) {
  const { confirmacao } = await searchParams;

  return (
    <>
      <h1>Entrar</h1>
      {confirmacao === "erro" && (
        <p role="alert">O link de confirmação está inválido ou expirou. Confira o e-mail mais recente.</p>
      )}
      <FormularioConta configurado={supabaseConfigurado} />
    </>
  );
}
