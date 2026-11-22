export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const supabaseConfigurado = Boolean(
  supabaseUrl && supabaseKey &&
  supabaseUrl !== "https://seu-projeto.supabase.co" &&
  supabaseKey !== "sb_publishable_substitua"
);
