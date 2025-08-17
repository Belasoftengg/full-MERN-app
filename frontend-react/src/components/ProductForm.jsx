import { useEffect, useState } from "react";

export default function ProductForm({ onCreate, onUpdate, editing }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(String(editing.price));
    } else {
      setName("");
      setPrice("");
    }
  }, [editing]);

  const submit = (e) => {
    e.preventDefault();
    const payload = { name: name.trim(), price: Number(price) };
    if (editing) onUpdate(editing._id, payload);
    else onCreate(payload);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>{editing ? `Edit: ${editing.name}` : "Create Product"}</h3>
      <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required minLength={2} />
      <input placeholder="Price" type="number" min="0" value={price} onChange={(e)=>setPrice(e.target.value)} required />
      <div>
        <button type="submit">{editing ? "Update" : "Create"}</button>
      </div>
    </form>
  );
}
