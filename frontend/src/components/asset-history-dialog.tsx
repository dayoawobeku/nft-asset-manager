'use client';

import {useState} from 'react';
import {format} from 'date-fns';
import {Button} from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {Database} from '../../../shared/types/supabase';

type Transaction = Database['public']['Tables']['asset_transactions']['Row'];

interface AssetHistoryDialogProps {
  assetName: string;
  transactions: Transaction[];
  currentUserId: string;
}

export default function AssetHistoryDialog({
  assetName,
  transactions,
  currentUserId,
}: AssetHistoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const formatTransactionMessage = (transaction: Transaction) => {
    const fromUser =
      transaction.from_user_id === currentUserId
        ? 'You'
        : transaction.from_email;
    const toUser =
      transaction.to_user_id === currentUserId ? 'you' : transaction.to_email;

    if (!transaction.from_user_id) {
      return `Asset created and assigned to ${toUser}`;
    }

    return `Transferred from ${fromUser} to ${toUser}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="rounded-xl">
          View History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 text-white">
        <DialogHeader className="space-y-3">
          <DialogTitle>Asset History: {assetName}</DialogTitle>
          <DialogDescription className="mt-2 text-neutral-300">
            Transaction history for this asset.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="bg-neutral-700 p-3 rounded-lg"
              >
                <p className="text-sm font-medium">
                  {formatTransactionMessage(transaction)}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {transaction.created_at
                    ? format(new Date(transaction.created_at), 'PPpp')
                    : 'N/A'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-neutral-400">
              No transaction history available.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
