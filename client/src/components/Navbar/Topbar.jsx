import React, { lazy, startTransition, useState } from 'react'
import { FaPlus, FaSearch, FaUserPlus } from 'react-icons/fa';
import { MdGroupAdd } from 'react-icons/md';
import { lightGrey } from '../uiVariables/colors';
import Search from '../Search/Search'

const NewFriendSearch = lazy(()=>import("../Search/NewFriendSearch"))

const Topbar = () => {
	const [searchForUser, setSearchForUser] = useState(false)
	const [newGroup, setNewGroup] = useState(false)

	const searchUser =()=>{
		startTransition(()=>{
			setSearchForUser(prev=>!prev)
		})
	}
	const newGroupAdd =()=>{
		startTransition(()=>{
			setNewGroup(prev=>!prev)
		})
	}

	return (
		<div className="w-full flex items-center flex-col gap-2 mb-4">
			<div className="w-full flex items-center justify-end gap-4">
				<FaUserPlus className="cursor-pointer text-xl" onClick={()=>searchUser()}/>
				<MdGroupAdd className="cursor-pointer text-xl" onClick={()=>newGroupAdd()}/>
			</div>
			<div className="w-full relative">
				<Search />
			</div>

			{searchForUser && <NewFriendSearch />}
		</div>
	)
}

export default Topbar