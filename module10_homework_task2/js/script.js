// сохраняем в переменную ноду для кнопки 
const button = document.querySelector(".j-button");

// создаем обработчик по клику для кнопки 
button.addEventListener("click", () => {
    // выводим размер экрана с учётом полосы прокрутки, где:
    // window.innerWidth - ширина;
    // window.innerHeight - высота;
    alert(`Размер экрана с учётом полосы прокрутки:
     ширина - ${window.innerWidth}px, высота - ${window.innerHeight}px`);
    // выводим размер экрана без учета полосы прокрутки, где:
    // document.documentElement.clientWidth - ширина;
    // document.documentElement.clientHeight - высота;
    alert(`Размер экрана без учёта полосы прокрутки:
    ширина - ${document.documentElement.clientWidth}px, высота - ${document.documentElement.clientHeight}px`)
});