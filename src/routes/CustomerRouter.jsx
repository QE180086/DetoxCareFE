import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "../components/common/NavBar"
import Footer from "../components/common/Footer"
import Home from "../components/home/Home"
import Login from "../components/auth/Login"
import Register from "../components/auth/Register"
import SendOTP from "../components/auth/SendOTP"
import VerifyOTP from "../components/auth/VerifyOTP"
import Contact from "../components/aboutus/Contact"
import AboutUs from "../components/aboutus/AboutUs"
import AIChat from "../components/common/AIChat"
import ScrollToTop from "../components/common/ScrollToTop"
import Blog from "../components/blog/Blog"
import BlogDetail from "../components/blog/BlogDetail"
import Cart from "../components/cart/Cart"
import Profile from "../components/profile/Profile"
import SearchPage from "../components/products/SearchPage"
import ProductDetail from "../components/products/ProductDetail"
import HistoryOrders from "../components/order/HistoryOrder"
import LoginSuccess from "../components/auth/LoginSuccess"
import LoginRedirect from "../components/auth/LoginRedirect"

export const CustomerRouter = () => {
    const location = useLocation();
    const hideLayout = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/send-otp" || location.pathname === "/verify-otp" || location.pathname === "/login/success" || location.pathname === "/login/redirect";

    return (
        <div>
            <ScrollToTop />
            {!hideLayout ? <Navbar></Navbar> : null}
            <AIChat />
            <Routes key={location.pathname}>
                {/* <Route path="/" element={<Home />}></Route>
                    <Route path="/account/register" element={<Home />}></Route>
                    <Route path="/account/login" element={<Home />}></Route>

                    <Route path="/restaurant/:restaurantId" element={<RestaurantDetail></RestaurantDetail>}></Route>

                    <Route path="/cart" element={<Cart></Cart>}></Route>

                    <Route path="/my-profile" element={<MyProfile/>}></Route>
                    <Route path="/my-profile/orders" element={<Order/>}></Route> */}
                <Route path="/login/success" element={<LoginSuccess />} />
                <Route path="/login/redirect" element={<LoginRedirect />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/send-otp" element={<SendOTP />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:blogId" element={<BlogDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                {/*  orders  */}
                <Route path="/history-order" element={<HistoryOrders />} />
            </Routes>
            {!hideLayout ? <Footer></Footer> : null}

        </div>
    )
}