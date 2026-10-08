import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Login from "../pages/Login/Login";
import CreateFest from "../pages/CreateFest/CreateFest";
import Fests from "../pages/fests/Fests";
import FestDetails from "../pages/FestDetails/FestDetails";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <div>home</div>
            },
            {
                path: "create-fest",
                element: <CreateFest />
            },
            {
                path: "fests",
                Component: Fests
            },
            {
                path: "/fests/:id",
                Component: FestDetails
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    }
]);

export default router;