// import Notifications from '../Notifications/Notifications'
import "./SideBar.css";
import React, { lazy, startTransition, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { BsChatSquareFill, BsChatSquareHeartFill } from "react-icons/bs";
import { FaFonticonsFi, FaUser, FaUserFriends } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { darkBlue, darkGrey, lightBlue } from "../uiVariables/colors.jsx";
import { IoNotifications } from "react-icons/io5";

const Notifications = lazy(() => import("../Notifications/Notifications"));

const SideBar = () => {
	const [iconSelected, setIconSelected] = useState("");
	const [notificatioTrue, setNotificationTrue] = useState(false);

	const optionSelected = (option) => {
		setIconSelected(option);
		if (option === "notifications") {
			startTransition(() => {
				setNotificationTrue((prev) => !prev);
			});
		} else {
			setNotificationTrue(false);
		}
	};

	return (
		<div
			className="h-dvh min-h-fit w-fit hidden md:block rounded-tl-lg rounded-bl-lg"
			style={{ background: lightBlue, color: darkBlue }}
		>
			<div className="relative z-0 h-dvh py-4 lg:pl-2 md:pl-1 flex justify-between items-center flex-col">
				<div
					className={`icon-div w-fit py-1 px-1 rounded-full ${iconSelected == "notifications" && "text-white"}`}
					style={{
						background: iconSelected == "notifications" && darkGrey,
					}}
				>
					<IoNotifications
						className="text-2xl"
						onClick={() => optionSelected("notifications")}
					/>
				</div>

				{notificatioTrue && <Notifications />}

				<div className="flex items-center justify-center flex-col gap-2">
					<div
						className={`icon-div icon-div2 ${iconSelected == "chats" && "text-white"}`}
						style={{
							background: iconSelected == "chats" && darkGrey,
						}}
						onClick={() => optionSelected("chats")}
					>
						<BsChatSquareFill className="text-xl" />
						<h1 className="text-[10px] font-bold">Chats</h1>
					</div>
					<div
						className={`icon-div icon-div2 ${iconSelected == "friends" && "text-white"}`}
						style={{
							background: iconSelected == "friends" && darkGrey,
						}}
						onClick={() => optionSelected("friends")}
					>
						<FaUserFriends className="text-xl" />
						<h1 className="text-[10px] font-bold">Friends</h1>
					</div>
					<div
						className={`icon-div icon-div2 ${iconSelected == "favorites" && "text-white"}`}
						style={{
							background: iconSelected == "favorites" && darkGrey,
						}}
						onClick={() => optionSelected("favorites")}
					>
						<BsChatSquareHeartFill className="text-xl" />
						<h1 className="text-[10px] font-bold">Favorites</h1>
					</div>
					<div
						className="w-3/5 h-[2px] rounded-2xl"
						style={{ background: darkBlue }}
					></div>
					<div
						className={`icon-div icon-div2 ${iconSelected == "user" && "text-white"}`}
						style={{
							background: iconSelected == "user" && darkGrey,
						}}
						onClick={() => optionSelected("user")}
					>
						<FaUser className="text-xl" />
						<h1 className="text-[10px] font-bold">user</h1>
					</div>
					<div
						className={`icon-div w-full py-1 px-[6px] rounded-l-xl ${iconSelected == "settings" && "text-white"}`}
						style={{
							background: iconSelected == "settings" && darkGrey,
						}}
						onClick={() => optionSelected("settings")}
					>
						<MdOutlineSettingsSuggest className="text-2xl" />
						<h1 className="text-[10px] font-bold">Settings</h1>
					</div>
				</div>

				<div className="flex items-center justify-center flex-col gap-4">
					<div
						className={`icon-div py-1 px-1`}
						onClick={() => optionSelected("logout")}
					>
						<BiLogOut className="text-2xl" />
						<h1 className="text-[10px] font-bold">Log out</h1>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
