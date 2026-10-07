import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import { ToastContainer } from 'react-toastify';

const RootLayout = () => {
    return (
        <div className=''>
            <title>CO_2_BD</title>
            <ToastContainer />
            <div className="space-y-10 ">
                    <Navbar/>
                <div className="px-2 md:w-11/12 mx-auto pt-16">
                    <Outlet />
                </div>
                {/* <Footer /> */}
            </div>
        </div>
    );
};

export default RootLayout;