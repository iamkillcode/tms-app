import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-auth-gradient">
    <Navbar />
    <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-100">
          {children}
        </div>
      </div>
    </main>
    <Footer className="mt-auto" />
  </div>
)

export default AuthLayout

