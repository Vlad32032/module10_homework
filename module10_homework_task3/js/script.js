/*  Создаем переменные  */

// сохраняем в переменную url эхо-сервера
const url = "wss://echo-ws-service.herokuapp.com/"

// сохраняем в переменную ноду для кнопки "Отправить"
const buttonMail = document.querySelector(".button_mail");
// сохраняем в переменную ноду для кнопки "Гео-локация"
const buttonGeo = document.querySelector(".button_geo");
// сохраняем в переменную ноду для input
const input = document.querySelector(".input");
// сохраняем в переменную ноду для контейнера с сообщениями
const messageWrapper = document.querySelector(".message_wrapper");

// создаем пустые переменные для сообщения с геолокацией и ссылки на карту в которые добавим ноды для вновь созданных сообщений
let statusGeo = "";
let mapLink = "";

/*  Устанавливаем соединение с сервером  */

// создаем новый объект websocket и передаем в него url эхо-сервера
// таким образом мы устанавливаем соединение с сервером
let websocket = new WebSocket(url);

// метод который будет вызван при установлении соединения с сервером
websocket.onopen = function(evt) {
    console.log("CONNECTED");
};
// метод который будет вызван при отключении соединения с сервером
websocket.onclose = function(evt) {
    console.log("DISCONNECTED")
};
// метод который будет вызван при оправки сообщения на сервер
websocket.onmessage = function(evt) {
    // добавляем входящее сообщение с контентом возвращенным с сервера
    messageWrapper.innerHTML += `<p class="message out_message">${evt.data}</p>`;
};
// метод который будет вызван при ошибке соединения с сервером
websocket.onerror = function(evt) {
    console.log("ERROR");
};

/*  Объявляем функции  */

// функция успешного запроса гео-локации 
function success(position) {
    // добавляем сообщение в чат со ссылкой
    messageWrapper.innerHTML += `<a class="message in_message map_link" target="_blank" href=""></a>`
    // сохраняем в переменную ноду для сообщения с геолокацией и ссылкой
    mapLink = document.querySelector(".map_link");
    statusGeo = document.querySelector(".status");

    // создаем переменные для широты и долготы
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // добавляем контент в текст сообщения 
    statusGeo.textContent = `Широта: ${latitude}, Долгота: ${longitude}.`;
    // добавлеям в тег <a> ссылку на карту
    mapLink.href = `https://www.openstreetmap.org/#map=17/${latitude}/${longitude}`;
    // добавлеям в тег <a> текст
    mapLink.textContent = "Ссылка на карту";

    // удаляем классы из сообщения, что-бы .querySelector не находил эти сообщения при создании новых
    statusGeo.classList.remove("status");
    mapLink.classList.remove("map_link");
};

// функция невыполенного запроса гео-локации
function error() {
    // выводим в сообщение текст ошибки
    statusGeo.textContent = "Невозможно получить ваше местоположение";

    // удаляем класс из сообщения, что-бы .querySelector не находил это сообщение при создании нового
    statusGeo.classList.remove("status");
};

/*  Добавляем обработчики для кнопок  */

// добавляем обработчик для кнопки "Отправить"
buttonMail.addEventListener("click", () => {
    // созаем переменную и добавляем в нее зачение из Input
    const message = input.value;
    // добавляем новое исходящее сообщение с текстом из Input
    messageWrapper.innerHTML += `<p class="message in_message">${message}</p>`;
    // отправляем запрос на сервер с помощью метода .send аргумент которого зачение из Input
    websocket.send(message);
    // после успешного выполения запроса должен сработать метод websocket.onmessage и вывести исходящее сообщение с текстом который вернул сервер
});

// добавляем обработчик для кнопки "Гео-локация"
buttonGeo.addEventListener("click", () => {
    // очищаем переменные если до этого они были заполненны 
    statusGeo = "";
    mapLink = "";

    // добавляем сообщение в чат 
    messageWrapper.innerHTML += `<p class="message in_message status"></p>`
    // сохраняем в переменную ноду для сообщения с геолокацией 
    statusGeo = document.querySelector(".status");

    // проверяем поддерживается ли браузером geolocation
    if (navigator.geolocation) {
        // выводим в сообщение текст который будет виден пока не выполниться .getCurrentPosition
        statusGeo.textContent = "Определение местоположения...";
        //вызываем метод .getCurrentPosition и передаем в него функции success и error как аргументы для успешного и не успешного выполения функции
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        // выводим в сообщение текст ошибки
        statusGeo.textContent = "Geolocation не поддерживаеться вашим браузером.";
    }
});