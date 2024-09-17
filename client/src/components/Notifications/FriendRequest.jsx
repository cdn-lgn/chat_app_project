import React from 'react'
import './style.css'
import { darkGrey } from '../uiVariables/colors';

const FriendRequest = () => {
	return (
		<div className="w-full h-fit rounded-lg p-1" style={{background:darkGrey , color:'white'}}>
			<div className="flex items-center gap-4">
				<img src="" alt="avatar" className="bg-red-400 h-10 w-10 rounded-full" />
				<h2>Friend</h2>
			</div>
			<div className="flex-center">
				<div className="request bg-green-700 hover:bg-green-600">
					<h2>Accept</h2>
				</div>
				<div className="request bg-red-700 hover:bg-red-600">
					<h2>Reject</h2>
				</div>
			</div>
		</div>
	)
}

export default FriendRequest