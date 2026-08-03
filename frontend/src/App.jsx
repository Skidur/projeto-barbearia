import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home.jsx';
import { Booking } from './pages/Booking.jsx';
import { Register } from './pages/Register.jsx';
import { Login } from './pages/Login.jsx';
import { MyAccount } from './pages/MyAccount.jsx';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/minha-conta" element={<MyAccount />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;