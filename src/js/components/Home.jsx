import React, { useEffect } from 'react'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


//create your first component
const Home = () => {

	const urlBase = 'https://playground.4geeks.com/todo'

	const [taksList, setTaksList] = useState([])
	const [taksValue, setTaksValue] = useState('')
  
	// Obtener todas las tareas
	const getAllTaks = async () => {
	  try {
		const response = await fetch(`${urlBase}/users/nerio`)
		console.log(response)
  
		if (response.ok) {
		  const data = await response.json()
		  setTaksList(data.todos)
		  console.log(data.todos)
		} else {
		  console.log('crear usuario')
		}
	  } catch (error) {
		console.log(error)
	  }
	}
  
	// Enviar tarea a la API
	const postTaks = async () => {
	  try {
		const response = await fetch(`${urlBase}/todos/nerio`, {
		  method: 'POST',
		  body: JSON.stringify({
			label: taksValue,
			is_done: false,
		  }),
		  headers: {
			'Content-Type': 'application/json',
		  },
		})
  
		if (!response.ok) {
		  console.log('Error al enviar la Tarea:', response.statusText)
		}
	  } catch (error) {
		console.log('Error de conexion:', error.message)
	  }
	}
  
	// Función para agregar tarea al presionar Enter
	let addTaks = async (e) => {
		if (e.key === 'Enter' && taksValue.trim() !== '') {
			await postTaks(); // Espera que la tarea se cree en el backend
			setTaksValue(''); // Limpia el input
			getAllTaks();     // Vuelve a cargar las tareas actualizadas desde la API
		}
	}	
  
	// Función para actualizar el valor del input
	const handleChange = (e) => {
	  setTaksValue(e.target.value)
	}
  
	// Eliminar tarea de la lista y del servidor
	const deleteTaskFromAPI = async (id) => {
	  try {
		const response = await fetch(`${urlBase}/todos/${id}`, {
		  method: 'DELETE',
		})
  
		if (response.ok) {
		  console.log('Tarea eliminada ')
		  getAllTaks() // Vuelve a cargar la lista de tareas para reflejar los cambios
		} else {
		  console.log('Error al eliminar la tarea:', response.statusText)
		}
	  } catch (error) {
		console.log('Error de conexión:', error.message)
	  }
	}
  
	// Eliminar tarea de la lista local
	const eliminateList = (id) => {
	  deleteTaskFromAPI(id) // Llama al método DELETE con el id de la tarea)
	}
  
	useEffect(() => {
	  getAllTaks() // Cargar tareas al inicio
	}, [])

	return (
		<div className="text-center">

			<div className='container'>
				<h1 className='text-center h1 my-5'>Todo-List React with Fetch</h1>
				<input
					className='form-control form-control-lg py-3 w-100 shadow'
					type='text'
					onKeyDown={addTaks}
					onChange={handleChange}
					value={taksValue}
					placeholder='What needs to be done?'
				/>
				<ul className='list-group shadow mt-3'>
					{taksList.map((item) => {
						console.log('Item:', item);
						return (
							<li className='list-group-item d-flex justify-content-between list-none fs-5 py-3' key={item.id}>
								{item.label}{' '}
								<button
									className='btn btn-danger'
									onClick={() => eliminateList(item.id)}
								>
									<FontAwesomeIcon icon={faXmark} />
								</button>
							</li>
						)
					})}
				</ul>
				<div className='shadow'>
					<div className='paper border-start border-end h5 py-3 '>
						{taksList.length} Items Left
					</div>
				</div>
			</div>

		</div>
	);
};

export default Home;