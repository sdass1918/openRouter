import './App.css'
import { LandingPage } from './pages/LandingPage'
import { Route, Routes} from 'react-router-dom'
import { SigninPage } from './pages/Signin';
import { SignupPage } from './pages/Signup';
import { DashboardPage } from './pages/Dashboard';
import { Models } from './pages/Models';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path='/models' element={<Models />} />
      </Routes>
    </>
  );
}

export default App
