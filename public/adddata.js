import {initializeApp} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import {getDatabase, ref, get, set, push, update, remove} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCiSC2LESN9ZsZPbTt8nONWIk45EgsgfwM",
    authDomain: "khaperskiy-team.firebaseapp.com",
    databaseURL: "https://khaperskiy-team-default-rtdb.firebaseio.com",
    projectId: "khaperskiy-team",
    storageBucket: "khaperskiy-team.firebasestorage.app",
    messagingSenderId: "824784320127",
    appId: "1:824784320127:web:230709df25f69ba4f1314a",
    measurementId: "G-61ZF6G8TDB"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getDatabase(app);
  const athletesRef = ref(db, "Athletes");


  // Функция для загрузки и отображения данных
  async function loadAndDisplayAthletes() {
    const snapshot = await get(athletesRef);
    const usersListBody = document.querySelector('#athletesList tbody');
    usersListBody.innerHTML = '';

    if (snapshot.exists()) {
      snapshot.forEach((childsnapshot) => {
        createathletRow(childsnapshot.key, childsnapshot.val());
      });
    }
  }
async function reindexRecords() {
  const snapshot = await get(athletesRef);
  if (snapshot.exists()) {
    const updates = {};
    let index = 1;
    snapshot.forEach((childsnapshot) => {
      const oldKey = childsnapshot.key;
      const newKey = index.toString();
      if (oldKey !== newKey) {
        // Переносим данные под новый ключ
        updates[newKey] = childsnapshot.val();
        // Удаляем старый ключ
        updates[oldKey] = null;
      }
      index++;
    });
    // Обновляем базу данными
    await update(ref(db, 'Athletes'), updates);
  }
}

  // Создание строки таблицы с данными
async function createathletRow(key, data) {
  const tbody = document.querySelector('#athletesList tbody');

  const tr = document.createElement('tr');
  tr.className =
    'bg-white border-b dark:bg-gray-800 dark:border-gray-700';

  tr.innerHTML = `
<td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap dark:text-white nameOne">
${data.Name}
</td>
<td class="px-6 py-4 surnameOne">
${data.Surname}
</td>
<td class="px-6 py-4 beltOne">
${data.Belt}
</td>
<td class="px-6 py-4 trainOne">
${data.TrainAge}
</td>
<td class="px-6 py-4 achivOne">
${data.Achievments}
</td>
<td class="px-6 py-4">
  <button class="edit-btn2" data-key="${key}">
  <i class="fas fa-edit"></i>Редактировать</button>
</td>
<td class="px-6 py-4">
  <button class="delete-btn2" data-key="${key}">
    <i class="fas fa-trash"></i>Удалить
  </button>
</td>
`;

  
  tbody.appendChild(tr);
  tr.querySelector('.edit-btn2').addEventListener('click', () => {
    // Заполняем форму данными выбранной записи
    document.getElementById('name2').value = data.Name;
    document.getElementById('surname2').value = data.Surname;
    document.getElementById('belt2').value = data.Belt;
    document.getElementById('train2').value = data.TrainAge;
    document.getElementById('achiv2').value = data.Achievments;

    // Сохраняем ключ для обновления
    window.currentEditKey = key;

    // Показываем форму для редактирования
    document.getElementById('formContainer2').style.display = 'block'
  });
  tr.querySelector('.delete-btn2').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      deleteathlet(key, tr);// сразу удаляем строку из таблицы
    }
  });
}

function addDataToRealtimeDB(Name, Surname, Belt, TrainAge, Achievments) {
  const athletesRef = ref(db, 'Athletes');
  get(athletesRef).then((snapshot) => {
    let maxNumber = 0;
    if (snapshot.exists()) {
      const data = snapshot.val();
 
      Object.keys(data).forEach((key) => {
        const num = parseInt(key);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      });
    }
    const newNumber = maxNumber + 1; 
    const newathletRef = ref(db, `Athletes/${newNumber}`);
    set(newathletRef, {Name, Surname, Belt, TrainAge, Achievments})
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Готово',
          text: 'Данные успешно добавлены!'
        });

      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: error.message
        });
      });
  }).catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка получения данных',
      text: error.message
    });
  });
}
function updateathlet(id, Name, Surname, Belt, TrainAge, Achievments) {
  const dbref = ref(db, 'Athletes/'+ id);

  // A post entry.
  const athletData = {
    Name: Name,
    Surname: Surname,
    Belt: Belt,
    TrainAge: TrainAge,
    Achievments: Achievments

  };

  // Get a key for a new Post.

  return update(dbref, athletData);
}
function deleteathlet(key, row)
{
  const refToDelete = ref(db, 'Athletes/' + key);
  remove(refToDelete)
    .then(async() => {
      // Удаляем строку из таблицы
      row.remove();
      await reindexRecords();

      Swal.fire({
        icon: 'success',
        title: 'Удалено',
        text: 'Данные успешно удалены!'
      });
    })
    .catch((error) => {
      Swal.fire({
        icon:'error',
        title:'Ошибка',
        text:error.message
      });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addbutton2');
    const formContainer = document.getElementById('formContainer2');
    const saveBtn = document.getElementById('saveButton2');
    const cancelBtn = document.getElementById('cancelButton2');

    // Функция для очистки формы
    function clearForm() {
    document.getElementById('name2').value = "";
    document.getElementById('surname2').value = "";
    document.getElementById('belt2').value = "";
    document.getElementById('train2').value = "";
    document.getElementById('achiv2').value = "";

      window.currentEditKey = null;
    }

    // Показать форму при нажатии кнопки
    addButton.addEventListener('click', () => {
      formContainer.style.display = 'block';
    });

    // Отмена и скрытие формы
    cancelBtn.addEventListener('click', () => {
      formContainer.style.display = 'none';
      clearForm();
    });
    saveBtn.addEventListener('click', () => {
    const name= document.getElementById('name2').value.trim();
    const surname = document.getElementById('surname2').value.trim();
    const belt = document.getElementById('belt2').value.trim();
    const trainage = document.getElementById('train2').value.trim();
    const achiv = document.getElementById('achiv2').value.trim();

  if (name && surname && belt && trainage && achiv) {
    if (window.currentEditKey) {
      // Обновляем существующую запись
      updateathlet(window.currentEditKey, name, surname, belt, trainage, achiv)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Обновлено',
            text: 'Данные успешно обновлены!'
          });
          loadAndDisplayAthletes(); // перезагружаем таблицу
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: error.message
          });
        });
      // Очистка и скрытие формы после обновления
      window.currentEditKey = null;
      document.getElementById('formContainer2').style.display = 'none';
      clearForm();
    } else {
      addDataToRealtimeDB(name, surname, belt, trainage, achiv);
      document.getElementById('formContainer2').style.display = 'none';
      clearForm();
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Пожалуйста, заполните все поля формы'
    });
  }
    });
   loadAndDisplayAthletes();
  });
  
