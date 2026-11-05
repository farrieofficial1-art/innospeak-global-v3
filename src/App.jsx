import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import PortalShell from './components/portal/PortalShell.jsx';
import SponsorShell from './components/sponsor/SponsorShell.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import AdminShell from './components/admin/AdminShell.jsx';
import InstructorRoute from './components/auth/InstructorRoute.jsx';
import TeachShell from './components/teach/TeachShell.jsx';
import LearnShell from './components/learn/LearnShell.jsx';
import EmployerRoute from './components/auth/EmployerRoute.jsx';
import EmployerShell from './components/employer/EmployerShell.jsx';
import RouteErrorBoundary from './components/ui/RouteErrorBoundary.jsx';

const pageModules = import.meta.glob('./pages/**/*.jsx');

function lazyPage(modulePath) {
  const loadPage = pageModules[modulePath];
  if (!loadPage) throw new Error(`Unknown route page module: ${modulePath}`);
  return lazy(loadPage);
}

function RouteLoading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-cream" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-gold-500 motion-reduce:animate-none" />
    </main>
  );
}

const Home = lazyPage('./pages/Home.jsx');
const About = lazyPage('./pages/About.jsx');
const Programs = lazyPage('./pages/Programs.jsx');
const Foundation = lazyPage('./pages/Foundation.jsx');
const FoundationEvents = lazyPage('./pages/FoundationEvents.jsx');
const Founder = lazyPage('./pages/Founder.jsx');
const Impact = lazyPage('./pages/Impact.jsx');
const Contact = lazyPage('./pages/Contact.jsx');
const Apply = lazyPage('./pages/Apply.jsx');
const Research = lazyPage('./pages/Research.jsx');
const Tutor = lazyPage('./pages/Tutor.jsx');
const News = lazyPage('./pages/News.jsx');
const Events = lazyPage('./pages/Events.jsx');
const Community = lazyPage('./pages/Community.jsx');
const Partnerships = lazyPage('./pages/Partnerships.jsx');
const Careers = lazyPage('./pages/Careers.jsx');
const FAQ = lazyPage('./pages/FAQ.jsx');
const Privacy = lazyPage('./pages/Privacy.jsx');
const Terms = lazyPage('./pages/Terms.jsx');
const Login = lazyPage('./pages/auth/Login.jsx');
const Signup = lazyPage('./pages/auth/Signup.jsx');
const Register = lazyPage('./pages/Register.jsx');
const Academy = lazyPage('./pages/Academy.jsx');
const AcademyCbe = lazyPage('./pages/AcademyCbe.jsx');
const AcademyCbeBundle = lazyPage('./pages/AcademyCbeBundle.jsx');
const AcademyCourseDetail = lazyPage('./pages/AcademyCourseDetail.jsx');
const Labs = lazyPage('./pages/Labs.jsx');
const LabCourseDetail = lazyPage('./pages/LabCourseDetail.jsx');
const MyLearning = lazyPage('./pages/MyLearning.jsx');
const ForgotPassword = lazyPage('./pages/auth/ForgotPassword.jsx');
const ResetPassword = lazyPage('./pages/auth/ResetPassword.jsx');
const StudentDashboard = lazyPage('./pages/portal/StudentDashboard.jsx');
const Profile = lazyPage('./pages/portal/Profile.jsx');
const Registration = lazyPage('./pages/portal/Registration.jsx');
const Records = lazyPage('./pages/portal/Records.jsx');
const Finance = lazyPage('./pages/portal/Finance.jsx');
const Timetable = lazyPage('./pages/portal/Timetable.jsx');
const Attendance = lazyPage('./pages/portal/Attendance.jsx');
const Exams = lazyPage('./pages/portal/Exams.jsx');
const Documents = lazyPage('./pages/portal/Documents.jsx');
const Communication = lazyPage('./pages/portal/Communication.jsx');
const Requests = lazyPage('./pages/portal/Requests.jsx');
const Support = lazyPage('./pages/portal/Support.jsx');
const Graduation = lazyPage('./pages/portal/Graduation.jsx');
const ChangePassword = lazyPage('./pages/portal/ChangePassword.jsx');
const MyProgress = lazyPage('./pages/portal/MyProgress.jsx');
const FoundationApplications = lazyPage('./pages/portal/FoundationApplications.jsx');
const FoundationApplicationDetail = lazyPage('./pages/portal/FoundationApplicationDetail.jsx');
const SponsorSignIn = lazyPage('./pages/sponsor/SponsorSignIn.jsx');
const SponsorDashboard = lazyPage('./pages/sponsor/SponsorDashboard.jsx');
const SponsorPrograms = lazyPage('./pages/sponsor/SponsorPrograms.jsx');
const SponsorContributions = lazyPage('./pages/sponsor/SponsorContributions.jsx');
const SponsorImpact = lazyPage('./pages/sponsor/SponsorImpact.jsx');
const AdminDashboard = lazyPage('./pages/admin/AdminDashboard.jsx');
const AdminStudents = lazyPage('./pages/admin/Students.jsx');
const AdminStudentDetail = lazyPage('./pages/admin/StudentDetail.jsx');
const AdminApplications = lazyPage('./pages/admin/Applications.jsx');
const AdminContactMessages = lazyPage('./pages/admin/ContactMessages.jsx');
const AdminPrograms = lazyPage('./pages/admin/Programs.jsx');
const AdminSemesters = lazyPage('./pages/admin/Semesters.jsx');
const AdminUnits = lazyPage('./pages/admin/Units.jsx');
const AdminTimetableExams = lazyPage('./pages/admin/TimetableExams.jsx');
const AdminFeeStructures = lazyPage('./pages/admin/FeeStructures.jsx');
const AdminRequests = lazyPage('./pages/admin/Requests.jsx');
const AdminSupport = lazyPage('./pages/admin/Support.jsx');
const AdminGraduation = lazyPage('./pages/admin/Graduation.jsx');
const AdminAnnouncements = lazyPage('./pages/admin/Announcements.jsx');
const AdminLmsOverview = lazyPage('./pages/admin/LmsOverview.jsx');
const AdminCohorts = lazyPage('./pages/admin/Cohorts.jsx');
const AdminCareerOpportunities = lazyPage('./pages/admin/CareerOpportunities.jsx');
const CareerApplications = lazyPage('./pages/admin/CareerApplications.jsx');
const TeachOverview = lazyPage('./pages/teach/TeachOverview.jsx');
const TeachProfile = lazyPage('./pages/teach/TeachProfile.jsx');
const MyCourses = lazyPage('./pages/teach/MyCourses.jsx');
const CreateCourse = lazyPage('./pages/teach/CreateCourse.jsx');
const TeachStudents = lazyPage('./pages/teach/TeachStudents.jsx');
const LearningMaterials = lazyPage('./pages/teach/LearningMaterials.jsx');
const Assignments = lazyPage('./pages/teach/Assignments.jsx');
const Assessments = lazyPage('./pages/teach/Assessments.jsx');
const TeachMessages = lazyPage('./pages/teach/TeachMessages.jsx');
const TeachNotifications = lazyPage('./pages/teach/TeachNotifications.jsx');
const TeachSettings = lazyPage('./pages/teach/TeachSettings.jsx');
const CourseBuilder = lazyPage('./pages/teach/CourseBuilder.jsx');
const LessonContentBuilder = lazyPage('./pages/teach/LessonContentBuilder.jsx');
const Submissions = lazyPage('./pages/teach/Submissions.jsx');
const SessionsManager = lazyPage('./pages/teach/SessionsManager.jsx');
const Gradebook = lazyPage('./pages/teach/Gradebook.jsx');
const LearnDashboard = lazyPage('./pages/learn/LearnDashboard.jsx');
const CareerProfile = lazyPage('./pages/learn/CareerProfile.jsx');
const MyApplications = lazyPage('./pages/learn/MyApplications.jsx');
const Sessions = lazyPage('./pages/learn/Sessions.jsx');
const Calendar = lazyPage('./pages/learn/Calendar.jsx');
const Portfolio = lazyPage('./pages/learn/Portfolio.jsx');
const Goals = lazyPage('./pages/learn/Goals.jsx');
const Projects = lazyPage('./pages/learn/Projects.jsx');
const Mentorship = lazyPage('./pages/learn/Mentorship.jsx');
const Certificates = lazyPage('./pages/learn/Certificates.jsx');
const FeeStatement = lazyPage('./pages/learn/FeeStatement.jsx');
const CertificateVerify = lazyPage('./pages/learn/CertificateVerify.jsx');
const CareerHub = lazyPage('./pages/CareerHub.jsx');
const Opportunities = lazyPage('./pages/career/Opportunities.jsx');
const OpportunityDetail = lazyPage('./pages/career/OpportunityDetail.jsx');
const Connections = lazyPage('./pages/career/Connections.jsx');
const LearningPlayer = lazyPage('./pages/learn/LearningPlayer.jsx');
const AssignmentView = lazyPage('./pages/learn/AssignmentView.jsx');
const QuizAttempt = lazyPage('./pages/learn/QuizAttempt.jsx');
const BecomeTutor = lazyPage('./pages/BecomeTutor.jsx');
const AdminTutorApplications = lazyPage('./pages/admin/TutorApplications.jsx');
const AdminCourseReview = lazyPage('./pages/admin/CourseReview.jsx');
const AdminCertificates = lazyPage('./pages/admin/Certificates.jsx');
const AdminFeeMonitoring = lazyPage('./pages/admin/FeeMonitoring.jsx');
const AdminPayments = lazyPage('./pages/admin/Payments.jsx');
const AdminFoundationApplications = lazyPage('./pages/admin/FoundationApplications.jsx');
const AdminFoundationApplicationDetail = lazyPage('./pages/admin/FoundationApplicationDetail.jsx');
const AdminFoundationStories = lazyPage('./pages/admin/FoundationStories.jsx');
const AdminFoundationInitiatives = lazyPage('./pages/admin/FoundationInitiatives.jsx');
const AdminFoundationEvents = lazyPage('./pages/admin/FoundationEvents.jsx');
const AdminFoundationEventEditor = lazyPage('./pages/admin/FoundationEventEditor.jsx');
const AdminFoundationSponsors = lazyPage('./pages/admin/FoundationSponsors.jsx');
const AdminFoundationContributions = lazyPage('./pages/admin/FoundationContributions.jsx');
const AdminFoundationDisbursements = lazyPage('./pages/admin/FoundationDisbursements.jsx');
const AdminFoundationProgressReports = lazyPage('./pages/admin/FoundationProgressReports.jsx');
const ForEmployers = lazyPage('./pages/ForEmployers.jsx');
const EmployerOverview = lazyPage('./pages/employer/EmployerOverview.jsx');
const EmployerOpportunities = lazyPage('./pages/employer/EmployerOpportunities.jsx');
const EmployerOpportunityEditor = lazyPage('./pages/employer/EmployerOpportunityEditor.jsx');
const EmployerApplications = lazyPage('./pages/employer/EmployerApplications.jsx');
const OrganisationProfile = lazyPage('./pages/employer/OrganisationProfile.jsx');
const NotFound = lazyPage('./pages/NotFound.jsx');
const PaymentReturn = lazyPage('./pages/PaymentReturn.jsx');


export default function App() {
  return (
    <AuthProvider>
      <RouteErrorBoundary>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/learn/catalog" element={<Navigate to="/academy" replace />} />
          
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
              <Route path="fee-monitoring" element={<AdminFeeMonitoring />} />
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
              <Route path="fees" element={<FeeStatement />} />
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
      </Suspense>
      </RouteErrorBoundary>
    </AuthProvider>
  );
}