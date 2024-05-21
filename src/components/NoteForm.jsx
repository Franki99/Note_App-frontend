import { useState } from "react";
import { useNotesContext } from "../hooks/useNotesContext";
import { useAuthContext } from "../hooks/useAuthContext";

const NoteForm = () => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const note = { title, notes };

    const response = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    }
    if (response.ok) {
      setTitle("");
      setNotes("");
      setError(null);
      setEmptyFields([]);
      console.log("New note Added", json);
      dispatch({ type: "CREATE_NOTE", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new Note</h3>

      <label>
        <strong>Note Title:</strong>
      </label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      ></input>

      <label>
        <strong>Note content:</strong>
      </label>
      <input
        type="text"
        onChange={(e) => setNotes(e.target.value)}
        value={notes}
        className={emptyFields.includes("notes") ? "error" : ""}
      ></input>
      <button>Add Note</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default NoteForm;
