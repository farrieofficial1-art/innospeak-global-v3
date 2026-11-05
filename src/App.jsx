import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import RouteErrorBoundary from './components/ui/RouteErrorBoundary.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const Foundation = lazy(() => import('./pages/Foundation.jsx'));
const FoundationEvents = lazy(() => import('./pages/FoundationEvents.jsx'));
const Founder = lazy(() => import('./pages/Founder.jsx'));
const Impact = lazy(() => import('./pages/Impact.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Apply = lazy(() => import('./pages/Apply.jsx'));
const Research = lazy(() => import('./pages/Research.jsx'));
const Tutor = lazy(() => import('./pages/Tutor.jsx'));
const News = lazy(() => import('./pages/News.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Community = lazy(() => import('./pages/Community.jsx'));
const Partnerships = lazy(() => import('./pages/Partnerships.jsx'));
const Careers = lazy(() => import('./pages/Careers.jsx'));
const FAQ = lazy(() => import('./pages/FAQ.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Signup = lazy(() => import('./pages/auth/Signup.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Academy = lazy(() => import('./pages/Academy.jsx'));
const AcademyCbe = lazy(() => import('./pages/AcademyCbe.jsx'));
const AcademyCbeBundle = lazy(() => import('./pages/AcademyCbeBundle.jsx'));
const AcademyCourseDetail = lazy(() => import('./pages/AcademyCourseDetail.jsx'));
const Labs = lazy(() => import('./pages/Labs.jsx'));
const LabCourseDetail = lazy(() => import('./pages/LabCourseDetail.jsx'));
const MyLearning = lazy(() => import('./pages/MyLearning.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));
const StudentDashboard = lazy(() => import('./pages/portal/StudentDashboard.jsx'));
const PortalShell = lazy(() => import('./components/portal/PortalShell.jsx'));
const Profile = lazy(() => import('./pages/portal/Profile.jsx'));
const Registration = lazy(() => import('./pages/portal/Registration.jsx'));
const Records = lazy(() => import('./pages/portal/Records.jsx'));
const Finance = lazy(() => import('./pages/portal/Finance.jsx'));
const Timetable = lazy(() => import('./pages/portal/Timetable.jsx'));
const Attendance = lazy(() => import('./pages/portal/Attendance.jsx'));
const Exams = lazy(() => import('./pages/portal/Exams.jsx'));
const Documents = lazy(() => import('./pages/portal/Documents.jsx'));
const Communication = lazy(() => import('./pages/portal/Communication.jsx'));
const Requests = lazy(() => import('./pages/portal/Requests.jsx'));
const Support = lazy(() => import('./pages/portal/Support.jsx'));
const Graduation = lazy(() => import('./pages/portal/Graduation.jsx'));
const ChangePassword = lazy(() => import('./pages/portal/ChangePassword.jsx'));
const MyProgress = lazy(() => import('./pages/portal/MyProgress.jsx'));
const FoundationApplications = lazy(() => import('./pages/portal/FoundationApplications.jsx'));
const FoundationApplicationDetail = lazy(() => import('./pages/portal/FoundationApplicationDetail.jsx'));
const SponsorShell = lazy(() => import('./components/sponsor/SponsorShell.jsx'));
const SponsorSignIn = lazy(() => import('./pages/sponsor/SponsorSignIn.jsx'));
const SponsorDashboard = lazy(() => import('./pages/sponsor/SponsorDashboard.jsx'));
const SponsorPrograms = lazy(() => import('./pages/sponsor/SponsorPrograms.jsx'));
const SponsorContributions = lazy(() => import('./pages/sponsor/SponsorContributions.jsx'));
const SponsorImpact = lazy(() => import('./pages/sponsor/SponsorImpact.jsx'));
const AdminRoute = lazy(() => import('./components/auth/AdminRoute.jsx'));
const AdminShell = lazy(() => import('./components/admin/AdminShell.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminStudents = lazy(() => import('./pages/admin/Students.jsx'));
const AdminStudentDetail = lazy(() => import('./pages/admin/StudentDetail.jsx'));
const AdminApplications = lazy(() => import('./pages/admin/Applications.jsx'));
const AdminContactMessages = lazy(() => import('./pages/admin/ContactMessages.jsx'));
const AdminPrograms = lazy(() => import('./pages/admin/Programs.jsx'));
const AdminSemesters = lazy(() => import('./pages/admin/Semesters.jsx'));
const AdminUnits = lazy(() => import('./pages/admin/Units.jsx'));
const AdminTimetableExams = lazy(() => import('./pages/admin/TimetableExams.jsx'));
const AdminFeeStructures = lazy(() => import('./pages/admin/FeeStructures.jsx'));
const AdminRequests = lazy(() => import('./pages/admin/Requests.jsx'));
const AdminSupport = lazy(() => import('./pages/admin/Support.jsx'));
const AdminGraduation = lazy(() => import('./pages/admin/Graduation.jsx'));
const AdminAnnouncements = lazy(() => import('./pages/admin/Announcements.jsx'));
const AdminLmsOverview = lazy(() => import('./pages/admin/LmsOverview.jsx'));
const AdminCohorts = lazy(() => import('./pages/admin/Cohorts.jsx'));
const AdminCareerOpportunities = lazy(() => import('./pages/admin/CareerOpportunities.jsx'));
const CareerApplications = lazy(() => import('./pages/admin/CareerApplications.jsx'));
const InstructorRoute = lazy(() => import('./components/auth/InstructorRoute.jsx'));
const TeachShell = lazy(() => import('./components/teach/TeachShell.jsx'));
const TeachOverview = lazy(() => import('./pages/teach/TeachOverview.jsx'));
const TeachProfile = lazy(() => import('./pages/teach/TeachProfile.jsx'));
const MyCourses = lazy(() => import('./pages/teach/MyCourses.jsx'));
const CreateCourse = lazy(() => import('./pages/teach/CreateCourse.jsx'));
const TeachStudents = lazy(() => import('./pages/teach/TeachStudents.jsx'));
const LearningMaterials = lazy(() => import('./pages/teach/LearningMaterials.jsx'));
const Assignments = lazy(() => import('./pages/teach/Assignments.jsx'));
const Assessments = lazy(() => import('./pages/teach/Assessments.jsx'));
const TeachMessages = lazy(() => import('./pages/teach/TeachMessages.jsx'));
const TeachNotifications = lazy(() => import('./pages/teach/TeachNotifications.jsx'));
const TeachSettings = lazy(() => import('./pages/teach/TeachSettings.jsx'));
const CourseBuilder = lazy(() => import('./pages/teach/CourseBuilder.jsx'));
const LessonContentBuilder = lazy(() => import('./pages/teach/LessonContentBuilder.jsx'));
const Submissions = lazy(() => import('./pages/teach/Submissions.jsx'));
const SessionsManager = lazy(() => import('./pages/teach/SessionsManager.jsx'));
const Gradebook = lazy(() => import('./pages/teach/Gradebook.jsx'));
const LearnShell = lazy(() => import('./components/learn/LearnShell.jsx'));
const LearnDashboard = lazy(() => import('./pages/learn/LearnDashboard.jsx'));
const CareerProfile = lazy(() => import('./pages/learn/CareerProfile.jsx'));
const MyApplications = lazy(() => import('./pages/learn/MyApplications.jsx'));
const Sessions = lazy(() => import('./pages/learn/Sessions.jsx'));
const Calendar = lazy(() => import('./pages/learn/Calendar.jsx'));
const Portfolio = lazy(() => import('./pages/learn/Portfolio.jsx'));
const Goals = lazy(() => import('./pages/learn/Goals.jsx'));
const Projects = lazy(() => import('./pages/learn/Projects.jsx'));
const Mentorship = lazy(() => import('./pages/learn/Mentorship.jsx'));
const Certificates = lazy(() => import('./pages/learn/Certificates.jsx'));
const CertificateVerify = lazy(() => import('./pages/learn/CertificateVerify.jsx'));
const CareerHub = lazy(() => import('./pages/CareerHub.jsx'));
const Opportunities = lazy(() => import('./pages/career/Opportunities.jsx'));
const OpportunityDetail = lazy(() => import('./pages/career/OpportunityDetail.jsx'));
const Connections = lazy(() => import('./pages/career/Connections.jsx'));
const LearningPlayer = lazy(() => import('./pages/learn/LearningPlayer.jsx'));
const AssignmentView = lazy(() => import('./pages/learn/AssignmentView.jsx'));
const QuizAttempt = lazy(() => import('./pages/learn/QuizAttempt.jsx'));
const BecomeTutor = lazy(() => import('./pages/BecomeTutor.jsx'));
const AdminTutorApplications = lazy(() => import('./pages/admin/TutorApplications.jsx'));
const AdminCourseReview = lazy(() => import('./pages/admin/CourseReview.jsx'));
const AdminCertificates = lazy(() => import('./pages/admin/Certificates.jsx'));
const AdminPayments = lazy(() => import('./pages/admin/Payments.jsx'));
const AdminFoundationApplications = lazy(() => import('./pages/admin/FoundationApplications.jsx'));
const AdminFoundationApplicationDetail = lazy(() => import('./pages/admin/FoundationApplicationDetail.jsx'));
const AdminFoundationStories = lazy(() => import('./pages/admin/FoundationStories.jsx'));
const AdminFoundationInitiatives = lazy(() => import('./pages/admin/FoundationInitiatives.jsx'));
const AdminFoundationEvents = lazy(() => import('./pages/admin/FoundationEvents.jsx'));
const AdminFoundationEventEditor = lazy(() => import('./pages/admin/FoundationEventEditor.jsx'));
const AdminFoundationSponsors = lazy(() => import('./pages/admin/FoundationSponsors.jsx'));
const AdminFoundationContributions = lazy(() => import('./pages/admin/FoundationContributions.jsx'));
const AdminFoundationDisbursements = lazy(() => import('./pages/admin/FoundationDisbursements.jsx'));
const AdminFoundationProgressReports = lazy(() => import('./pages/admin/FoundationProgressReports.jsx'));
const ForEmployers = lazy(() => import('./pages/ForEmployers.jsx'));
const EmployerRoute = lazy(() => import('./components/auth/EmployerRoute.jsx'));
const EmployerShell = lazy(() => import('./components/employer/EmployerShell.jsx'));
const EmployerOverview = lazy(() => import('./pages/employer/EmployerOverview.jsx'));
const EmployerOpportunities = lazy(() => import('./pages/employer/EmployerOpportunities.jsx'));
const EmployerOpportunityEditor = lazy(() => import('./pages/employer/EmployerOpportunityEditor.jsx'));
const EmployerApplications = lazy(() => import('./pages/employer/EmployerApplications.jsx'));
const OrganisationProfile = lazy(() => import('./pages/employer/OrganisationProfile.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const PaymentReturn = lazy(() => import('./pages/PaymentReturn.jsx'));

export default function App() {
  return (
    <AuthProvider>
      <RouteErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* ALL COURSE ROUTES HAVE BEEN PURGED FOR REBUILD */}

          {/* Academy */}
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/cbe" element={<AcademyCbe />} />
          <Route path="/academy/cbe/:bundleSlug" element={<AcademyCbeBundle />} />
          <Route path="/academy/:slug" element={<AcademyCourseDetail />} />

          {/* Labs */}
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/:slug" element={<LabCourseDetail />} />

          <Route path="/my-learning" element={<MyLearning />} />

          <Route path="/foundation" element={<Foundation />} />
          <Route path="/foundation/events" element={<FoundationEvents />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/become-tutor" element={<BecomeTutor />} />
          <Route path="/research" element={<Research />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/career-hub" element={<CareerHub />} />
          <Route path="/career-hub/opportunities" element={<Opportunities />} />
          <Route path="/career-hub/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/career-hub/connections" element={<Connections />} />
          <Route path="/for-employers" element={<ForEmployers />} />
          <Route path="/verify-certificate" element={<CertificateVerify />} />
          <Route path="/verify-certificate/:certificateId" element={<CertificateVerify />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/payment-return" element={<PaymentReturn />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Sponsor Portal */}
          <Route path="/sponsor/signin" element={<SponsorSignIn />} />
          <Route path="/sponsor" element={<SponsorShell />}>
            <Route index element={<SponsorDashboard />} />
            <Route path="programs" element={<SponsorPrograms />} />
            <Route path="contributions" element={<SponsorContributions />} />
            <Route path="impact" element={<SponsorImpact />} />
          </Route>

          {/* Employer Portal */}
          <Route element={<EmployerRoute />}>
            <Route path="/employer" element={<EmployerShell />}>
              <Route index element={<EmployerOverview />} />
              <Route path="opportunities" element={<EmployerOpportunities />} />
              <Route path="opportunities/new" element={<EmployerOpportunityEditor />} />
              <Route path="opportunities/:id" element={<EmployerOpportunityEditor />} />
              <Route path="applications" element={<EmployerApplications />} />
              <Route path="profile" element={<OrganisationProfile />} />
            </Route>
          </Route>

          {/* Student portal (requires login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<PortalShell />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="registration" element={<Registration />} />
              <Route path="records" element={<Records />} />
              <Route path="foundation" element={<FoundationApplications />} />
              <Route path="foundation/:id" element={<FoundationApplicationDetail />} />
              <Route path="progress" element={<MyProgress />} />
              <Route path="progress/:courseId" element={<MyProgress />} />
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

          {/* Admin panel (requires admin role) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminShell />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="students/:id" element={<AdminStudentDetail />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="tutor-applications" element={<AdminTutorApplications />} />
              <Route path="course-review" element={<AdminCourseReview />} />
              <Route path="messages" element={<AdminContactMessages />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="semesters" element={<AdminSemesters />} />
              <Route path="units" element={<AdminUnits />} />
              <Route path="timetable-exams" element={<AdminTimetableExams />} />
              <Route path="fees" element={<AdminFeeStructures />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="graduation" element={<AdminGraduation />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="cohorts" element={<AdminCohorts />} />
              <Route path="career-opportunities" element={<AdminCareerOpportunities />} />
              <Route path="career-applications" element={<CareerApplications />} />
              <Route path="lms" element={<AdminLmsOverview />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="payments" element={<AdminPayments />} />

              {/* Foundation */}
              <Route path="foundation/applications" element={<AdminFoundationApplications />} />
              <Route path="foundation/applications/:id" element={<AdminFoundationApplicationDetail />} />
              <Route path="foundation/stories" element={<AdminFoundationStories />} />
              <Route path="foundation/initiatives" element={<AdminFoundationInitiatives />} />
              <Route path="foundation/events" element={<AdminFoundationEvents />} />
              <Route path="foundation/events/:id" element={<AdminFoundationEventEditor />} />
              <Route path="foundation/sponsors" element={<AdminFoundationSponsors />} />
              <Route path="foundation/contributions" element={<AdminFoundationContributions />} />
              <Route path="foundation/disbursements" element={<AdminFoundationDisbursements />} />
              <Route path="foundation/progress-reports" element={<AdminFoundationProgressReports />} />
            </Route>
          </Route>

          {/* LMS — student learning (any authenticated user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/learn" element={<LearnShell />}>
              <Route index element={<LearnDashboard />} />
              <Route path="career" element={<CareerProfile />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="goals" element={<Goals />} />
              <Route path="projects" element={<Projects />} />
              <Route path="mentorship" element={<Mentorship />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="courses/:courseId" element={<LearningPlayer />} />
              <Route path="courses/:courseId/lessons/:lessonId" element={<LearningPlayer />} />
              <Route path="assignments/:assignmentId" element={<AssignmentView />} />
              <Route path="quizzes/:quizId" element={<QuizAttempt />} />
            </Route>
          </Route>

          {/* LMS — instructor teaching tools */}
          <Route element={<InstructorRoute />}>
            <Route path="/teach" element={<TeachShell />}>
              <Route index element={<TeachOverview />} />
              <Route path="profile" element={<TeachProfile />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="students" element={<TeachStudents />} />
              <Route path="materials" element={<LearningMaterials />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="sessions" element={<SessionsManager />} />
              <Route path="messages" element={<TeachMessages />} />
              <Route path="notifications" element={<TeachNotifications />} />
              <Route path="settings" element={<TeachSettings />} />
              <Route path="courses/:courseId" element={<CourseBuilder />} />
              <Route path="lessons/:lessonId" element={<LessonContentBuilder />} />
              <Route path="courses/:courseId/submissions" element={<Submissions />} />
              <Route path="courses/:courseId/gradebook" element={<Gradebook />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </RouteErrorBoundary>
    </AuthProvider>
  );
}
