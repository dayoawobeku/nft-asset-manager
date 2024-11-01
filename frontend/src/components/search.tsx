'use client';

import {useCallback, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Search as SearchIc} from 'lucide-react';
import {Input} from './ui/input';
import {useDebounce} from '@/hooks/useDebounce';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

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

  const debouncedSearch = useDebounce(handleSearch, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    debouncedSearch(newTerm);
  };

  return (
    <div className="relative max-w-96 md:w-96 ">
      <SearchIc className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
      <Input
        name="search"
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={handleInputChange}
        className="pl-10 text-white font-medium placeholder:text-neutral-200 placeholder:font-normal rounded-xl border-transparent focus:border-neutral-400 h-12 w-full bg-neutral-700"
      />
    </div>
  );
}
