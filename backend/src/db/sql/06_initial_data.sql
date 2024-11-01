-- Insert some initial tags
INSERT INTO public.tags (name) VALUES
('Art'),
('Music'),
('Collectibles'),
('Sports'),
('Virtual Real Estate')
ON CONFLICT (name) DO NOTHING;
