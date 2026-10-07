import { Link } from "react-router";
// import health from "../../../assets/healthy.png"
import health from "../../assets/healthy.png"
const NavbarStart = ({navLinks}) => {
    return (
        <div className="flex gap-3 ">
            <div className="navbar-start block md:hidden">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content  bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navLinks}
                    </ul>
                </div>
            </div>
            <Link to="/" className="navbar-start w-auto flex ">
                <img className="h-10 py-1" src={health} alt="" />
                <h2 className="text-xl font-bold uppercase"><i><u>z</u></i>fest</h2>
            </Link>
        </div>
    );
};

export default NavbarStart;