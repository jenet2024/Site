// src/App.jsx
import "./styles/responsive.css";


import ErrorBoundary from "./components/ErrorBoundary";
import Parkings from "./pages/Parkings";

<Routes>
  <Route path="/parkings" element={<Parkings />} />
</Routes>


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";




// import HomeMinilist from "./pages/HomeMinilist";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import { AuthProvider } from "./context/AuthContext";
import { ParkingProvider } from "./context/ParkingContext";
import "./styles/global.css";
import "./styles/theme.css";



import Success from "./pages/Success";



function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/reports" element={<ErrorBoundary><Reports /></ErrorBoundary>} />
            <Route path="/success" element={<Success />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ParkingProvider>
    </AuthProvider>
  );
}

export default App;
