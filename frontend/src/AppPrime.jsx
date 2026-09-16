import { Routes, Route } from "react-router-dom";
import NavbarPrime from "./components/NavbarPrime";
import FooterPrime from "./components/FooterPrime";
import HomePagePrime from "./pages/HomePagePrime.jsx";



function AppPrime() {
    return (
        <div>
            <NavbarPrime />
            <Routes>
                <Route path="/" element={<HomePagePrime />} />
            </Routes>
            <FooterPrime />
        </div>
    )
} 

export default AppPrime;