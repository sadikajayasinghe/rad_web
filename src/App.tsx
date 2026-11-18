import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import AppRouter from "./router"
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <AppRouter />
          </main>
          <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Ceylon Travel Excursions & Discovery. Powered by rad_api.
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
