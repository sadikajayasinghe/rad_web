import { StoreProvider, useStore } from "./store"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Details from "./pages/Details"
import Bookings from "./pages/Bookings"
import Provider from "./pages/Provider"
import Admin from "./pages/Admin"
import Login from "./pages/Login"

function Pages() {
  const { page, user } = useStore()
  return (
    <>
      {page === "home" && <Home />}
      {page === "details" && <Details />}
      {page === "login" && <Login />}
      {page === "bookings" && user?.role === "tourist" && <Bookings />}
      {page === "provider" && user?.role === "provider" && <Provider />}
      {page === "admin" && user?.role === "admin" && <Admin />}
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Pages />
      </div>
    </StoreProvider>
  )
}
