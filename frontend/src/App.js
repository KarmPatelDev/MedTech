import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/main/HomePage';
import About from './pages/main/About';
import Contact from './pages/main/Contact';
import Policy from './pages/main/Policy';
import PageNotFound from './pages/main/PageNotFound';
import AdminRoute from './components/routes/AdminRoute';
import DoctorRoute from './components/routes/DoctorRoute';
import PatientRoute from './components/routes/PatientRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import Categories from './pages/Categories';
import Services from './pages/main/Services';
import Selectlogin from './pages/auth/SelectLogin';
import PatientLogin from './pages/auth/authPatient/PatientLogin';
import PatientSignup from './pages/auth/authPatient/PatientSignup';
import DoctorSignup from './pages/auth/authDoctor/DoctorSignup';
import DoctorLogin from './pages/auth/authDoctor/DoctorLogin';
import DoctorsByCategory from './pages/DoctorsByCategory';
import ShowPatients from './pages/doctor/ShowPatients';
import BookAppointment from './pages/appointment/BookAppointment';
import PatientHistory from './pages/patient/PatientHistory';
import PatientDetails from './pages/doctor/PatientDetails';
import HistoryDetail from './pages/patient/HistoryDetail';
import AdminLogin from './pages/auth/authAdmin/AdminLogin';
import ManageCategories from './pages/admin/ManageCategories';
import DoctorApprove from './pages/admin/DoctorApprove';
import TransactionHistory from './pages/admin/TransactionHistory';
import AdminEditProfile from './pages/admin/AdminEditProfile';
import PatientEditProfile from './pages/patient/PatientEditProfile';
import DoctorEditProfile from './pages/doctor/DoctorEditProfile';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<DoctorsByCategory />} />
      <Route path="/services" element={<Services />} />
      <Route path="/select-login-method" element={<Selectlogin />} />
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/doctor/signup" element={<DoctorSignup />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/user" element={<AdminRoute />} >
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/manage-categories" element={<ManageCategories />} />
        <Route path="admin/doctor-approving" element={<DoctorApprove />} /> 
        <Route path="admin/transaction-history" element={<TransactionHistory />} />
        <Route path="admin/edit-profile" element={<AdminEditProfile />} />
      </Route>

      <Route path="/user" element={<DoctorRoute />} >
        <Route path="doctor" element={<DoctorDashboard />} />
        <Route path="doctor/show-patients" element={<ShowPatients />} />
        <Route path="doctor/patient-details/:id" element={<PatientDetails />} />
        <Route path="doctor/edit-profile" element={<DoctorEditProfile />} />
      </Route>

      <Route path="/user" element={<PatientRoute />} >
        <Route path="patient" element={<PatientDashboard />} />
        <Route path="patient/book-appointment/:patientslug/:doctorslug" element={<BookAppointment />} />
        <Route path="patient/get-history" element={<PatientHistory />} />
        <Route path="patient/history-detail/:id" element={<HistoryDetail />} /> 
        <Route path="patient/edit-profile"  element={<PatientEditProfile />} />
      </Route>
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
}

export default App;
