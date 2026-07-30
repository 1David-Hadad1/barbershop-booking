import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import BookingForm from '../components/BookingForm'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <BookingForm />
      </main>
      <Footer />
    </div>
  )
}
