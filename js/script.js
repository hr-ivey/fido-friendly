var apiKey = "2bc1604f";
var hostUrl = 'https://enigmatic-citadel-24557.herokuapp.com/';
var dddUrl = 'https://www.doesthedogdie.com/dddsearch?q=';
var dropEl = document.getElementById("dropdown");
var dogAnsEl = document.getElementById("dog-answer");
var dogIconEl = document.getElementById("dog-icon");
var movieArray = [];

async function getMovie(searchTerm) {
    return await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${searchTerm}`)
        .then(response => response.json());
};

function loadMovieDetails(movie, dog) {
    $("#movieTitle").empty().append(movie.Title);
    $("#synopsis").empty().append(movie.Plot);
    $("#rated").empty().append(movie.Rated);
    $("#rating").empty().append(movie.imdbRating);
    $("#poster").attr("src", movie.Poster);
    $("#releaseDate").empty().append(movie.Released);
    $("#genre").empty().append(movie.Genre);
    $("#runtime").empty().append(movie.Runtime);

    var yes = dog.topicItemStats[0].yesSum;
    var no = dog.topicItemStats[0].noSum;

    dogAnsEl.setAttribute("class", "");
    dogIconEl.setAttribute("class", "");

    if (yes == no) {
        dogAnsEl.classList.add("dog-unknown");
        dogAnsEl.innerHTML = "Our all-knowing eye is on the fritz. We aren't sure about this one. "; 
        dogIconEl.classList.add("fas", "fa-question-circle", "dog-unknown");
    } else if (yes > no) {
        dogAnsEl.classList.add("dog-unsafe");
        dogAnsEl.innerHTML = "Unfortunately, Fido doesn't make it. Better avoid this one. ";
        dogIconEl.classList.add("fas", "fa-sad-tear", "dog-unsafe");
    } else {
        dogAnsEl.classList.add("dog-safe");
        dogAnsEl.innerHTML = "Your pupper is safe! Watch freely. ";
        dogIconEl.classList.add("fas", "fa-dog", "dog-safe");
    };
}

$("#searchBtn").on("click", async function(e) {
    e.preventDefault();

    var searchTerm = $("#searchBox").val();

    var didDogDieMovie = await fetchMovie(searchTerm);
    var movie = await getMovie(searchTerm);
    var dog = await fetchDog(didDogDieMovie.items[0].id);

    loadMovieDetails(movie, dog);
    
    storeMovie(searchTerm);

    $("#searchResults").removeClass("hidden");
});

function storeMovie (movie) {
    if (!movieArray.includes(movie)) {
        movieArray.push(movie);
        localStorage.setItem("search-history", JSON.stringify(movieArray));
    }
    checkArray();
}

function checkArray(){
    var storedMovies = localStorage.getItem("search-history");
    if (storedMovies) {
        movieArray = JSON.parse(storedMovies);
    }
    renderSearchList();
}

function renderSearchList() {
    dropEl.innerHTML = "";

    for (var i = movieArray.length - 1; i >= 0; i--) {
        var liEl = document.createElement('li');
        liEl.classList.add('dropdown-item');
        liEl.textContent = movieArray[i];
        dropEl.append(liEl);
    }
}

async function fetchMovie(titleEncoded){
    return await fetch(hostUrl + dddUrl + encodeURI(titleEncoded), {
        headers: {
            Accept: 'application/json',
            'X-API-KEY': '62c08a52331c1b494657c5fada8c179c',
        },
    })
    .then(res => res.json());
}
    
async function fetchDog(id) {
    var mediaUrl = 'https://www.doesthedogdie.com/media/'
    
    return fetch(hostUrl + mediaUrl + id, {
        headers: {
            Accept: 'application/json',
            'X-API-KEY': '62c08a52331c1b494657c5fada8c179c',
        },
    })
    .then(res => res.json());
}

function doesDog(data) {
    var yes = data.topicItemStats[0].yesSum;
    var no = data.topicItemStats[0].noSum;

    dogAnsEl.setAttribute("class", "");
    dogIconEl.setAttribute("class", "");

    if (yes == no) {
        dogAnsEl.classList.add("dog-unknown");
        dogAnsEl.innerHTML = "Our all-knowing eye is on the fritz. We aren't sure about this one. "; 
        dogIconEl.classList.add("fas", "fa-question-circle", "dog-unknown");
    } else if (yes > no) {
        dogAnsEl.classList.add("dog-unsafe");
        dogAnsEl.innerHTML = "Unfortunately, Fido doesn't make it. Better avoid this one. ";
        dogIconEl.classList.add("fas", "fa-sad-tear", "dog-unsafe");
    } else {
        dogAnsEl.classList.add("dog-safe");
        dogAnsEl.innerHTML = "Your pupper is safe! Watch freely. ";
        dogIconEl.classList.add("fas", "fa-dog", "dog-safe");
    };
}

checkArray();