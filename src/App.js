import logo from './logo.svg';
import './App.css';
import SignUp from './Components/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element = { <SignUp /> }  />
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
