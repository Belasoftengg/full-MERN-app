import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/" className="brand">Codveda • Level 2</Link>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/products">Products</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="*" element={<div className="container"><h1>Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}
