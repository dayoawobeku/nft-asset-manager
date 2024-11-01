import {SupabaseClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {t, TRPCError} from '../utils/trpc';
import type {Database} from '../../../shared/types/supabase';
import {supabase} from '../utils/db';

type Tables = Database['public']['Tables'];
type Functions = Database['public']['Functions'];
type Asset = Tables['assets']['Row'];
type Tag = Tables['tags']['Row'];
type AssetInsert = Tables['assets']['Insert'];
type AssetInputType = Omit<AssetInsert, 'id' | 'created_at' | 'user_id'> & {
  tagIds: string[];
};
type CreateAssetParams = Functions['create_asset']['Args'];
type AssetWithTags = Asset & {tags: Pick<Tag, 'id' | 'name'>[]};

const typedSupabase = supabase as SupabaseClient<Database>;

const assetInput = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable(),
  image_url: z.string().url('Invalid image URL'),
  tagIds: z.array(z.string()),
}) as z.ZodType<AssetInputType>;

const getUserAssetsInput = z.object({
  category: z.string().optional(),
  query: z.string().optional(),
});

export const assetRouter = t.router({
  getUserAssets: t.procedure
    .input(getUserAssetsInput)
    .query(async ({input, ctx}) => {
      const {user} = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User is not authenticated',
        });
      }

      try {
        const {data, error} = await typedSupabase.rpc('get_user_assets', {
          p_user_id: user.id,
          p_category: input.category ?? undefined,
          p_query: input.query ?? undefined,
        });

        if (error) {
          console.error('Error fetching assets:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }

        return (data as AssetWithTags[]) ?? [];
      } catch (error) {
        console.error('Error in getUserAssets:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Failed to fetch assets',
        });
      }
    }),

  createAsset: t.procedure.input(assetInput).mutation(async ({input, ctx}) => {
    const {user} = ctx;

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not authenticated',
      });
    }

    try {
      const {data, error} = await typedSupabase.rpc('create_asset', {
        p_user_id: user.id,
        p_name: input.name,
        p_description: input.description,
        p_image_url: input.image_url,
        p_tag_ids: input.tagIds,
      } as CreateAssetParams);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to create asset');
      }

      return data as {asset: Asset; tags: Tag[]};
    } catch (error) {
      console.error('Error in createAsset:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          error instanceof Error ? error.message : 'Failed to create asset',
      });
    }
  }),

  transferAsset: t.procedure
    .input(
      z.object({
        assetId: z.string(),
        recipientEmail: z.string().email(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {user} = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User is not authenticated',
        });
      }

      if (user.email === input.recipientEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot transfer asset to yourself',
        });
      }

      try {
        const {data, error} = await supabase.rpc('transfer_asset', {
          p_asset_id: input.assetId,
          p_from_user_id: user.id,
          p_recipient_email: input.recipientEmail,
        });

        if (error) {
          console.error('Transfer asset error:', error);
          if (error.message.includes('Recipient not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Recipient not found in public.users table',
            });
          } else if (
            error.message.includes('Asset not found or you are not the owner')
          ) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Asset not found or you are not the owner of this asset',
            });
          } else if (
            error.message.includes('Cannot transfer asset to yourself')
          ) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Cannot transfer asset to yourself',
            });
          } else if (error.message.includes('Sender not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Sender not found in public.users table',
            });
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Failed to transfer asset: ${error.message}`,
            });
          }
        }

        return {success: true};
      } catch (error) {
        console.error('Error in transferAsset:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Failed to transfer asset',
        });
      }
    }),

  getAssetHistory: t.procedure
    .input(z.object({assetId: z.string()}))
    .query(async ({input, ctx}) => {
      const {user} = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User is not authenticated',
        });
      }

      try {
        const {data, error} = await typedSupabase.rpc('get_asset_history', {
          p_asset_id: input.assetId,
        });

        if (error) {
          console.error('Error fetching asset transactions:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch asset transactions',
          });
        }

        return data || [];
      } catch (error) {
        console.error('Error in getAssetHistory:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch asset transactions',
        });
      }
    }),
});
