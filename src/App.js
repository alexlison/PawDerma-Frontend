import logo from './logo.svg';
import './App.css';
import SignUp from './Components/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './Components/SignIn';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element = { <SignIn /> }  />
        <Route path='SignUp' element = { <SignUp /> }  />
      
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
