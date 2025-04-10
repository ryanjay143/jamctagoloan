import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';
import App from './App';

// Lazy loading components with a delay
const Dashboard = lazy(() => wait(3000).then(() => import("./views/user/Dashboard")));
const TrackAttendance = lazy(() => wait(3000).then(() => import("./views/user/TrackAttendance")));
const AttendanceHistory = lazy(() => wait(3000).then(() => import("./views/user/AttendanceHistory")));
const AddMember = lazy(() => wait(3000).then(() => import("./views/user/AddMember")));

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
        ],
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