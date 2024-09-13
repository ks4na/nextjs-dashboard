import { useSearchParams } from 'next/navigation';

export default function RedirectToInput() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('callbackUrl') || '/dashboard';

  return <input type="hidden" name="redirectTo" value={redirectTo} />;
}
