import Header from "../components/header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";

export default function Contact() {
  return (
    <div>
      <Header />
      <main className="main-content">
        <h1>Contact Us</h1>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
