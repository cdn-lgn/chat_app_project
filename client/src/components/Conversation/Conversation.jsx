import React from 'react'
import { FaDotCircle } from 'react-icons/fa';
import { darkGrey, lightGrey } from '../uiVariables/colors';
import { MdPermMedia } from 'react-icons/md';
import { BiSend } from 'react-icons/bi';

const ChatArea = () => {
	return (
		<div className="w-[45%] h-dvh flex items-center justify-between flex-col overflow-x-hidden" style={{background:darkGrey}}>
			<div className="flex items-center justify-between px-4 py-1 gap-4 w-full" style={{background:lightGrey}}>
				<img src="" alt="" className="bg-green-400 h-12 w-12 rounded-full cursor-pointer"/>
				<div className="flex items-center justify-between w-full">
					<div className="flex flex-col items-center justify-center">
						<h1 className="font-semibold">User Name</h1>
						<h4>user Satatus</h4>
					</div>
					<div>
						<FaDotCircle />
					</div>
				</div>
			</div>
			<div className=".custom-scrollbar h-full">
				

			</div>


			<div className="w-full mb-2">
                <div className="w-full h-12 flex items-center justify-center">
                    <div className="w-full h-10 my-2 mx-1 flex items-center justify-center gap-2 md:gap-6">
                    <input name="message" autoComplete="off" className="h-full w-full outline-none rounded rounded-2xl p-4 text-xl" style={{background:lightGrey}}/>
                    <input className="w-full hidden" id="fileSender" type="file" />
                    <label className="cursor-pointer text-2xl" htmlFor="fileSender">
                        <MdPermMedia />
                    </label>
                    <button className="cursor-pointer -rotate-45 text-2xl p-1 rounded-full">
                        <BiSend />
                    </button>
                </div>
            </div>
        </div>
	</div>
	)
}

export default ChatArea