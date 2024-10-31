'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useCallback, useState, useEffect} from 'react';
import {Input} from './ui/input';
import {Search as SearchIc} from 'lucide-react';
import {useDebounce} from '@/hooks/useDebounce';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }

      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, handleSearch]);

  return (
    <div className="relative w-96">
      <SearchIc className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
      <Input
        name="search"
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="pl-10 text-white font-medium placeholder:text-neutral-200 placeholder:font-normal rounded-xl border-transparent focus:border-neutral-400 h-12 w-full bg-neutral-700"
      />
    </div>
  );
}
