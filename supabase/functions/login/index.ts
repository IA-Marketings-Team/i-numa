
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
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Attempting login for:", email);

    // Use the auth_user function to verify credentials
    const { data: authData, error: authError } = await supabase.rpc(
      'auth_user',
      { user_email: email, user_password: password }
    );

    if (authError) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Authentication failed: " + authError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    if (!authData || authData.length === 0) {
      console.error("Invalid credentials for user:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const userData = authData[0];
    console.log("User authenticated:", userData);

    // Get complete user information
    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.id)
      .single();

    if (userError) {
      console.error("Error fetching user details:", userError);
      return new Response(
        JSON.stringify({ error: "Error fetching user details: " + userError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Generate a simple token
    const token = crypto.randomUUID();
    
    console.log("Login successful for:", email);
    
    return new Response(
      JSON.stringify({ token, user: userDetails }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred: " + (error.message || error) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
