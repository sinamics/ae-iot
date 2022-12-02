import { getCurrentUser } from '@/lib/session';
import { Session } from 'next-auth';
import { notFound } from 'next/navigation';
import Wrapper from './wrapper';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  session: Session;
}

export default async function IotLayout(props: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return <div className=''>{notFound()}</div>;
  }

  return <Wrapper {...props} />;
}
