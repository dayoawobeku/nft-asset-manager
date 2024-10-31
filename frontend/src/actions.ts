'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {Session} from '@supabase/supabase-js';
import {createClient} from '@/utils/supabase/server';
import {trpcClient} from './utils/trpc';
import {TRPCClientError} from '@trpc/client';

export async function login(): Promise<{error?: string; session?: Session}> {
  const supabase = await createClient();

  // for dummy user
  const credentials = {
    email: 'dawobeku@gmail.com',
    password: 'password',
  };

  const {data, error} = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return {error: error.message};
  } else {
    revalidatePath('/', 'layout');
    return {session: data.session};
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

export async function createAsset(data: FormData) {
  try {
    const image = data.get('file') as File;
    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const tags = JSON.parse(data.get('tags') as string) as string[];

    if (!image || !(image instanceof File)) {
      return {
        success: false,
        error: 'No image file provided',
      };
    }

    const arrayBuffer = await image.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const uploadResult = await trpcClient.upload.uploadFile.mutate({
      filename: image.name,
      mimetype: image.type,
      buffer: Array.from(uint8Array),
    });

    if (!uploadResult || !uploadResult.url) {
      throw new Error('Failed to upload image');
    }

    const asset = await trpcClient.asset.createAsset.mutate({
      name,
      description,
      image_url: uploadResult.url,
      tagIds: tags,
    });

    return {success: true, asset};
  } catch (error) {
    console.error('Error in createAsset:', error);
    if (error instanceof TRPCClientError) {
      return {success: false, error: error.message};
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function transferAsset(formData: FormData) {
  try {
    const assetId = formData.get('assetId') as string;
    const recipientEmail = formData.get('recipientEmail') as string;

    if (!assetId || !recipientEmail) {
      return {success: false, error: 'Missing required fields'};
    }

    const result = await trpcClient.asset.transferAsset.mutate({
      assetId,
      recipientEmail,
    });

    if (result.success) {
      revalidatePath('/');
      return {success: true};
    } else {
      return {success: false, error: 'Failed to transfer asset'};
    }
  } catch (error) {
    console.error('Error in transferAsset:', error);
    if (error instanceof TRPCClientError) {
      return {success: false, error: error.message};
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
