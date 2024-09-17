import React, { useState } from 'react'
import Template from '../Chats/Template'
import { darkGrey, lightGrey } from '../uiVariables/colors';

const Favorites = () => {
	const [selectedChat, setSelectedChat] = useState()
	const typeArray = [
		{type:'frined'},
		{type:'group', user:'userA'},
		{type:'group', user:'userB'},
		{type:'frined'},
		{type:'group', user:'userA'},
		{type:'frined'},
	]

	const selectedPerson = (ind) =>{
		setSelectedChat(ind)
	}

	return (
		<div className={`w-[25%] h-dvh p-2 custom-scrollbar overflow-y-auto`} style={{background: darkGrey}}>
			{
				typeArray.map((val,ind)=>(
					<Template 
						key={ind} 
						prop={val}
						index={ind} // Pass the index as a prop
          				selectedChat={selectedChat} // Pass the selectedChat state as a prop
						onClick={()=>selectedPerson(ind)}
					/>
				)
			)}
		</div>
	)
}

export default Favorites