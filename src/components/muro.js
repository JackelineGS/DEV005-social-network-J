// Comentar: importación de funciones y métodos de Firebase
import { getAuth, signOut } from 'firebase/auth';
import {
  saveTask,
  onGetTasks,
  deleteTask,
  editTasks,
  updateTask,
  getDate,
  // likesRef,
} from '../lib/firebaseConfig.js';

let editStatus = false;
let id = '';

// Comentar: Diseño del muro
const muro = (navigateTo) => {
  const muroDiv = document.createElement('div');
  muroDiv.className = 'muroDiv';

  muroDiv.innerHTML = '';
  muroDiv.innerHTML += `
  <header>
    <nav class='navbar'>
      <img class='img_food'>
      <div class='icon_exit'></div>
    </nav>
  </header>
  <main>
  
  <div class='create-post'> 
    <button class='open-popup'>¿Qué receta quieres compartir hoy?</button>
  </div>
  <div class='pop-up' id='pop-up'>
    <div class='wrapper'>
      <section class='post'>
        <button class='cerrar-post'><i class='bx bx-x'></i></button>
        <form action='#' class='form-post' id='form-post'>
          <h2>Crear Post</h2>
            <div class='content-post'>
              <div class='detail-post'>
                <p>Food Match</p>
                  <div class='privacy'>
                    <i class='bx bx-user-pin' ></i>
                    <span>amigos</span>
                    <i class='bx bx-caret-down'></i>
                  </div>
              </div>
            </div>
          <textarea id='textarea-post' placeholder='Descripción del post :D'> </textarea>
          <button class='publicar-post' type='submit' >Guardar</button>
        </form>
      </section>
    </div>
  </div>
  <div id='tasks-container' class='tasks-container'></div>
  </main>
  `;
  // Comentar: Boton salida
  const iconExit = muroDiv.querySelector('.icon_exit');
  iconExit.addEventListener('click', () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigateTo('/');
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  });

  // Comentar: Abrir y cerrar el popup
  const interacionPopUp = () => {
    const openPopup = muroDiv.querySelector('.open-popup');
    openPopup.addEventListener('click', () => {
      const popUp = muroDiv.querySelector('.pop-up');
      const button = muroDiv.querySelector('.open-popup');
      const cerrarPost = muroDiv.querySelector('.cerrar-post');
      button.addEventListener('click', () => {
        popUp.style.display = 'block';
      });
      cerrarPost.addEventListener('click', () => {
        popUp.style.display = 'none';
      });
      window.addEventListener('click', (e) => { // windoow??
        if (e.target === popUp) {
          popUp.style.display = 'none';
        }
      });
    });
  };
  interacionPopUp();
  // Comentar: contenedor publicaciones (mostrar datos)
  const tasksContainer = muroDiv.querySelector('.tasks-container');
  window.addEventListener('DOMContentLoaded', async () => {
    // consulta asíncrona
    // querySnapshot -> los datos que existen en este momento
    // ejecutar con promesa o callback

    // cuando ocurra un cambio en la base de datos de post
    // voy a recibir los datos nuevos voy a crear el html  y recorrer los datos
    // para verlo y luego pintamos el html y luego lo ponemos dentro del task container
    onGetTasks((querySnapshot) => {
      let html = '';
      // Comentar: mostrar los resultados de una consulta
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        html += `
              <div class="publicaciones">
                <div class='dropdown'>
                  <button class='btn-menu'><i class='bx bx-dots-horizontal-rounded'></i></button>
                  <div class='container-options'>
                    <button class='btn-delete' data-id="${doc.id}"> Eliminar </button>
                    <button class='btn-edit'data-id="${doc.id}"> Editar </button>
                    </div>
                    </div>
                        <p class='dateFormat'>Hola</p>
                        <p>${task.description}</p>
                        <button class='btn-like' data-id='${doc.id}'><i class='bx bx-heart' id='heart'></i></button> 
                        <span data-id='${task.likes}'> 1.7K</span>
                        <i class='bx bx-message-square-dots'id='comment' ></i> <span data-id='${doc.id}'> 1.7K</span>
                    </div>
          `;
      });
      // Almacenar la función getDate()
      const dateTime = getDate();
      tasksContainer.innerHTML = html;
      // Seleccionar 'dateFormat' para que saque la fecha
      // taskContainer es la const del contenedor de las publicaciones
      // textContent establece el contenido de texto del elemento
      const dateFormat = tasksContainer.querySelectorAll('.dateFormat');
      dateFormat.textContent = dateTime;

      // Comentar: Eliminar un post
      const btnDelete = tasksContainer.querySelectorAll('.btn-delete');
      btnDelete.forEach((btn) => {
        btn.addEventListener('click', (event) => {
          deleteTask(event.target.dataset.id);
        });
      });

      // Comentar: Editar post
      const btnEdit = tasksContainer.querySelectorAll('.btn-edit');
      btnEdit.forEach((btn) => {
        btn.addEventListener('click', async (event) => {
          const cerrarPost = muroDiv.querySelector('.cerrar-post');
          const popUp = muroDiv.querySelector('.pop-up');
          popUp.style.display = 'block';
          cerrarPost.addEventListener('click', () => {
            popUp.style.display = 'none';
          });
          window.addEventListener('click', (e) => { // windoow??
            if (e.target === popUp) {
              popUp.style.display = 'none';
            }
          });
          const docEdit = await editTasks(event.target.dataset.id);
          const taskEdit = docEdit.data();
          const formPost = muroDiv.querySelector('.form-post');
          formPost['textarea-post'].value = taskEdit.description;
          editStatus = true;
          id = event.target.dataset.id;
        });
      });
    });
  });

  const formPost = muroDiv.querySelector('.form-post');
  formPost.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = formPost['textarea-post'].value;
    // console.log(description);
    if (!editStatus) {
      saveTask(description);
    } else {
      updateTask(id, { description });
      editStatus = false;
    }
    formPost.reset();
  });
  return muroDiv;
};

export default muro;
