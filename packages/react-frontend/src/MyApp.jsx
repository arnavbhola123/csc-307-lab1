// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function delUser(userid) {
        const promise = fetch(`Http://localhost:8000/users/${userid}`, {
            method: "DELETE"
        });
        return promise
    }
    function removeOneCharacter(index, userid) {
        delUser(userid)
        .then((response) => {
            if (response.status === 204) {
                const updated = characters.filter((character, i) => {
                    return i !== index;
                });
                setCharacters(updated);
            } else if (response.status === 404) {
                console.error('User not found');
            } else {
                console.error('Failed to delete user:', response.statusText);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        return promise;
    }

    function updateList(person) { 
        postUser(person)
            .then((response) => {
                if (response.status === 201) {
                    response.json().then((newUser) => {
                        setCharacters([...characters, newUser]);
                    });
                } else {
                    console.error('Failed to create user:', response.statusText);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, [] );

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;