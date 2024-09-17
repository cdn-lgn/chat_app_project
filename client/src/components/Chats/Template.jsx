import React from 'react'
import { darkGrey, lightGrey } from '../uiVariables/colors';

const Template = ({prop, index, onClick, selectedChat}) => {
	const handleClick = () => {
		onClick(); // Call the onClick function passed from the parent component
	};

	return (
		<div className="w-full h-fit mb-2 rounded-lg p-1 cursor-pointer duration-300" style={{background : selectedChat==index && lightGrey, color : 'white'}} onClick={handleClick}>
			<div className="flex items-center gap-4">
				<img src="" alt="avatar" className="bg-red-400 h-12 w-12 rounded-full" />
				<div className="flex justify-center flex-col">
					<h2 className="text-left">{prop.type}</h2>
					<h6 className="text-sm">{prop.type=='group' ? (prop.user+": last Message") : "last Message"}</h6>
				</div>
			</div>
		</div>
	)
}

export default Template