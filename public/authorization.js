
  // Import the functions you need from the SDKs you need
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
  import { getDatabase, ref, get, set, push} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);
  async function signupUser()
  {
    const username = document.getElementById("username").value;
    const status = document.getElementById("userstatus").value;
    const signpass = document.getElementById("signpassword").value;
    const phone = document.getElementById("userphone").value;
    const email = document.getElementById("useremail").value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[.,!?;:\-]).{8,}$/;
    if (!username || !signpass || !status || !phone || !email) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Заполните все поля формы",
          });
        return;
    }
    if (!passwordRegex.test(signpass)) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Пароль должен быть не менее 8 символов, содержать хотя бы одну строчную и одну прописную латинскую букву, а также один знак препинания (.,!?;:-).",
        });
        return;
    }
    try {
        // Проверка, существует ли пользователь с таким логином
        const snapshot = await get(ref(database, 'Authorization'));
        const users = snapshot.val();
        const userExists = users && Object.values(users).some(u => u && u.Login.toLowerCase() === username.toLowerCase());

        if (userExists) {
            Swal.fire({
                icon: "error",
                title: "Ошибка...",
                text: "Пользователь с таким логином уже существует!",
            });
            return;
        }
        let UserId = 1; // Начальное значение, если база пустая
        if (users) {
            const userIds = Object.values(users)
                .filter(u => u && u.ID_PersonalAccount)
                .map(u => parseInt(u.ID_PersonalAccount));
            UserId = userIds.length > 0 ? Math.max(...userIds) + 1 : 1;
        }
        // Генерация уникального ID для пользователя
        // Данные нового пользователя
        const userData = {
            Login: username,
            Password: signpass,
            Phone: phone,
            Email: email,
            ID_Post: parseInt(status), // Статус как число (1, 2 или 3)
            ID_PersonalAccount: UserId // Уникальный ID
        };

        // Сохранение пользователя в базу данных
        await set(ref(database, `Authorization/${UserId}`), userData);

        Swal.fire({
            icon: "success",
            title: "Готово",
            text: "Регистрация пройдена успешно",
        });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Произошла ошибка при регистрации",
        });
    }
  }
  async function loginUser() {
    // Получение email и пароля из формы
    const login = document.getElementById("loginlog").value;
    const password = document.getElementById("passwordlog").value;
    const status = document.getElementById("statuslog").value;

    // Простая валидация формы
    if (!login || !password ||!status) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Введите логин и пароль!",
          });
        return;
    }

    try {
        // Получение данных из коллекции "Authorization"
        const snapshot = await get(ref(database, 'Authorization'));
        const users = snapshot.val();

        // Фильтрация потенциальных пустых элементов
        const filteredUsers = Object.values(users).filter(u => u);

        // Поиск пользователя с соответствующим логином и паролем (без учета регистра)
        const user = filteredUsers.find(u => u.Login.toLowerCase() === login.toLowerCase() 
        && u.Password === password && u.ID_Post === parseInt(status));

        if (user) {
            // Сохранение данных пользователя в localStorage
            localStorage.setItem('userID', user.ID_PersonalAccount);
            localStorage.setItem('userEmail', login);
            // Проверка, является ли пользователь администратором
            const isAdmin = user.ID_Post === 1;
            // Проверка, является ли пользователь тренером
            const isCoach = user.ID_Post === 3;

            if (isAdmin) {
                // Перенаправление на страницу администратора
                window.location.href = 'database.html';
            } else if (isCoach) {
                // Перенаправление на страницу тренера
                window.location.href = 'index.html';
            } else {
                // Перенаправление на страницу спортсмена
                window.location.href = 'index.html';
            }
        } else {
            // Пользователь не найден или неверный email/пароль
            console.error('Ошибка при получении данных пользователя');
            Swal.fire({
                icon: "error",
                title: "Ошибка...",
                text: "Неверный логин или пароль",
              });
        }
    } catch (error) {
        // Обработка ошибок при получении данных пользователя
        console.error('Ошибка при получении данных пользователя:', error);
    }
}

// Добавление слушателя события click к кнопке входа
document.getElementById('signupbutton').addEventListener('click', signupUser);
document.getElementById('loginbutton').addEventListener('click', loginUser);