const apiKey = 'f1305fbd40cf4baf4741767e65b56053';

async function handleRecommendation() {
    const genre = document.getElementById("genre").value;
    const mood = document.getElementById("mood").value;
    const year = document.getElementById("year").value;

    // Формируем URL
    const yearFilter = year === "old" 
        ? "&primary_release_date.lte=2000" 
        : "&primary_release_date.gte=2000";
        
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}${yearFilter}`;

    try {
        // Запрос к API
        const response = await fetch(url);
        const data = await response.json();
        console.log("Ответ API:", data);

        if (!data.results || data.results.length === 0) {
            alert("Фильмы не найдены!");
            return;
        }

        // Фильтрация по настроению
        const filteredMovies = data.results.filter(movie => {
            if (mood === "funny") return movie.vote_average > 7;
            if (mood === "sad") return movie.vote_average < 5;
            return true;
        });

        if (filteredMovies.length === 0) {
            alert("Нет подходящих фильмов");
            return;
        }

        // Выбираем случайный фильм
        const randomMovie = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
        console.log("Выбран фильм:", randomMovie);

        // Сохраняем и переходим
        localStorage.setItem("selectedMovie", JSON.stringify(randomMovie));
        window.location.href = "details.html";

    } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка при загрузке данных");
    }

    if (filteredMovies.length > 0) {
        const movie = filteredMovies[0];
        const screenshots = await getMovieScreenshots(movie.id);
        
        const resultHTML = `
            <div class="movie-card">
                <h2>${movie.title}</h2>
                ${renderScreenshots(screenshots)}
                <p class="movie-overview">${movie.overview}</p>
            </div>
        `;
        
        document.getElementById('result').innerHTML = resultHTML;
    }
}

async function getMovieScreenshots(movieId) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`
        );
        const data = await response.json();
        return data.backdrops.slice(0, 5); // Берем первые 5 скриншотов
    } catch (error) {
        console.error("Ошибка загрузки скриншотов:", error);
        return [];
    }
}

function renderScreenshots(images) {
    if (!images || images.length === 0) {
        return '<p class="no-screenshots">Скриншоты не найдены 😞</p>';
    }
    
    return `
        <div class="screenshots-grid">
            ${images.map(img => `
                <img src="https://image.tmdb.org/t/p/w780${img.file_path}" 
                     alt="Кадр из фильма" 
                     loading="lazy"
                     class="screenshot">
            `).join('')}
        </div>
    `;
}