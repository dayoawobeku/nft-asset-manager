-- Create users table
CREATE TABLE public.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assets table
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(user_id),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create asset_transactions table
CREATE TABLE public.asset_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES public.assets(id),
    from_user_id UUID REFERENCES public.users(user_id),
    to_user_id UUID NOT NULL REFERENCES public.users(user_id),
    from_email TEXT,
    to_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tags table
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- Create asset_tags junction table
CREATE TABLE public.asset_tags (
    asset_id UUID REFERENCES public.assets(id),
    tag_id UUID REFERENCES public.tags(id),
    PRIMARY KEY (asset_id, tag_id)
);