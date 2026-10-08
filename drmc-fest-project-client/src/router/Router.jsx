import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Login from "../pages/Login/Login";
import CreateFest from "../pages/CreateFest/CreateFest";
import Fests from "../pages/fests/Fests";
import FestDetails from "../pages/FestDetails/FestDetails";
import Events from "../pages/Events/Events";
import EventDetails from "../pages/EventDetails/EventDetails";
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
                path: "upcoming-fests",
                Component: Fests
            },
            {
                path: "fests/:id",
                Component: FestDetails
            },
            {
                path: "events",
                Component: Events
            },
            {
                path: "events/:id",
                Component: EventDetails
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    }
]);

export default router;