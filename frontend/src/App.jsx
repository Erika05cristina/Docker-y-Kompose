import { useState, useEffect } from "react";

function App() {
    const [books, setBooks] = useState([]);
    const [newBookTitle, setNewBookTitle] = useState("");
    const [newBookAuthor, setNewBookAuthor] = useState("");
    const [editingBook, setEditingBook] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedAuthor, setEditedAuthor] = useState("");

    // Obtener libros del backend
    useEffect(() => {
        fetch("http://localhost:3000/books")
            .then((res) => res.json())
            .then((data) => setBooks(data));
    }, [books]);

    // Crear un nuevo libro
    const createBook = () => {
        fetch("http://localhost:3000/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newBookTitle, author: newBookAuthor }),
        })
            .then((res) => res.json())
            .then((data) => {
                setBooks([...books, data]);
                setNewBookTitle("");
                setNewBookAuthor("");
            });
    };

    // Eliminar un libro
    const deleteBook = (id) => {
        fetch(`http://localhost:3000/books/${id}`, {
            method: "DELETE",
        }).then(() => {
            setBooks(books.filter((book) => book.id !== id));
        });
    };

    // Iniciar edición de un libro
    const startEditing = (book) => {
        setEditingBook(book);
        setEditedTitle(book.title);
        setEditedAuthor(book.author);
    };

    // Actualizar un libro
    const updateBook = () => {
        fetch(`http://localhost:3000/books/${editingBook.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: editedTitle, author: editedAuthor }),
        })
            .then((res) => res.json())
            .then((data) => {
                setBooks(
                    books.map((book) =>
                        book.id === data.id ? { ...book, title: data.title, author: data.author } : book
                    )
                );
                setEditingBook(null);
                setEditedTitle("");
                setEditedAuthor("");
            });
    };

    return (
        <div>
            <h1>Libros</h1>

            {/* Formulario para crear un libro */}
            <div>
                <input
                    type="text"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    placeholder="Título del libro"
                />
                <input
                    type="text"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    placeholder="Autor del libro"
                />
                <button onClick={createBook}>Crear</button>
            </div>

            {/* Listar libros */}
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        {editingBook && editingBook.id === book.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={editedAuthor}
                                    onChange={(e) => setEditedAuthor(e.target.value)}
                                />
                                <button onClick={updateBook}>Actualizar</button>
                                <button onClick={() => setEditingBook(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                {book.title} - {book.author}
                                <button onClick={() => startEditing(book)}>Editar</button>
                                <button onClick={() => deleteBook(book.id)}>Eliminar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
