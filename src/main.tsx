import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';
import App from './App';
import AttendanceReport from './views/user/Admin/AttendanceReport';
import AttendanceHistory from './views/user/Admin/AttendanceHistory';

// Lazy loading components with a delay
const Dashboard = lazy(() => wait(3000).then(() => import("./views/user/Dashboard")));
const TrackAttendance = lazy(() => wait(3000).then(() => import("./views/user/TrackAttendance")));
const AddMember = lazy(() => wait(3000).then(() => import("./views/user/AddMember/AddMemberContainer")));
const TithesContainer = lazy(() => wait(3000).then(() => import("./views/tithes/TithesContainer")));
// Route configuration
const routes = [
  {
    path: "/jamc/tagoloan",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="/jamc/tagoloan/user-dashboard" />,
      },
      {
        path: "user-dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loader />}>
                <TrackAttendance />
              </Suspense>
            ),
          },
          {
            path: "history",
            element: (
              <Suspense fallback={<Loader />}>
                <AttendanceHistory />
              </Suspense>
            ),
          },
          {
            path: "add-member",
            element: (
              <Suspense fallback={<Loader />}>
                <AddMember />
              </Suspense>
            ),
          },
          {
            path: "reports",
            element: (
              <Suspense fallback={<Loader />}>
                <AttendanceReport />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "tithes-offering",
        element: (
          <Suspense fallback={<Loader />}>
            <TithesContainer />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];


const router = createBrowserRouter(routes);

// Utility function to simulate a delay
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);