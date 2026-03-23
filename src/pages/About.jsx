import Header from "../components/header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div>
      <Header />
      <main className="main-content">
        <section className="about-section">
          <h1>About Seeflix</h1>
          <p>
            Seeflix is your ultimate destination for streaming movies and TV shows.
            Discover a vast library of entertainment content, from blockbuster movies
            to binge-worthy series, all available at your fingertips.
          </p>
        </section>
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            At Seeflix, our mission is to provide high-quality streaming services
            that bring joy and entertainment to people worldwide. We strive to
            offer a seamless viewing experience with a diverse selection of content
            for every taste and preference.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}