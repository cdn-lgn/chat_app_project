import React from 'react'
import './style.css'
import { darkGrey } from '../uiVariables/colors';

const GroupNotification = () => {
	return (
		<div className="w-full h-fit rounded-lg p-1" style={{background:darkGrey , color:'white'}}>
			<div className="flex items-center gap-4">
				<img src="" alt="avatar" className="bg-red-400 h-10 w-10 rounded-full" />
				<div className="flex-center flex-col">
					<h2>GroupName</h2>
					<h6 className="text-sm">added by friend</h6>
				</div>
			</div>
			<div className="flex-center items-end">
				<div className="request w-1/2 bg-gray-700 hover:bg-gray-600">
					<h2>Remove</h2>
				</div>
				<div className="request w-1/2 bg-red-700 hover:bg-red-600">
					<h2>Leave</h2>
				</div>
			</div>
		</div>
	)
}

export default GroupNotification