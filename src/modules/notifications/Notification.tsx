import { BellIcon } from '@chakra-ui/icons';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Button,
    Portal,
    IconButton,
    Icon,
    Spinner,
    Flex,
} from '@chakra-ui/react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Container } from 'postcss';
import { useState } from 'react';

interface message{
    post_id: string,
    post_title: string,
    comment_username: string,
    date: string
}

const Notifications = (props: any) => {
    const [notificationData, setNotificationData] = useState<message[]>([] as message[]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const notificationClick = () => {
        setNotificationData([]);
        axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts/get-notifications/' + props.username)
            .then((res) => {
                const data = res.data;
                const notificationData:message[] = []
                data.map((item:any, index:any)=>{
                    const msg = item.split(";");
                    const temp:message = {
                        post_id: msg[0],
                        post_title: msg[1],
                        comment_username: msg[2],
                        date: msg[3]
                    }
                    notificationData.push(temp);
                })
                setNotificationData(notificationData);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false)
            })
    }

    const clearNotifications = () => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts/remove-notifications/' + props.username)
            .then((res) => {
                setNotificationData([] as message[]);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false)
            })
    }
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <IconButton aria-label="notification-button" boxSize={7} isRound={true} variant='solid' colorScheme={props.color} icon={<Icon as={BellIcon} boxSize={5} onClick={notificationClick}/>} />
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <Button colorScheme='red' onClick={clearNotifications}>Clear Notifications</Button>
                        </PopoverBody>
                        {loading ? <Spinner color="green.300"/>:notificationData.map((item: any, index: number) => {
                            return (
                                <PopoverBody key={index}>
                                    <button onClick={()=>router.push(`/forum/${item.post_id}`)} style={{backgroundColor:'whitesmoke', borderRadius:'5px', color:'black', }}>{item.comment_username} commented on your subscribed post: {item.post_title}</button>
                                </PopoverBody> 
                            )
                        })}
                    </PopoverContent>
                </Portal>
            </Popover>
        </>
    )
}

export default Notifications;