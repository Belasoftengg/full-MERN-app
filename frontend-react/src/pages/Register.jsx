import { useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.register(form);
      nav("/products");
    } catch (err) {
      const errors = err?.errors?.map((x) => x.msg).join(" ");
      setMsg(errors || err?.error || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={onSubmit} className="card">
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} required />
        <button type="submit">Create account</button>
        <div className="muted">{msg}</div>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
