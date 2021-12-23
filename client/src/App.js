import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"; 
import HomeScreen from "./screens/HomeScreen";
import BookingScreen from "./screens/BookingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminScreen from "./screens/AdminScreen";
import LandingScreen from "./screens/LandingScreen";

import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
       <Navbar />
       <BrowserRouter>
       <Routes>
       <Route exact path= "/" element= { <LandingScreen/> }/>
         <Route exact path= "/home" element= { <HomeScreen/> }/>
         <Route exact path= "/book/:roomid/:fromdate/:todate" element= { <BookingScreen/> }/>
         <Route exact path= "/login" element= { <LoginScreen/> }/>
         <Route exact path= "/register" element= { <RegisterScreen/> }/>
         <Route exact path= "/profile" element= { <ProfileScreen/> }/>
         <Route exact path= "/admin" element= { <AdminScreen/> }/>
         </Routes>
       </BrowserRouter>
    </div>
  );
}

export default App;
