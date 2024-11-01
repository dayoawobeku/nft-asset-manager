CREATE OR REPLACE FUNCTION public.get_tags()
RETURNS TABLE (
    id UUID,
    name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.name
    FROM public.tags t
    ORDER BY t.name;
END;
$$;