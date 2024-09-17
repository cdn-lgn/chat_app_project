import React from 'react'
import FriendRequest from './FriendRequest'
import GroupNotification from './GroupNotification'
import { darkBlue, lightBlue, lightGrey } from '../uiVariables/colors';

const Notifications = () => {
	console.log('Notifications')
	return (
		<div className="custom-scrollbar absolute flex flex-col gap-1 overflow-auto items-center p-1 top-5 left-20 md:w-64 min-h-64 max-h-96 z-10 rounded-lg" style={{background: darkBlue}}>
			<FriendRequest />
			<FriendRequest />
			<FriendRequest />
			<GroupNotification />
			<GroupNotification />
		</div>
	)
}

export default Notifications