import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectAuthToken, logout, setToken, selectUser } from '../features/auth/authSlice';
import { lazy, Suspense } from 'react';
import { Spinner } from 'flowbite-react';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const IssuesList = lazy(() => import('../features/issues/pages/IssuesListPage'));
const SidebarLayout = lazy(() => import('../layouts/DashboardLayout'));

export default function AppRoutes() {
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) dispatch(setToken(savedToken));
  }, [dispatch]);

  const handleLogout = () => {
    Swal.fire('"You are logging out!"').then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        localStorage.removeItem('token');
      }
    });
  };

  return (
    <Router>
      <Suspense fallback={<Spinner aria-label="Loading Routes..." size="xl" />}>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/issues" replace /> : <Navigate to="/login" replace />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/issues"
            element={
              token ? (
                <SidebarLayout name={user.name} email={user.email} onLogout={handleLogout}>
                  <IssuesList />
                </SidebarLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to={token ? '/issues' : '/login'} replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// // src/routes/AppRoutes.tsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { selectAuthToken, logout, setToken, selectUser } from "../features/auth/authSlice";
// import IssuesList from "../features/issues/pages/IssuesListPage";
// import Login from "../pages/Login";
// import SidebarLayout from "../layouts/DashboardLayout";
// import Register from "../pages/Register";

// export default function AppRoutes() {
//     const token = useSelector(selectAuthToken);
//     const user = useSelector(selectUser);
//     const dispatch = useDispatch();

//     // ✅ Ensure persisted token is restored on page reload
//     useEffect(() => {
//         const savedToken = localStorage.getItem("token");
//         if (savedToken) {
//             dispatch(setToken(savedToken));
//         }
//     }, [dispatch]);

//     const handleLogout = () => {
//         dispatch(logout());
//         localStorage.removeItem("token");
//     };

//     return (
//         <Router>
//             <Routes>
//                 <Route
//                     path="/"
//                     element={
//                         token ? <Navigate to="/issues" replace /> : <Navigate to="/login" replace />
//                     }
//                 />

//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />

//                 <Route
//                     path="/issues"
//                     element={
//                         token ? (
//                             <SidebarLayout name={user.name} email={user.email} onLogout={handleLogout}>
//                                 <IssuesList />
//                             </SidebarLayout>
//                         ) : (
//                             <Navigate to="/login" replace />
//                         )
//                     }
//                 />

//                 <Route
//                     path="*"
//                     element={<Navigate to={token ? "/issues" : "/login"} replace />}
//                 />
//             </Routes>
//         </Router>
//     );
// }
