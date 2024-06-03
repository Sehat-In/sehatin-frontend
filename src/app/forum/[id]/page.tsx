"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/components/context/UserContext';
import { Spinner } from '@chakra-ui/react';
import SingleUserViewModule from '@/modules/forum/SingleUserView';

const SingleUserViewPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const {loading, isAuthenticated} = useUserContext();
  
    useEffect(()=>{
        if(!loading && !isAuthenticated){
            router.push('/login')
        }
    }, [loading])
  
    return (
      <div style={{ padding: '30px' }}>
        {loading ? <div><Spinner color='green.300' /></div> : isAuthenticated ? <SingleUserViewModule post_id={params.id}/> : <></>}
      </div>
    );
  }
  
  export default SingleUserViewPage;
