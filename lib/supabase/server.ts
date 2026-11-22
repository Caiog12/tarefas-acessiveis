import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseKey, supabaseUrl } from "./config";

export async function criarClienteServidor() {
  const cookiesDaSessao = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookiesDaSessao.getAll(),
      setAll(cookiesNovos) {
        try {
          for (const { name, value, options } of cookiesNovos) {
            cookiesDaSessao.set(name, value, options);
          }
        } catch {
          // A página só lê cookies. A renovação da sessão acontece no proxy.
        }
      },
    },
  });
}
