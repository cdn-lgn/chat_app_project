import React, { lazy } from 'react'


const Chats = lazy(()=>import('../components/Chats/Chats'))
const SideBar = lazy (()=>import('../components/Navbar/SideBar'))
const Conversation = lazy (()=>import('../components/Conversation/Conversation'))
const Friends = lazy (()=>import('../components/Friends/Friends'))
const Favorites = lazy (()=>import('../components/Favorites/Favorites'))
const UserProfile = lazy (()=>import('../components/Settings/UserProfile'))



const Home = () => {
	return (
		<div className="text-white rounded-lg flex items-center justify-center w-full">
			<SideBar />
			<Chats />
			{/*<Friends />*/}
			{/*<Favorites />*/}
			<Conversation />
			<UserProfile />
		</div>
	)
}

export default Home