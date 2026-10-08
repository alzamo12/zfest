import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import NavbarEnd from "./End";
import NavbarStart from './NavbarStart';
import useAuth from "../../hooks/useAuth"
import NavLoginBtn from './NavLoginBtn';
import { useQuery } from '@tanstack/react-query';
// import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosPublic from "../../hooks/useAxiosPublic";
// import useUserRole from '../../../hooks/useUserRole';
const Navbar = () => {

    const { user, logOut } = useAuth();
    const axiosPublic = useAxiosPublic();
    // const userRole = useUserRole();
    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : "light");
    const [page, setPage] = useState(1);
    const limit = 10;


    // notification get api
    const { data: notificationCount } = useQuery({
        queryKey: ['notificationCount', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/notification/unread-count/${user?.email}`);
            // console.log(res.data)
            return res.data.result;
        },
        enabled: !!user
    });

    const { data: notifications, isPending: notificationLoading } = useQuery({
        queryKey: ['notification', user?.email, page, limit],
        queryFn: async () => {
            const res = await axiosPublic.get(`/notifications/${user?.email}?page=${page}&limit=${limit}`);
            // console.log("your notifications", res.data)
            return res.data
        },
        enabled: !!user
    })

    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme("dark")
        }
        else {
            setTheme("light")
        }
    }

    useEffect(() => {
        localStorage.setItem("theme", theme)
        const localTheme = localStorage.getItem("theme")
        document.querySelector("html").setAttribute("data-theme", localTheme)
    }, [theme])

    const navLinks = <>
        <li><Link to="/user-dashboard">User Dashboard</Link></li>
        <li><Link to="create-fest">Create Fest</Link></li>
        <li><Link to="manage-events">Manage Events</Link></li>
        <li><Link to="joined-events">Joined Events</Link></li>
    </>;

    const publicNavLinks = <>
        <li><Link to="/upcoming-fests" className=''>Upcoming Fests</Link></li>
        <li><Link to="/events" className=''>Events</Link></li>
        <li><Link to="/about-us" className=''>About Us</Link></li>
        <li><Link to="/faq" className=''>FAQ</Link></li></>

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => {
                console.log(error)
            })
    };

    // fetch notification count api
    const totalPages = Math.ceil(Number(notifications?.notificationsCount) / limit);


    return (
        <div className="navbar shadow-sm justify-between
         dark:border-white dark:border-b-2  bg-green-100 dark:bg-accent
         fixed  z-50 md:px-[4.16666666667%] top-0
         ">
            <NavbarStart navLinks={publicNavLinks} />
            <div className="text-sm cursor-pointer lg:flex hidden md:block">
                <ul className='flex gap-4 '>
                    {publicNavLinks}
                </ul>
            </div>
            <div>
                {
                    user ?
                        <NavbarEnd
                            page={page}
                            setPage={setPage}
                            notificationCount={notificationCount}
                            handleToggle={handleToggle}
                            handleLogOut={handleLogOut}
                            user={user}
                            navLinks={navLinks}
                            notifications={notifications}
                            totalPages={totalPages}
                            notificationLoading={notificationLoading}
                        />
                        :

                        <div className='flex gap-2'>
                            <NavLoginBtn />
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
                        </div>
                }

            </div>
        </div>
    );
};

export default Navbar;