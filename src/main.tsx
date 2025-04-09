import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';
import App from './App';


// Lazy loaded components
const Dashboard = lazy(() =>
  wait(3000).then(() => import("./views/user/Dashboard"))
);



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
            <Dashboard/>
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

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);