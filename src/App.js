import logo from './logo.svg';
import './App.css';
import SignUp from './Components/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './Components/SignIn';
import DoctorSignUp from './Components/DoctorSignUp';
import AttenderSignUp from './Components/AttenderSignUp';
import AdminPanel from './Components/AdminPanel';
import ViewCatOwners from './Components/ViewCatOwners';
import ViewDoctors from './Components/ViewDoctors';
import ViewAttenders from './Components/ViewAttenders';
import Home from './Components/Home';
import AddCat from './Components/AddCat';
import Appointments from './Components/Appointments';
import HomeDefault from './Components/HomeDefault';
import ViewMyCats from './Components/ViewMyCats';
import EditCat from './Components/EditCat';
import ViewAllCats from './Components/ViewAllCats';
import DoctorPanel from './Components/DoctorPanel';
import DoctorDashboard from './Components/DoctorDashboard';
import DoctorView from './Components/DoctorView';
import UpdateDoctor from './Components/UpdateDoctor';
import ViewSchedules from './Components/ViewSchedules';
import AddSchedules from './Components/AddSchedules';
import UpdateSchedule from './Components/UpdateSchedule';

import SkinPrediction from './Components/SkinPrediction';
import GeneralBooking from './Components/GeneralBooking';
import Payment from './Components/Payment';
import Receipt from './Components/Receipt';
import DoctorAppointments from './Components/DoctorAppointments';
import AddPrescription from './Components/AddPrescription';
import ViewPrescription from './Components/ViewPrescription';
import ViewMyAppointments from './Components/ViewMyAppointments';
import AttenderPanel from './Components/AttenderPanel';
import AttenderDashboard from './Components/AttenderDashboard';
import AttenderView from './Components/AttenderView';
import UpdateAttender from './Components/UpdateAttender';
import ViewAttenderSchedules from './Components/ViewAttenderSchedules';
import UpdateAttenderSchedule from './Components/UpdateAttenderSchedule';
import AddAttenderSchedule from './Components/AddAttenderSchedule';
import VaccinationBooking from './Components/VaccinationBooking';
import AttenderVaccinations from './Components/AttenderVaccinations';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
         {/* Public Routes */}
        <Route path='/' element = { <SignIn /> }  />
        <Route path='SignUp' element = { <SignUp /> }  />
         <Route path="doctorSignup" element={<DoctorSignUp />} />
         <Route path="attenderSignup" element={<AttenderSignUp />} />
         

        
       
           {/* Admin Routes with nested pages */}
          <Route path="adminPanel" element={<AdminPanel />}>
          <Route path="catowners" element={<ViewCatOwners />} />
          <Route path="doctors" element={<ViewDoctors />} />
          <Route path="attenders" element={<ViewAttenders />} />
          <Route path="cats" element={<ViewAllCats />} />
          </Route>

          {/* Doctor Routes with nested pages */}
          <Route path = "doctorPanel" element = {<DoctorPanel />} >
          <Route index element={<DoctorDashboard />} />
          <Route path='doctorDashboard' element = {<DoctorDashboard />} />
          <Route path='doctorProfile' element = {<DoctorView />} />
          <Route path='viewSchedules' element = {<ViewSchedules />} />
          <Route path='doctorAppointments' element = {<DoctorAppointments />} />
         


          </Route>
           <Route path='addSchedule' element = {<AddSchedules />} />
           <Route path="addPrescription/:appointmentId" element={<AddPrescription />} />
           <Route path="viewPrescription/:appointmentId" element={<ViewPrescription />} />

           <Route path="updateDoctor" element={<UpdateDoctor />} />
           <Route path="updateSchedule/:id" element={<UpdateSchedule />} />



           {/* Attender Routes with nested pages */}
           <Route path='attenderPanel' element = {<AttenderPanel />} >
            <Route index element={<AttenderDashboard />} />
            <Route path='attenderDashboard' element = {<AttenderDashboard />} />
            <Route path='attenderProfile' element = {<AttenderView />} />
            <Route path='viewAttenderSchedules' element = {<ViewAttenderSchedules />} />
            <Route path='attenderVaccinations' element = {<AttenderVaccinations />} />

           </Route>
           <Route path="updateAttender" element={<UpdateAttender />} />
           <Route path="addAttenderSchedule" element={<AddAttenderSchedule />} />
           <Route path="updateAttenderSchedule/:id" element={<UpdateAttenderSchedule />} />


              
            {/* Home Routes with nested pages */}
           <Route path="home" element={<Home />}>
           <Route index element={<HomeDefault />} />
           <Route path='homeDefault' element={<HomeDefault />} />
           <Route path='addcat' element = {<AddCat />} />
           <Route path='editcat/:id' element = {<EditCat />} />
           <Route path='appointments' element = {<Appointments />} />
           <Route path='skinPrediction' element = {<SkinPrediction />} />
           <Route path='generalBooking' element = {<GeneralBooking />} />
           <Route path='vaccinationBooking' element = {<VaccinationBooking />} />
           <Route path='payment/:appointmentId' element={<Payment />} />
           <Route path='receipt/:appointmentId' element={<Receipt />} />

           <Route path='viewMyCats' element = {<ViewMyCats />} />
           <Route path='viewMyAppointments' element = {<ViewMyAppointments />} />

           </Route>
      
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
