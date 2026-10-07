import { Link } from 'react-router';

const NavLoginBtn = () => {
    return (
        <Link className='navbar-end w-20' to="/login">
            <button className='btn btn-primary w-full  text-white border-none'>Login</button>
        </Link>
    );
};

export default NavLoginBtn;