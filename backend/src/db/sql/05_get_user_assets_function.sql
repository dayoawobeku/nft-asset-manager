CREATE OR REPLACE FUNCTION public.get_user_assets(
    p_user_id UUID,
    p_category TEXT DEFAULT NULL,
    p_search_query TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ,
    tags TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.name,
        a.description,
        a.image_url,
        a.created_at,
        array_agg(t.name) AS tags
    FROM 
        public.assets a
    LEFT JOIN 
        public.asset_tags at ON a.id = at.asset_id
    LEFT JOIN 
        public.tags t ON at.tag_id = t.id
    WHERE 
        a.user_id = p_user_id
        AND (p_category IS NULL OR t.name = p_category)
        AND (
            p_search_query IS NULL 
            OR a.name ILIKE '%' || p_search_query || '%'
            OR a.description ILIKE '%' || p_search_query || '%'
        )
    GROUP BY 
        a.id, a.name, a.description, a.image_url, a.created_at
    ORDER BY 
        a.created_at DESC;
END;
$$;