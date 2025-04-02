
-- Create auth_logs table
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('login', 'logout')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT
);

-- Enable RLS on auth_logs table
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own logs
CREATE POLICY "Users can view their own auth logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for administrators to view all logs
CREATE POLICY "Admins can view all auth logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('responsable', 'superviseur')
    )
  );

-- Create policy for inserting auth logs
CREATE POLICY "Allow inserting auth logs"
  ON public.auth_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index on user_id and timestamp for faster queries
CREATE INDEX IF NOT EXISTS auth_logs_user_id_idx ON public.auth_logs (user_id);
CREATE INDEX IF NOT EXISTS auth_logs_timestamp_idx ON public.auth_logs (timestamp);
