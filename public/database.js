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
  const usersRef = ref(db, "Partners");


  // Функция для загрузки и отображения данных
  async function loadAndDisplayPartners() {
    const snapshot = await get(usersRef);
    const usersListBody = document.querySelector('#usersList tbody');
    usersListBody.innerHTML = '';

    if (snapshot.exists()) {
      snapshot.forEach((childsnapshot) => {
        createUserRow(childsnapshot.key, childsnapshot.val());
      });
    }
  }
async function reindexRecords() {
  const snapshot = await get(usersRef);
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
    await update(ref(db, 'Partners'), updates);
  }
}

  // Создание строки таблицы с данными
async function createUserRow(key, data) {
  const tbody = document.querySelector('#usersList tbody');

  const tr = document.createElement('tr');
  tr.className =
    'bg-white border-b dark:bg-gray-800 dark:border-gray-700';

  tr.innerHTML = `
<td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap dark:text-white addressOne">
${data.Club}
</td>
<td class="px-6 py-4 cityOne">
${data.City}
</td>
<td class="px-6 py-4 clubOne">
${data.Address}
</td>
<td class="px-6 py-4">
  <button class="edit-btn" data-key="${key}">
  <i class="fas fa-edit"></i>Редактировать</button>
</td>
<td class="px-6 py-4">
  <button class="delete-btn" data-key="${key}">
    <i class="fas fa-trash"></i>Удалить
  </button>
</td>
`;

  
  tbody.appendChild(tr);
  tr.querySelector('.edit-btn').addEventListener('click', () => {
    // Заполняем форму данными выбранной записи
    document.getElementById('club2').value = data.Club;
    document.getElementById('city2').value = data.City;
    document.getElementById('address2').value = data.Address;

    // Сохраняем ключ для обновления
    window.currentEditKey = key;

    // Показываем форму для редактирования
    document.getElementById('formContainer').style.display = 'block'
  });
  tr.querySelector('.delete-btn').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      deletepartner(key, tr);// сразу удаляем строку из таблицы
    }
  });
}

function addDataToRealtimeDB(Club, City, Address) {
  const partnersRef = ref(db, 'Partners');
  get(partnersRef).then((snapshot) => {
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
    const newPartnerRef = ref(db, `Partners/${newNumber}`);
    set(newPartnerRef, { Club, City, Address })
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
function updatepartner(id, Club, City, Address) {
  const dbref = ref(db, 'Partners/'+ id);

  // A post entry.
  const partnerData = {
    Club: Club,
    City: City,
    Address: Address
  };

  // Get a key for a new Post.

  return update(dbref, partnerData);
}
function deletepartner(key, row)
{
  const refToDelete = ref(db, 'Partners/' + key);
  remove(refToDelete)
    .then(async() => {

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
    const addButton = document.getElementById('addbutton');
    const formContainer = document.getElementById('formContainer');
    const saveBtn = document.getElementById('saveButton');
    const cancelBtn = document.getElementById('cancelButton');
    const deleteBtn = document.createElement('delbutton');

    // Функция для очистки формы
    function clearForm() {
      document.getElementById('club2').value = '';
      document.getElementById('city2').value = '';
      document.getElementById('address2').value = '';
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
  const club = document.getElementById('club2').value.trim();
  const city = document.getElementById('city2').value.trim();
  const address = document.getElementById('address2').value.trim();

  if (club && city && address) {
    if (window.currentEditKey) {
      // Обновляем существующую запись
      updatepartner(window.currentEditKey, club, city, address)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Обновлено',
            text: 'Данные успешно обновлены!'
          });
          loadAndDisplayPartners(); // перезагружаем таблицу
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
      document.getElementById('formContainer').style.display = 'none';
      clearForm();
    } else {
      // Если не редактируем — добавляем нового
      addDataToRealtimeDB(club, city, address);
      document.getElementById('formContainer').style.display = 'none';
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
   loadAndDisplayPartners();
  });
  
