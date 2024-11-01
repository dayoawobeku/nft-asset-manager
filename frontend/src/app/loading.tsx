import {Loader} from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-neutral-800 flex pt-20 justify-center min-h-screen">
      <Loader className="animate-spin text-neutral-100" />
    </div>
  );
}
