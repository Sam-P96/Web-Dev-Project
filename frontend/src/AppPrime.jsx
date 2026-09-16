import { Routes, Route } from "react-router-dom";
import NavbarPrime from "./components/NavbarPrime";
import FooterPrime from "./components/FooterPrime";
import HomePagePrime from "./pages/HomePagePrime.jsx";
import LoginPrime from "./pages/LoginPrime"
import UserProfilePrime from "./pages/UserProfilePrime";
import WorkerAppointments from "./pages/WorkerAppointments"
import SubmitCarPrime from "./pages/SubmitCarPrime";
import FindCarsPrime from "./pages/FindCarsPrime";



function AppPrime() {
    return (
        <div>
            <NavbarPrime />
            <Routes>
                <Route path="/" element={<HomePagePrime />} />
                <Route path="/login" element={<LoginPrime />} />
                <Route path="/profile" element={<UserProfilePrime />} />
                <Route path="/employee_booking" element={<WorkerAppointments />} />
                <Route path="/submit_page" element={<SubmitCarPrime />} />
                <Route path="/find_cars" element={<FindCarsPrime />} />

            </Routes>
            <FooterPrime />
        </div>
    )
} 

export default AppPrime;