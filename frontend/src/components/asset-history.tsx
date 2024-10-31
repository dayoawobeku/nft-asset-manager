import {trpcClient} from '../utils/trpc';
import AssetHistoryDialog from './asset-history-dialog';

interface AssetHistoryServerProps {
  assetId: string;
  assetName: string;
  currentUserId: string;
}

export default async function AssetHistory({
  assetId,
  assetName,
  currentUserId,
}: AssetHistoryServerProps) {
  const transactions = await trpcClient.asset.getAssetHistory.query({assetId});

  return (
    <AssetHistoryDialog
      assetName={assetName}
      transactions={transactions}
      currentUserId={currentUserId}
    />
  );
}
