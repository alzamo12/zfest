import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
// import NotificationModal from "./NotificationModal";
import NotificationModal from "../notification/NotificationModal";

const NavbarEnd = ({ notificationLoading, navLinks, user, handleLogOut, handleToggle, notificationCount, setPage, page, notifications, totalPages }) => {
    const axiosPublic = useAxiosPublic();
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutateAsync: notificationUpdateAsync } = useMutation({
        mutationFn: async () => {
            const res = await axiosPublic.patch(`/notifications/${user?.email}`);
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['notification', 'notificationCount'])
            console.log(data)
            // toast.success
        }
    });

    const handleOpen = () => {
        setIsOpen(true)
        notificationUpdateAsync()
    }

    return (
        <div className="navbar-end  w-auto gap-2 md:gap-4">
            {/* logout button */}
            <button onClick={handleLogOut} className="btn btn-primary md:w-auto px-2 md:px-4 text-xs md:text-sm  text-white">Logout</button>
            {/* pfp  */}
            <div className="dropdown group dropdown-end">
                {/* pfp avatar */}
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS Navbar component"
                            src={user.photoURL} />
                    </div>
                </div>
                <h2 className="font-bold text-base w-20 group-hover:block hidden absolute top-10 bg-black opacity-50  px-2 py-1 text-white rounded-lg">{user.displayName}</h2>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li className="text-lg font-bold">{user.displayName || "ponkuz Kumar"}</li>
                    {navLinks}
                </ul>
            </div>
            <label className="swap swap-rotate">
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" onChange={handleToggle} />

                {/* sun icon */}
                <svg
                    className="swap-on h-10 w-10 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
                {/* moon icon */}
                < svg
                    className="swap-off h-10 w-10 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
            </label>
            <button onClick={() => handleOpen()} className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                    <span className="badge badge-sm rounded-full badge-neutral indicator-item">{notificationCount}</span>
                </div>
            </button>

            {/* modal */}
            {
                isOpen &&
                <NotificationModal
                    notificationLoading={notificationLoading}
                    notifications={notifications}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    setIsOpen={setIsOpen}
                />
            }
        </div>
    );
};

export default NavbarEnd;