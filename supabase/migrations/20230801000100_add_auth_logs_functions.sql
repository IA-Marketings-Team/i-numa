
-- Function to get all auth logs
CREATE OR REPLACE FUNCTION public.get_auth_logs()
RETURNS SETOF auth_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM auth_logs ORDER BY timestamp DESC;
$$;

-- Function to get auth logs for a specific user
CREATE OR REPLACE FUNCTION public.get_user_auth_logs(user_id_param UUID)
RETURNS SETOF auth_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM auth_logs WHERE user_id = user_id_param ORDER BY timestamp DESC;
$$;

-- Function to create an auth log
CREATE OR REPLACE FUNCTION public.create_auth_log(
  user_id_param UUID,
  action_param TEXT,
  user_agent_param TEXT DEFAULT NULL,
  ip_address_param TEXT DEFAULT NULL
)
RETURNS SETOF auth_logs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_log_id UUID;
BEGIN
  INSERT INTO auth_logs (user_id, action, timestamp, user_agent, ip_address)
  VALUES (
    user_id_param,
    action_param,
    now(),
    user_agent_param,
    ip_address_param
  )
  RETURNING id INTO new_log_id;
  
  RETURN QUERY SELECT * FROM auth_logs WHERE id = new_log_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_auth_logs() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_auth_logs(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_auth_log(UUID, TEXT, TEXT, TEXT) TO authenticated;
