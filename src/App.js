import logo from './logo.svg';
import './App.css';
import SignUp from './Components/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './Components/SignIn';
import DoctorSignUp from './Components/DoctorSignUp';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element = { <SignIn /> }  />
        <Route path='SignUp' element = { <SignUp /> }  />
        <Route path='doctorSignin' element = { <DoctorSignUp />}/>
      
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
