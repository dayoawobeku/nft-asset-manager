'use client';

import {useCallback} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Input} from './ui/input';
import {Tabs, TabsList, TabsTrigger} from './ui/tabs';

export default function SearchAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (name === 'category') {
        params.delete('query');
      }

      if (value === 'all') {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category'); // Remove category when searching

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    router.push(`?${params.toString()}`);
  };

  const currentCategory = searchParams.get('category') || 'all';

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex items-center gap-1 search"
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const term = formData.get('search') as string;
          handleSearch(term);
        }}
      >
        <Input
          name="search"
          type="search"
          placeholder="Search"
          defaultValue={searchParams.get('query') || ''}
          className="text-white font-medium placeholder:text-neutral-200 placeholder:font-normal rounded-xl border-transparent focus:border-neutral-400 h-12 w-96"
        />
      </form>

      <Tabs
        defaultValue={currentCategory}
        onValueChange={value => {
          router.push(`?${createQueryString('category', value)}`);
        }}
      >
        <TabsList className="bg-transparent p-0 gap-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-neutral-500 data-[state=active]:text-white bg-transparent text-white text-base hover:bg-neutral-500 rounded-xl py-2"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="art"
            className="data-[state=active]:bg-neutral-500 data-[state=active]:text-white bg-transparent text-white text-base hover:bg-neutral-500 rounded-xl py-2"
          >
            Art
          </TabsTrigger>
          <TabsTrigger
            value="gaming"
            className="data-[state=active]:bg-neutral-500 data-[state=active]:text-white bg-transparent text-white text-base hover:bg-neutral-500 rounded-xl py-2"
          >
            Gaming
          </TabsTrigger>
          <TabsTrigger
            value="music"
            className="data-[state=active]:bg-neutral-500 data-[state=active]:text-white bg-transparent text-white text-base hover:bg-neutral-500 rounded-xl py-2"
          >
            Music
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
