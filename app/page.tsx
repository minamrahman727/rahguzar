import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Routes from "./components/Routes";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      
      <Routes />
      <Footer/>
    </div>
  );
}
