'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'react-hot-toast';
import {z} from 'zod';
import {Check, ChevronsUpDown} from 'lucide-react';
import {Button} from './ui/button';
import {Input} from './ui/input';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover';
import {cn} from '@/utils';
import {createAsset} from '../actions';
import {Database} from '../../../shared/types/supabase';

type Tag = Database['public']['Tables']['tags']['Row'];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.custom<File>(v => v instanceof File, 'Please upload an image'),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateAssetDialog({tags}: {tags: Tag[]}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: [],
    },
  });

  const {isSubmitting} = form.formState;

  async function onSubmit(data: FormValues) {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('file', data.image);
      formData.append('tags', JSON.stringify(data.tags));

      const result = await createAsset(formData);

      if (result.success) {
        toast.success('Asset created successfully');
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create asset');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="purple">Add new asset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900">
        <DialogHeader className="space-y-3">
          <DialogTitle>Create a new asset</DialogTitle>
          <DialogDescription className="mt-3 text-neutral-100">
            Add a new asset to your collection by filling out the form below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="col-span-3 placeholder:text-neutral-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="col-span-3 placeholder:text-neutral-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Tags (optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'bg-transparent hover:bg-transparent border-neutral-400 focus:border-neutral-300 hover:text-white w-full justify-between rounded-xl shadow-none',
                            !field.value && 'text-white',
                          )}
                        >
                          {field.value && field.value.length > 0
                            ? `${field.value?.length} tags selected`
                            : 'Select tags'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-red-100">
                      <Command>
                        <CommandList>
                          <CommandInput placeholder="Search tags..." />
                          <CommandEmpty>No tags found.</CommandEmpty>
                          <CommandGroup>
                            {tags.map(tag => (
                              <CommandItem
                                value={tag.name}
                                key={tag.id}
                                onSelect={() => {
                                  const currentValue = field.value || [];
                                  const newValue = currentValue.includes(tag.id)
                                    ? currentValue.filter(id => id !== tag.id)
                                    : [...currentValue, tag.id];
                                  field.onChange(newValue);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value?.includes(tag.id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {tag.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({field: {onChange, value, ...field}}) => (
                <FormItem>
                  <FormLabel>Cover image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      className="col-span-3 file:text-purple-100 file:bg-purple-900 file:border-0 file:rounded-lg file:px-4 file:pb-1 file:mr-4 file:hover:bg-purple-800 cursor-pointer"
                      {...field}
                    />
                  </FormControl>
                  {value && (
                    <p className="text-sm text-neutral-300">
                      Selected: {value.name}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="bg-transparent hover:bg-transparent hover:text-neutral-50"
              >
                Cancel
              </Button>
              <Button variant="purple" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create asset'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
