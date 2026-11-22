import FormularioConta from "../formulario";
import { supabaseConfigurado } from "@/lib/supabase/config";

export const metadata = { title: "Criar conta | Minhas tarefas" };

export default function Cadastro() {
  return (
    <>
      <h1>Criar conta</h1>
      <FormularioConta cadastro configurado={supabaseConfigurado} />
    </>
  );
}
