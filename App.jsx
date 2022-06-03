import React, {useState, useEffect} from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {db} from "./firebase";

const defaultForm = {
  given_name: "",
  family_name: "",
};

function App() {
  const [form, setForm] = useState(defaultForm);
  const [list, setList] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getDocs(collection(db, "users"));

        // console.log(data.docs);
        const users = data.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        // console.log(users);
        setList(users);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  const insertData = async (user) => {
    try {
      const newUser = await addDoc(collection(db, "users"), user);

      setList([...list, {id: newUser.id, ...user}]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateData = async (user) => {
    try {
      const userRef = doc(db, "users", user.id);

      await updateDoc(userRef, {
        given_name: user.given_name,
        family_name: user.family_name,
      });
      let updatedList = list.map((data) => (data.id === user.id ? user : data));
      setList(updatedList);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteData = async (id) => {
    await deleteDoc(doc(db, "users", id));

    const filteredList = list.filter((user) => user.id !== id);
    setList(filteredList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.given_name.trim()) {
      setErrors({given_name: "El nombre es requerido"});
      return;
    }

    if (!form.family_name.trim()) {
      setErrors({family_name: "El apellido es requerido"});
      return;
    }

    if (!editMode) {
      insertData(form);
    } else {
      updateData(form);
    }

    setForm(defaultForm);
    setEditMode(false);
    setErrors({});
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setForm(user);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Registro de Usuarios</h2>
          {(errors.given_name || errors.family_name) && (
            <div className="alert alert-danger">
              <p>{errors.given_name || errors.family_name}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="given_name"
              placeholder="Ingresa tu nombre"
              className="form-control mb-2"
              value={form.given_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="family_name"
              placeholder="Ingresa tu apellido"
              className="form-control mb-2"
              value={form.family_name}
              onChange={handleChange}
            />
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-outline-info">
                {!editMode ? "Enviar" : "Actualizar"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Lista de usuarios</h2>
          {list.length !== 0 ? (
            <ul className="list-group">
              {list.map((user) => (
                <li key={user.id} className="list-group-item">
                  <div className="row">
                    <div className="col-8">
                      {user.given_name} {user.family_name}
                    </div>
                    <div className="col-4">
                      <button
                        type="button"
                        className="mx-2 btn btn-warning"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="mx-2 btn btn-danger"
                        onClick={() => deleteData(user.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No existen registros. Por favor, ingrese los datos</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
