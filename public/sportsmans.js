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
  const container = document.getElementById('sportsmansdiv');

  // Функция для создания карточки
  function createPartnerCard(data, key) {
    const a = document.createElement('a');
    a.href = "#";
    a.className = 'border border-red-500 group items-center';
    a.dataset.key = key;

    a.innerHTML = `
      <img src="" alt="" class="mx-auto mt-10 aspect-square w-3/4 rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8" />
      <h2 class="text-center mt-4 text-2xl font-semibold text-red-500">${data.Name} ${data.Surname}</h2>
      <p class="text-center mt-1 text-lg font-medium text-gray-900">Пояс: ${data.Belt}</p>
      <p class="text-center mt-1 text-lg font-medium text-gray-900">Опыт: ${data.TrainAge}</p>
      <p class="text-center mt-1 mb-5 text-lg font-medium text-gray-900">Достижения: ${data.Achievments}</p>
    `;
    a.addEventListener('click', (event) =>
    {
      event.preventDefault();
      openModal(data);
    });
    return a;
  }

  // Загрузка данных из Firebase
  function loadPartners() {
    container.innerHTML = ''; // Очистка перед загрузкой
    const partnersRef = ref(db, "Athletes");
     get(partnersRef).then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).forEach(key => {
        const partnerData = data[key];
        const card = createPartnerCard(partnerData, key);
        container.appendChild(card);
      });
    } else {
      console.log("Нет данных");
    }
  }).catch(error => {
    console.error("Ошибка загрузки данных:", error);
  });
  }
  function openModal(data)
  {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.innerHTML = `
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">${data.Name} ${data.Surname}</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">Пояс: ${data.Belt}</p>
          <p class="text-sm text-gray-500">Опыт: ${data.TrainAge}</p>
          <p class="text-sm text-gray-500">Достижения: ${data.Achievments},${data.Text}</p>
        </div>
        <div class="items-center px-4 py-3">
          <button id="close-modal" class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
     const closeButton = modal.querySelector('#close-modal');
  closeButton.addEventListener('click', () => {
    modal.remove();
  });

  // Закрытие модального окна при клике на фон
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

   document.addEventListener('keydown', function closeOnEscape(event) {
    if (event.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
  }
  // Вызовем при загрузке страницы
  document.addEventListener('DOMContentLoaded', loadPartners);