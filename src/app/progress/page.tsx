"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserViewModule from "@/modules/progress/UserView";
import { useUserContext } from '@/components/context/UserContext';

const UserViewPage = () => {
  const { userData } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!userData || !userData.id) {
      router.push('/login');
    }
  }, [userData, router]);

  if (!userData || !userData.id) {
    return null;
  }

  return (
    <div style={{ padding: '30px' }}>
      <UserViewModule />
    </div>
  );
}

export default UserViewPage;
