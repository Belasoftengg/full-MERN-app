import { useEffect, useState } from "react";
import { api } from "../api";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";
import { createSocket } from "../socket";

export default function Products() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // keep socket in a ref-like variable
  const [socket, setSocket] = useState(null);

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const who = await api.me();
      setMe(who.user);

      const list = await api.listProducts();
      setItems(list);
    } catch (err) {
      nav("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // connect socket after we know who we are (optional)
    if (!socket) {
      const s = createSocket();
      setSocket(s);

      s.on("connect", () => {
        // when we know the user, join their room
        if (me?.id || me?._id) {
          s.emit("register", me.id || me._id);
        }
      });

      s.on("product:created", (p) => {
        setItems((prev) => [p, ...prev]);
        setMsg(`New product: ${p.name}`);
      });

      s.on("product:updated", (p) => {
        setItems((prev) => prev.map((i) => (i._id === p._id ? p : i)));
        setMsg(`Updated: ${p.name}`);
      });

      s.on("product:deleted", ({ _id }) => {
        setItems((prev) => prev.filter((i) => i._id !== _id));
        setMsg(`Deleted product ${_id}`);
      });

      s.on("notify", (n) => {
        // user-specific notifications
        setMsg(n.message || "You have a notification");
      });

      return () => {
        s.close();
      };
    }
  }, [socket, me]);

  const onCreate = async (payload) => {
    setMsg("");
    try {
      const created = await api.createProduct(payload);
      // local optimistic update not necessary; socket will broadcast
      setEditing(null);
      setMsg("Created!");
    } catch (err) {
      const errors = err?.errors?.map((x) => x.msg).join(" ");
      setMsg(errors || err?.error || "Create failed");
    }
  };

  const onUpdate = async (id, payload) => {
    setMsg("");
    try {
      await api.updateProduct(id, payload);
      setEditing(null);
      setMsg("Updated!");
    } catch (err) {
      const errors = err?.errors?.map((x) => x.msg).join(" ");
      setMsg(errors || err?.error || "Update failed");
    }
  };

  const onDelete = async (id) => {
    setMsg("");
    try {
      await api.deleteProduct(id);
      setMsg("Deleted!");
    } catch (err) {
      setMsg(err?.error || "Delete failed");
    }
  };

  const logout = async () => {
    await api.logout();
    nav("/login");
  };

  return (
    <div className="container">
      <header className="bar">
        <h1>Products (Real-time)</h1>
        <div>
          {me && <span className="pill">{me.name} ({me.role})</span>}
          <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
        </div>
      </header>

      <ProductForm onCreate={onCreate} onUpdate={onUpdate} editing={editing} />

      <div className="muted" style={{ minHeight: 20 }}>{msg}</div>

      {loading ? (
        <div className="muted">Loading…</div>
      ) : (
        <table className="card">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Owner</th>
              <th>Created</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{Number(p.price).toLocaleString()}</td>
                <td>{p.owner?.name || "—"}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td>
                  <button className="ghost" onClick={() => setEditing(p)}>Edit</button>
                  <button style={{ marginLeft: 8 }} onClick={() => onDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="muted">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
