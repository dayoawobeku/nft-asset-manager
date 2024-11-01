import {redirect} from 'next/navigation';
import Image from 'next/image';
import {format} from 'date-fns';
import {createClient} from '@/utils/supabase/server';
import LogoutButton from '@/components/logout-button';
import {trpcClient} from '@/utils/trpc';
import CreateAssetDialog from '@/components/create-asset-dialog';
import TransferAssetDialog from '@/components/transfer-asset-dialog';
import AssetHistory from '@/components/asset-history';
import Search from '@/components/search';
import Category from '@/components/category';

export default async function Home({
  searchParams,
}: {
  searchParams: {category?: string; query?: string};
}) {
  const supabase = await createClient();

  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();
  const assets = await trpcClient.asset.getUserAssets.query({
    category: searchParams.category,
    query: searchParams.query,
  });

  const tags = await trpcClient.tag.getTags.query();

  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="bg-neutral-800 min-h-screen">
      <div className="mx-auto w-full max-w-[2560px] px-4 sm:px-8 xxl:px-16 h-full">
        <nav className="py-6 flex items-center justify-between">
          <p className="text-purple-100 text-sm font-bold">LOGO</p>
          <div className="hidden md:block">
            <Search />
          </div>
          <LogoutButton />
        </nav>

        <div className="block md:hidden">
          <Search />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Category />
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
              Your collections
            </h1>

            <CreateAssetDialog tags={tags} />
          </div>

          <div
            className="py-8 grid gap-x-4 gap-y-8"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(267px,1fr))',
            }}
          >
            {assets.map(asset => (
              <div
                key={asset.id}
                className="relative group flex flex-col bg-neutral-700 w-full rounded-xl shadow hover:-translate-y-2 transition duration-300 hover:shadow-md"
              >
                <div className="relative w-full h-52">
                  <div className="absolute w-full left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <TransferAssetDialog
                      assetId={asset.id}
                      assetName={asset.name}
                    />
                    <AssetHistory
                      assetId={asset.id}
                      assetName={asset.name}
                      currentUserId={user.id}
                    />
                  </div>
                  <Image
                    alt={asset.description || ''}
                    src={asset.image_url}
                    fill
                    className="rounded-t-xl object-cover group-hover:brightness-75 transition-all ease-in-out duration-300"
                  />
                </div>
                <div className="flex flex-col grow px-3 py-4">
                  <p className="text-white font-semibold truncate">
                    {asset.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-100 font-medium">
                    {asset.description}
                  </p>
                  <div className="mt-auto">
                    <p className="mt-2 text-xs text-neutral-300 font-medium">
                      Added on{' '}
                      {asset.created_at
                        ? format(new Date(asset.created_at), 'Pp')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
