import { Link, useLocation } from "react-router-dom";
import "./header.css";

export default function Header() {
  const location = useLocation();

  return (
    <header>
        <section className="navbar">
                <div className="logo">Seeflix</div>
                <nav>
                    <ul>
                        <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
                        <li><Link to="/media" className={location.pathname === "/media" ? "active" : ""}>Media</Link></li>
                        <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
                        <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact</Link></li>
                    </ul>
                </nav>
        </section>

    <section className="hero">
        <h1>Streaming is no longer a luxury, it's a Lifestyle</h1>
        <button>Get started</button>
    </section>

    </header>
  );
}