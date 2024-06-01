"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserViewModule from "@/modules/progress/UserView";
import { useUserContext } from '@/components/context/UserContext';

const UserViewPage = () => {
  const router = useRouter();
  const {loading, isAuthenticated} = useUserContext();

  useEffect(()=>{
      if(!loading && !isAuthenticated){
          router.push('/login')
      }
  }, [loading])

  return (
    <div style={{ padding: '30px' }}>
      <UserViewModule />
    </div>
  );
}

export default UserViewPage;
