CREATE OR REPLACE FUNCTION public.transfer_asset(
    p_asset_id UUID,
    p_from_user_id UUID,
    p_recipient_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_recipient_user_id UUID;
    v_from_email TEXT;
    v_asset_exists BOOLEAN;
BEGIN
    -- Check if the asset exists and belongs to the sender
    SELECT EXISTS (
        SELECT 1 FROM public.assets 
        WHERE id = p_asset_id AND user_id = p_from_user_id
    ) INTO v_asset_exists;

    IF NOT v_asset_exists THEN
        RAISE EXCEPTION 'Asset not found or you are not the owner of this asset';
    END IF;

    -- Get the recipient's user_id from public.users
    SELECT user_id INTO v_recipient_user_id
    FROM public.users
    WHERE email = p_recipient_email;

    -- Check if the recipient exists
    IF v_recipient_user_id IS NULL THEN
        RAISE EXCEPTION 'Recipient not found in public.users table';
    END IF;

    -- Check if the sender is trying to transfer to themselves
    IF p_from_user_id = v_recipient_user_id THEN
        RAISE EXCEPTION 'Cannot transfer asset to yourself';
    END IF;

    -- Get the sender's email
    SELECT email INTO v_from_email
    FROM public.users
    WHERE user_id = p_from_user_id;

    -- Check if the sender exists
    IF v_from_email IS NULL THEN
        RAISE EXCEPTION 'Sender not found in public.users table';
    END IF;

    -- Update the asset ownership
    UPDATE public.assets
    SET user_id = v_recipient_user_id
    WHERE id = p_asset_id;

    -- Record the transaction
    INSERT INTO public.asset_transactions (asset_id, from_user_id, to_user_id, from_email, to_email)
    VALUES (p_asset_id, p_from_user_id, v_recipient_user_id, v_from_email, p_recipient_email);

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in transfer_asset: % %', SQLERRM, SQLSTATE;
END;
$$;