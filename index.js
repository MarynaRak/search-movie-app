const inputNode = document.getElementById('input');
const searchBtnNode = document.getElementById('search-btn');
const searchResultNode = document.getElementById('search-result');
const emptyMovieItem = document.getElementById('empty-movie-item');
const movieCardNode = document.getElementById('movie-page');
const mainPageListNode = document.getElementById('main-page');
const homeLinkBtn = document.getElementById('home-link-btn');

const userKey = '52a620ae';

searchBtnNode.addEventListener('click', getMovieNameFromUser);

function getMovieNameFromUser(event) {
    event.preventDefault();

    const movieName = inputNode.value.trim();
    if (movieName.length == 0) {
        alert('Введіть назву фільму');
        return
    }
    LoadMovies(movieName)
}

async function LoadMovies(movieName) {
    if (!movieName) { return };

    const url = `https://www.omdbapi.com/?s=${movieName}&page=1&apikey=${userKey}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    if (data.Response == "True") {
        renderMovieList(data)
    }
    else {
        emptyMovieItem.classList.add('empty-movie-item');
    }
}

function renderMovieList(data) {

    emptyMovieItem.classList.remove('empty-movie-item');
    data.Search.forEach((movie) => {

        let movieItem = document.createElement('li');
        movieItem.classList.add('movie-item');
        movieItem.setAttribute('id', `${movie.imdbID}`);


        movieItem.innerHTML = `
                <img src="${movie.Poster}" alt="Постер к фильму" class="movie-item-img">
                <div class="movie-item-info">
                <h2 class="movie-item-title">${movie.Title}</h2>
                <p class="movie-item-year">${movie.Year}</p>
                <p class="movie-item-description">${movie.Type}</p>
                </div>
            `;

        searchResultNode.appendChild(movieItem);
    })

    loadMovieDetails();
}

function loadMovieDetails() {
    const searchResultList = searchResultNode.querySelectorAll('.movie-item');

    searchResultList.forEach(movie => {
        movie.addEventListener('click', async () => {
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.getAttribute('id')}&apikey=${userKey}`);
            const movieDetailsResult = await result.json();
            // console.log(movieDetails)
            renderMovieDetails(movieDetailsResult)
            mainPageListNode.classList.add('main-page');
            movieCardNode.classList.remove('movie-page');
        })
    });
}

function renderMovieDetails(details) {
    let movieDetails = document.createElement('div');
    movieDetails.classList.add('cont');

    movieDetails.innerHTML = `<button id="home-link-btn" onclick="backToMainPage()" class="home-link"> ← Назад до пошуку</button>
    <div class="movie-card-container">
        <img class="movie-poster" src="${details.Poster}" alt="Постер фильму" />
        <div class="movie-info-wrapper">
        <h2 class="movie-title">${details.Title}</h2>
        <ul class="movie-info">
            <li class="year">Год: <span>${details.Year}</span></li>
            <li class="rating">Рейтинг: <span>${details.Rated}</span></li>
            <li class="released">Дата виходу: <span>${details.Released}</span></li>
            <li class="duration">Тривалість: <span>${details.Runtime}</span></li>
            <li class="genre">Жанр: <span>${details.Genre}</span></li>
            <li class="director">Режисер: <span>${details.Director}</span></li>
            <li class="script">Сценарій: <span>${details.Writer}</span></li>
            <li class="actors">Актори: <span>${details.Actors}</span></li>
        </ul>
        </div>
    </div>
    <p class="movie-description">
      ${details.Plot}
    </p>`

    movieCardNode.appendChild(movieDetails);
}


function backToMainPage() {
    mainPageListNode.classList.remove('main-page');
    movieCardNode.classList.add('movie-page');
}

