import React, { useState } from 'react'
import Template from '../Chats/Template'
import { darkGrey, lightGrey } from '../uiVariables/colors';

const Friends = () => {
	const [selectedChat, setSelectedChat] = useState()

	const typeArray = [
		{type:'frined'},
		{type:'frined'},
		{type:'frined'},
	]

	const selectedPerson = (ind) =>{
		setSelectedChat(ind)
		console.log(ind)
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

export default Friends