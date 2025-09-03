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
          </Route>

              
              {/* Home Routes with nested pages */}
           <Route path="home" element={<Home />}>
           <Route index element={<HomeDefault />} />
            <Route path='homeDefault' element={<HomeDefault />} />
           <Route path='addcat' element = {<AddCat />} />
           <Route path='appointments' element = {<Appointments />} />
           <Route path='viewMyCats' element = {<ViewMyCats />} />

           </Route>
      
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
