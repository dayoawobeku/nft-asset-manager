'use client';

import {useCallback} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Tabs, TabsList, TabsTrigger} from './ui/tabs';

export default function Category() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === 'all') {
        params.delete('category');
      } else {
        params.set('category', value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const currentCategory = searchParams.get('category') || 'all';

  return (
    <Tabs
      defaultValue={currentCategory}
      onValueChange={value => {
        router.push(`?${createQueryString(value)}`);
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
  );
}
