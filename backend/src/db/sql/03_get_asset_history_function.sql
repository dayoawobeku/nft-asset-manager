CREATE OR REPLACE FUNCTION public.get_asset_history(p_asset_id UUID)
RETURNS TABLE (
  id UUID,
  asset_id UUID,
  from_user_id UUID,
  to_user_id UUID,
  created_at TIMESTAMPTZ,
  from_email TEXT,
  to_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    at.id,
    at.asset_id,
    at.from_user_id,
    at.to_user_id,
    at.created_at,
    at.from_email,
    at.to_email
  FROM
    public.asset_transactions at
  WHERE
    at.asset_id = p_asset_id
  ORDER BY
    at.created_at DESC;
END;
$$;