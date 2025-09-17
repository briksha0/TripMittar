import React, { useState, createContext, useContext } from "react";
import {BrowserRouter as Router,Routes,Route,Navigate,useLocation,} from "react-router-dom";
// Flight booking components

import { FlightHome } from "./components/FlightBooking/FlightHome";
import Login from "./components/FlightBooking/Login";
import Signup from "./components/FlightBooking/Signup";
import TrainBooking from "./components/TrainBooking/TrainBooking";
import { FlightDetails } from "./components/FlightBooking/FlightDetails";
import ConfirmationPage from "./components/Layout/ConfirmationPage";

// Other components

import Navbar from "./components/Layout/Navbar";
import CabBooking from "./components/CabBooking/CabBooking";
import CarsPage from "./components/CabBooking/CarsPage";
import PNRStatus from "./components/TrainBooking/PNRStatus";
import Home from "./components/Layout/HomePage";
import PaymentFlight from "./components/FlightBooking/PaymentFlight";
import TrainList from "./components/TrainBooking/TrainList";
import TrainPayment from "./components/TrainBooking/TrainPayment";

import BusBooking from "./components/BusBooking/BusBooking";
import BusList from "./components/BusBooking/BusList";
import BusPayment from "./components/BusBooking/BusPayment";

import HotelSearch from "./components/HotelBooking/HotelSearch";
import HotelList from "./components/HotelBooking/HotelList";
import HotelPayment from "./components/HotelBooking/HotelPayment";

import MyBookings from "./components/Layout/MyBookings";
import PaymentCab from "./components/CabBooking/PaymentCab";
import Footer from "./components/Layout/Footer";
import GoogleMapsLoader from "./components/Map/GoogleMapsLoader";
// ------------------- Auth Context -------------------
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  const signin = (newUser, callback) => {
    setUser(newUser);
    if (redirectAfterLogin) {
      callback?.(redirectAfterLogin);
      setRedirectAfterLogin(null);
    } else {
      callback?.("/");
    }
  };

  const signout = (callback) => {
    setUser(null);
    callback?.();
  };

  return (
    <AuthContext.Provider
      value={{ user, signin, signout, redirectAfterLogin, setRedirectAfterLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ------------------- Private Route -------------------
function PrivateRoute({ children }) {
  const { user, setRedirectAfterLogin } = useAuth();
  const location = useLocation();

  if (!user) {
    // save where the user wanted to go
    setRedirectAfterLogin(location.pathname);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
}

// ------------------- App Content -------------------
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <GoogleMapsLoader />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/trainbooking" element={<TrainBooking />} />
          {/* Cab Booking */}
          <Route path="/cabbooking" element={<CabBooking />} />
          <Route path="/cabs" element={<PrivateRoute><CarsPage /></PrivateRoute>} />
          <Route path="/cab/payment" element={<PrivateRoute><PaymentCab /></PrivateRoute>} />

          <Route path="/pnr" element={<PNRStatus />} />
          {/* Flights & Protected Routes */}
          <Route path="/flights/:flightId"element={<PrivateRoute><FlightDetails /></PrivateRoute>}/>
          <Route path="/flightpage" element={<FlightHome />} />
    

          {/* Payment + Confirmation */}
          <Route path="/payment" element={<PaymentFlight />} />
          {/* Train Booking */}
          <Route path="/trainbooking" element={<TrainBooking />} />
          <Route path="/trains/list" element={<TrainList />} />
          <Route path="/trains/payment" element={<TrainPayment />} />
        {/* Bus Booking */}
          <Route path="/busbooking" element={<BusBooking />} />
          <Route path="/buses/list" element={<BusList />} />
          <Route path="/buses/payment" element={<PrivateRoute><BusPayment/></PrivateRoute> } />
        {/* Hotel Booking */}  
          <Route path="/hotels" element={<HotelSearch />} />       
        <Route path="/hotels/list" element={<HotelList />} />
          <Route path="/hotels/payment" element={<PrivateRoute><HotelPayment /></PrivateRoute>} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// ------------------- App Wrapper -------------------
export default function AppWithProvider() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
