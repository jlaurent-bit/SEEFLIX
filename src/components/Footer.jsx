import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-logo">Seeflix</div>
                <p>&copy; 2025 Seeflix. All rights reserved.</p>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/media">Media</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}