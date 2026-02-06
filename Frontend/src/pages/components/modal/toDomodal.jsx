import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const KeyValueList = ({ onItemsChange }) => {
  const [keyText, setKeyText] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrUpdate = () => {
    if (!keyText.trim() || !amount.trim()) return;

    const newItem = { key: keyText.trim(), value: amount.trim() };

    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    setKeyText("");
    setAmount("");
  };

  const handleEdit = (index) => {
    const item = items[index];
    setKeyText(item.key);
    setAmount(item.value);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (editIndex === index) {
      setKeyText("");
      setAmount("");
      setEditIndex(null);
    }
  };

  useEffect(() => {
    onItemsChange(items);
  }, [items, onItemsChange]);

  return (
    <div className="container p-3 bg-light border rounded">
      <Form className="d-flex gap-2 mb-4 flex-wrap align-items-center">
        <Form.Control
          type="text"
          placeholder="Service Name"
          value={keyText}
          onChange={(e) => setKeyText(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          variant={editIndex !== null ? "warning" : "primary"}
          onClick={handleAddOrUpdate}
        >
          {editIndex !== null ? "Update" : "Add"}
        </Button>
      </Form>

      <div className="border rounded p-2">
        {items.length === 0 && <p className="text-secondary">No custom services added.</p>}
        {items.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <div>
              <strong>{item.key}</strong>
              <span className="ms-2 text-muted">₹{item.value}</span>
            </div>
            <div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={() => handleEdit(index)}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyValueList;
