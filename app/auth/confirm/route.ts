import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const token_hash = request.nextUrl.searchParams.get("token_hash");

  if (supabaseConfigurado && token_hash) {
    const supabase = await criarClienteServidor();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: "email" });
    if (!error) return NextResponse.redirect(new URL("/tarefas", request.url));
  }

  return NextResponse.redirect(new URL("/auth/login?confirmacao=erro", request.url));
}
