import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';
import App from './App';


// Lazy loading components with a delay
const Dashboard = lazy(() => wait(3000).then(() => import("./views/user/Attendance")));
const TrackAttendance = lazy(() => wait(3000).then(() => import("./views/user/CheckAttendance")));
const AttendanceHistory = lazy(() => wait(3000).then(() => import("./views/user/AttendanceRecord")));
const AddMember = lazy(() => wait(3000).then(() => import("./views/user/AddMember")));
const TithesContainer = lazy(() => wait(3000).then(() => import("./views/tithes/TithesContainer")));
const TithesGiving = lazy(() => wait(3000).then(() => import("./views/tithes/TithesGiving")));
const TithesHistory = lazy(() => wait(3000).then(() => import("./views/tithes/TithesHistory")));
const TithesReport = lazy(() => wait(3000).then(() => import("./views/tithes/TithesReport")));
const TithesPerMemberSummary = lazy(() => wait(3000).then(() => import("./views/tithes/TithesPerMemberSummary")));
const AttendanceReport = lazy(() => wait(3000).then(() => import("./views/user/AttendanceReport")));

// Route configuration
const routes = [

  {
    path: "/jamc/tagoloan",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="/jamc/tagoloan/attendance" />,
      },
      {
        path: "tithes-offering",
        element: (
          <Suspense fallback={<Loader />}>
            <TithesContainer />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loader />}>
                <TithesGiving />
              </Suspense>
            ),
          },
          {
            path: "history",
            element: (
              <Suspense fallback={<Loader />}>
                <TithesHistory />
              </Suspense>
            ),
          },
          {
            path: "report",
            element: (
              <Suspense fallback={<Loader />}>
                <TithesReport />
              </Suspense>
            ),
          },
          {
            path: "per-member-summary",
            element: (
              <Suspense fallback={<Loader />}>
                <TithesPerMemberSummary />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "attendance",
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // {
  //   path: "/jamc/tagoloan/tithes-offering",
  //   element: (
  //     <Suspense fallback={<Loader />}>
  //       <TithesContainer />
  //     </Suspense>
  //   ),
  //   children: [
  //     {
  //       path: "",
  //       element: <Navigate to="/jamc/tagoloan/tithes-offering" />,
  //     },
  //   ],
  // },
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