import { useLocation, useNavigate } from 'react-router';

const usePrivateRouteNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || '/';
    const info = {navigate, from};

    return info
};

export default usePrivateRouteNavigation;