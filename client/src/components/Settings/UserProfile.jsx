import React, { useCallback, useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { TbLogout } from 'react-icons/tb';
import { MdDeleteForever } from 'react-icons/md';
import { CgDarkMode } from 'react-icons/cg';
import { darkGrey, lightGrey } from '../uiVariables/colors';

const UserProfile = () => {
  const [imageFullView, setImageFullView] = useState(false)
  const [profileEdit, setProfileEdit] = useState(false)
  const [updateDetails,setUpdateDetails] = useState({
    name:'displayName',
    about:'',
    gender:'',
    photo:null,
  })

  // Function to handle file input changes
  const handleFileChange = useCallback((e) => {
    setUpdateDetails(prevState => ({
      ...prevState,
      photo: e.target.files[0]
    }));
    console.log(updateDetails)
  }, []);

  return (
    <div className="w-[30%] h-screen rounded-r-lg" style={{background:darkGrey}}>
      <div className="h-14 p-2 flex items-center"  style={{background:lightGrey}}>
        <FaChevronLeft className="p-1 text-3xl cursor-pointer hover:opacity-60 transition-all duration-300 rounded-full"  style={{background:darkGrey}}/>
      </div>
      
    {!profileEdit && (
      <div className="">
          <div className="md:px-4 py-5 md:justify-start flex items-center justify-center">
            <img className="relative h-28 w-28 object-cover cursor-pointer rounded-full transition-all duration-300"/>
        </div>

          <div className="px-4 py-5 sm:p-0">
              <dl>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                          Name
                      </dt>
                      <dd className="mt-1 text-xl sm:mt-0 sm:col-span-2">
                          displayName
                      </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                          Gender
                      </dt>
                      <dd className="mt-1 text-xl sm:mt-0 sm:col-span-2">
                          gender
                      </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                          About
                      </dt>
                      <dd className="mt-1 text-xl sm:mt-0 sm:col-span-2">
                          about
                      </dd>
                  </div>
              </dl>
          </div>

          <div className="text-center m-3 flex items-center justify-center">
            <button type="button" className="flex items-center justify-center gap-1 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center me-2 mb-2" onClick={()=>setProfileEdit(true)}>edit <FiEdit2 /></button>
          </div>
      </div>


   	)}

      {/*Open Image in Full screen view*/}
      {imageFullView && (
        <div className="absolute h-full w-full bg-black bg-opacity-40"  onClick={()=>setImageFullView(false)}>
          <div>
            <img className="md:aspect-auto aspect-square w-screen object-cover h-auto md:h-screen md:w-auto bg-red-600" src="" alt=""/>
          </div>
        </div>
      )}

      {/*function to edit user's profile*/}
      {profileEdit && (
        <main className="rounded-lg">
              <div className="p-4">
                  <div className="w-full px-2 pb-8 sm:max-w-xl sm:rounded-lg">

                      <div className="grid max-w-2xl mx-auto">
                          <div className="flex flex-col items-center sm:flex-row sm:space-y-0">

                              <img className="h-28 w-28 object-cover rounded-full transition-all duration-300"
                                  src=""
                                  alt="Bordered avatar"/>

                              <div className="flex flex-col sm:ml-8 gap-4">
                                <input
                            id="changePhoto"
                            required
                            type="file"
                            accept="image/*" // Restrict to only image files
                            className="hidden block border border-grey-light w-full p-3 rounded mb-4"
                            onInput={handleFileChange}
                          />
                                  <label htmlFor="changePhoto" style={{background:lightGrey}}
                                      className="cursor-pointer py-2 px-2 text-base font-medium rounded-lg hover:bg-indigo-900">
                                      Change picture
                                  </label>
                              </div>
                          </div>

                          <div className="items-center mt-8 sm:mt-14">
                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium">Your name</label>
                            <input
                                type="text"
                                id="name"
                                className="bg-transparent outline-none text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                style={{background:lightGrey}}
                                placeholder="Your first name"
                                value={updateDetails.name}
                                onChange={(e) => setUpdateDetails({ ...updateDetails, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                        <label className="block mb-2 text-sm font-medium">Gender</label>
                        <div className="w-full pt-6 flex items-center justify-center gap-5">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={updateDetails.gender === 'male'}
                                    onChange={(e) => setUpdateDetails({ ...updateDetails, gender: e.target.value })}
                                />
                                Male
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={updateDetails.gender === 'female'}
                                    onChange={(e) => setUpdateDetails({ ...updateDetails, gender: e.target.value })}
                                />
                                Female
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={updateDetails.gender === 'other'}
                                    onChange={(e) => setUpdateDetails({ ...updateDetails, gender: e.target.value })}
                                />
                                Other
                            </label>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium" >About</label>
                        <textarea
                            id="message"
                            rows="5"
                            className="bg-transparent block p-2.5 w-full text-sm outline-none rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            style={{background:lightGrey}}
                            placeholder="Write your bio here..."
                            value={updateDetails.about}
                            onChange={(e) => setUpdateDetails({ ...updateDetails, about: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-1 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center me-2 mb-2" onClick={()=>setProfileEdit(false)}>
                            Save
                        </button>
                    </div>
                </div>

                      </div>
                  </div>
              </div>
          </main>
      )}             
    
    </div>
  )
}

export default UserProfile