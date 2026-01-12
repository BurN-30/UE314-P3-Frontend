import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState<any[]>([]) 
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // chargement page
  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
    // on recupere les users
    axios.get('http://localhost:3000/users').then((res) => {
      setUsers(res.data)
      console.log(users)
    })
  }

  const handleCreate = (e: any) => {
    e.preventDefault()
    
    // on cree l'objet
    const newUser = {
      firstname: firstname,
      lastname: lastname
    }

    axios.post('http://localhost:3000/users', newUser).then(() => {
      // on recharge la liste
      getUsers()
      setFirstname('')
      setLastname('')
    }).catch((err) => {
      alert("Erreur lors de l'ajout (Backend éteint ou erreur CORS ?)")
      console.error(err)
    })
  }

  const deleteUsr = (id: number) => {
    axios.delete('http://localhost:3000/users/' + id).then(() => {
      getUsers()
    })
  }

  const seeDetails = (id: number) => {
    axios.get('http://localhost:3000/users/' + id).then((res) => {
      setSelectedUser(res.data)
    })
  }

  // update avec des prompt c'est plus rapide
  const updateUsr = (id: number) => {
    const newName = prompt("Nouveau prenom ?")
    const newLast = prompt("Nouveau nom ?")

    if (newName !== null && newLast !== null && newName.trim() && newLast.trim()) {
        axios.patch('http://localhost:3000/users/' + id, {
            firstname: newName,
            lastname: newLast
        }).then(() => {
            getUsers()
            alert('Utilisateur modifié')
        }).catch((err) => {
            alert('Erreur lors de la modification')
            console.error(err)
        })
    }
  }

  return (
    <div className="App">
      <h1>Gestion Utilisateurs</h1>

      <div className="form">
        <h3>Ajouter utilisateur</h3>
        <input 
          type="text" 
          placeholder="Prenom" 
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Nom" 
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <button onClick={handleCreate}>Ajouter</button>
      </div>

      <div className="list">
        <h3>Liste des gens</h3>
        {users.map((u) => (
          <div key={u.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px'}}>
             <p>{u.firstname} {u.lastname}</p>
             <button onClick={() => deleteUsr(u.id)}>Supprimer</button>
             <button onClick={() => updateUsr(u.id)}>Modifier</button>
             <button onClick={() => seeDetails(u.id)}>Details</button>
          </div>
        ))}
      </div>

      {selectedUser ? (
        <div style={{ background: '#333', color: '#fff', padding: '20px', marginTop: '20px', borderRadius: '5px'}}>
            <h3>Details de l'user</h3>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Nom:</strong> {selectedUser.lastname}</p>
            <p><strong>Prenom:</strong> {selectedUser.firstname}</p>
            <button onClick={() => setSelectedUser(null)}>Fermer</button>
        </div>
      ) : null}

    </div>
  )
}

export default App
