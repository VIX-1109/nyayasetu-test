import { redirect } from 'next/navigation';

export default function AdvocateRoot() {
  redirect('/advocate/verification');
  return null;
}
