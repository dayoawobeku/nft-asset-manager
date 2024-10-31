'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'react-hot-toast';
import {Button} from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {Input} from './ui/input';
import {transferAsset} from '../actions';

const transferSchema = z.object({
  recipientEmail: z.string().email('Invalid email address'),
});

type TransferFormValues = z.infer<typeof transferSchema>;

export default function TransferAssetDialog({
  assetId,
  assetName,
}: {
  assetId: string;
  assetName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientEmail: '',
    },
  });

  const {isSubmitting} = form.formState;

  const onSubmit = async (data: TransferFormValues) => {
    try {
      const formData = new FormData();
      formData.append('assetId', assetId);
      formData.append('recipientEmail', data.recipientEmail);

      const result = await transferAsset(formData);
      if (result.success) {
        toast.success('Asset transferred successfully');
        setIsOpen(false);
        form.reset();
      } else {
        toast.error(result.error || 'Failed to transfer asset');
      }
    } catch (error) {
      console.error('Error in transferAsset:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="purple" className="rounded-xl">
          Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 text-white">
        <DialogHeader className="space-y-3">
          <DialogTitle>Transfer Asset: {assetName}</DialogTitle>
          <DialogDescription className="text-neutral-100">
            Enter the email address of the recipient you want to transfer this
            asset to.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipientEmail"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Recipient&apos;s Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user@example.com"
                      className="placeholder:text-neutral-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="bg-transparent hover:bg-transparent hover:text-neutral-50"
              >
                Cancel
              </Button>
              <Button type="submit" variant="purple" disabled={isSubmitting}>
                {isSubmitting ? 'Transferring...' : 'Transfer Asset'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
