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
} from '@chakra-ui/react'
import axios from 'axios';
import { useState } from 'react';

const Notifications = (props: any) => {
    const [notificationData, setNotificationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const notificationClick = () => {
        setNotificationData([]);
        axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts/get-notifications/' + props.username)
            .then((res) => {
                setNotificationData(res.data);
                setLoading(false);
            })
    }

    const clearNotifications = () => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts/remove-notifications/' + props.username)
            .then((res) => {
                setNotificationData([]);
                setLoading(false);
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
                                    <p>{item}</p>
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