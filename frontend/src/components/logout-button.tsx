'use client';

import {logout} from '@/actions';
import {Button} from './ui/button';

export default function LogoutButton() {
  return (
    <Button
      onClick={async () => {
        await logout();
      }}
      className="text-neutral-50"
    >
      Logout
    </Button>
  );
}
