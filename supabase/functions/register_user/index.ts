
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { nom, prenom, email, telephone, role, password } = await req.json();

    if (!nom || !prenom || !email || !telephone || !role || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Attempting to register user:", email);

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User already exists with this email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // For demonstration, we'll directly insert into the users table
    // In production, we would call the register_user RPC function
    try {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            nom, 
            prenom, 
            email, 
            telephone, 
            role 
            // password would be hashed in a real scenario
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      console.log("User registered successfully:", newUser.id);
      
      return new Response(
        JSON.stringify(newUser.id),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (rpcError) {
      console.error("Registration error:", rpcError);
      return new Response(
        JSON.stringify({ error: rpcError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
