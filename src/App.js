import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import Cabins from './components/Cabins';
import Contacts from './components/Contacts';
import FAQ from './components/FAQ';
import About from './components/About';
import CabinDetails from './components/CabinDetails';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import BookNow from './components/BookNow';
import DevTools from './components/DevTools';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cabins" element={<Cabins />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/cabin/:id" element={<CabinDetails />} />
              <Route path="/book/:id" element={<BookNow />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/dev-tools" element={<DevTools />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
