import { useState, useEffect } from "react";

function App() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editedName, setEditedName] = useState("");

    // Obtener usuarios del backend
    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then((data) => setUsers(data));
    }, [users]);

    // Crear un nuevo usuario
    const createUser = () => {
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newUser }),
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers([...users, data]);
                setNewUser("");
            });
    };

    // Eliminar un usuario
    const deleteUser = (id) => {
        fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
        }).then(() => {
            setUsers(users.filter((user) => user.id !== id));
        });
    };

    // Iniciar edición de un usuario
    const startEditing = (user) => {
        setEditingUser(user);
        setEditedName(user.name);
    };

    // Actualizar un usuario
    const updateUser = () => {
        fetch(`http://localhost:3000/users/${editingUser.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: editedName }),
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(
                    users.map((user) =>
                        user.id === data.id ? { ...user, name: data.name } : user
                    )
                );
                setEditingUser(null);
                setEditedName("");
            });
    };

    return (
        <div>
            <h1>Usuarios</h1>

            {/* Formulario para crear un usuario */}
            <div>
                <input
                    type="text"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="Nombre del usuario"
                />
                <button onClick={createUser}>Crear</button>
            </div>

            {/* Listar usuarios */}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {editingUser && editingUser.id === user.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                                <button onClick={updateUser}>Actualizar</button>
                                <button onClick={() => setEditingUser(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                {user.name}
                                <button onClick={() => startEditing(user)}>Editar</button>
                                <button onClick={() => deleteUser(user.id)}>Eliminar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
