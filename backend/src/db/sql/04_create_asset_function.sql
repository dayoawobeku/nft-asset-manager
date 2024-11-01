CREATE OR REPLACE FUNCTION public.create_asset(
    p_user_id UUID,
    p_name TEXT,
    p_description TEXT,
    p_image_url TEXT,
    p_tag_ids UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_asset_id UUID;
BEGIN
    -- Insert the new asset
    INSERT INTO public.assets (user_id, name, description, image_url)
    VALUES (p_user_id, p_name, p_description, p_image_url)
    RETURNING id INTO v_asset_id;

    -- Associate tags with the asset
    IF p_tag_ids IS NOT NULL THEN
        INSERT INTO public.asset_tags (asset_id, tag_id)
        SELECT v_asset_id, unnest(p_tag_ids);
    END IF;

    -- Record the creation as a transaction
    INSERT INTO public.asset_transactions (asset_id, to_user_id, to_email)
    SELECT v_asset_id, p_user_id, email
    FROM public.users
    WHERE user_id = p_user_id;

    RETURN v_asset_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in create_asset: % %', SQLERRM, SQLSTATE;
END;
$$;