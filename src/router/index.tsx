/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter } from "react-router";
import { ROUTES } from "../lib/consts.ts";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.tsx";
import Login from "../pages/login/Login.tsx";
import Pending from "../pages/dashboard/Pending.tsx";
// import Offers from "../pages/dashboard/Approve.tsx";
import PrivateRoute from "../helpers/PrivateRoute.tsx";
import WinnerDeclaration from "../pages/dashboard/WinnerDeclaration.tsx";
import Wiiner_List from "../pages/dashboard/Wiiner_List.tsx";
import GLogin from "../pages/google-login/GLogin.tsx";
// import Rejected from "../pages/dashboard/Rejected.tsx";

export const router = createBrowserRouter(
  [
    {
      path: ROUTES.HOME_PAGE,
      element: <GLogin />,
    },
    {
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          path: ROUTES.PENDING,
          element: <Pending />,
        },
        {
          index: true,
          path: ROUTES.WINNER_DECLARATION,
          element: <WinnerDeclaration />,
        },
        {
          path: ROUTES.WINNER_LIST,
          element: <Wiiner_List />,
        },
        // {
        //   path: ROUTES.REJECTED,
        //   element: <Rejected />,
        // },
      ],
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_URL,
  }
);
export default router;
