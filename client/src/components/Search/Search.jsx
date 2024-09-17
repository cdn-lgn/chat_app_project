import React from 'react'
import { FaSearch } from 'react-icons/fa';
import { lightGrey } from '../uiVariables/colors';

const Search = () => {
	return (
		<>
			<FaSearch className="absolute top-1 text-sm right-2"/>
			<input name="searchChat" className="w-full outline-none rounded rounded-2xl p-1 px-4 text-sm" style={{background:lightGrey}}/>	
		</>
	)
}

export default Search