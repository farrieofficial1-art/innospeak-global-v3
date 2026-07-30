import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

// Eagerly load the homepage (critical path); code-split everything else.
import Home from '../pages/Home';

// Code-split secondary routes so the initial bundle stays lean.
const Academy = lazy(() => import('../pages/Academy'));
const About = lazy(() => import('../pages/About'));
const Programs = lazy(() => import('../pages/Programs'));
const Founder = lazy(() => import('../pages/Founder'));
const Impact = lazy(() => import('../pages/Impact'));
const Contact = lazy(() => import('../pages/Contact'));
const Apply = lazy(() => import('../pages/Apply'));
const CourseDetails = lazy(() => import('../pages/CourseDetails'));
const Research = lazy(() => import('../pages/Research'));
const News = lazy(() => import('../pages/News'));
const Events = lazy(() => import('../pages/Events'));
const Community = lazy(() => import('../pages/Community'));
const Partnerships = lazy(() => import('../pages/Partnerships'));
const Careers = lazy(() => import('../pages/Careers'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const NotFound = lazy(() => import('../pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'academy', element: <Academy /> },
      { path: 'about', element: <About /> },
      { path: 'programs', element: <Programs /> },
      { path: 'founder', element: <Founder /> },
      { path: 'impact', element: <Impact /> },
      { path: 'contact', element: <Contact /> },
      { path: 'apply', element: <Apply /> },
      { path: 'courses/:courseCode', element: <CourseDetails /> },
      { path: 'research', element: <Research /> },
      { path: 'news', element: <News /> },
      { path: 'events', element: <Events /> },
      { path: 'community', element: <Community /> },
      { path: 'partnerships', element: <Partnerships /> },
      { path: 'careers', element: <Careers /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
