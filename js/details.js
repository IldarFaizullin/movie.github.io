document.addEventListener('DOMContentLoaded', () => {
    const movieData = JSON.parse(localStorage.getItem("selectedMovie"));
    const container = document.getElementById("movie-details");
    
    if(!movieData) {
        container.innerHTML = "<h3>Фильм не найден</h3>";
        return;
    }

    container.innerHTML = `
        <h1>${movieData.title}</h1>
        <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" 
             alt="${movieData.title}" 
             class="movie-poster">
        <div class="movie-info">
            <p>${movieData.overview}</p>
            <p>Рейтинг: ⭐${movieData.vote_average}/10</p>
            <p>Дата выхода: ${movieData.release_date}</p>
        </div>
    `;
});