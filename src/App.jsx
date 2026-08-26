import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Academy from './pages/Academy.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Foundation from './pages/Foundation.jsx';
import Labs from './pages/Labs.jsx';
import Founder from './pages/Founder.jsx';
import Impact from './pages/Impact.jsx';
import Contact from './pages/Contact.jsx';
import Apply from './pages/Apply.jsx';
import Research from './pages/Research.jsx';
import Tutor from './pages/Tutor.jsx';
import News from './pages/News.jsx';
import Events from './pages/Events.jsx';
import Community from './pages/Community.jsx';
import Partnerships from './pages/Partnerships.jsx';
import Careers from './pages/Careers.jsx';
import FAQ from './pages/FAQ.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import StudentDashboard from './pages/portal/StudentDashboard.jsx';
import PortalShell from './components/portal/PortalShell.jsx';
import Profile from './pages/portal/Profile.jsx';
import Registration from './pages/portal/Registration.jsx';
import Records from './pages/portal/Records.jsx';
import Finance from './pages/portal/Finance.jsx';
import Timetable from './pages/portal/Timetable.jsx';
import Attendance from './pages/portal/Attendance.jsx';
import Exams from './pages/portal/Exams.jsx';
import Documents from './pages/portal/Documents.jsx';
import Communication from './pages/portal/Communication.jsx';
import Requests from './pages/portal/Requests.jsx';
import Support from './pages/portal/Support.jsx';
import Graduation from './pages/portal/Graduation.jsx';
import ChangePassword from './pages/portal/ChangePassword.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/courses/:courseCode" element={<CourseDetails />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/research" element={<Research />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Student portal (requires login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<PortalShell />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="registration" element={<Registration />} />
              <Route path="records" element={<Records />} />
              <Route path="finance" element={<Finance />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="exams" element={<Exams />} />
              <Route path="documents" element={<Documents />} />
              <Route path="communication" element={<Communication />} />
              <Route path="requests" element={<Requests />} />
              <Route path="support" element={<Support />} />
              <Route path="graduation" element={<Graduation />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}