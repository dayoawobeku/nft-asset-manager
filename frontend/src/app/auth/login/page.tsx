'use client';

import {useFormStatus} from 'react-dom';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {Loader} from 'lucide-react';
import {login} from '@/actions';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {createClient} from '@/utils/supabase/client';

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return `${url}/auth/callback`;
};

function DummyUserButton() {
  const {pending} = useFormStatus();

  return (
    <Button disabled={pending} className="w-full h-10">
      {pending && <Loader className="animate-spin" />}
      Login as dummy user
    </Button>
  );
}

export default function Auth() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await login();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Logged in successfully');
        router.push('/');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    }
  };

  async function loginWithGoogle() {
    const supabase = await createClient();

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getURL(),
      },
    });
  }

  return (
    <div className="flex bg-purple-25/70 h-screen w-full items-start pt-20 px-4">
      <Card className="mx-auto max-w-96 w-full border-none">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Pick an option to log into your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 space-y-2">
          <form action={handleLogin} className="grid gap-4">
            <DummyUserButton />
          </form>
          <Button
            onClick={loginWithGoogle}
            variant="outline"
            className="w-full"
          >
            Login with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
