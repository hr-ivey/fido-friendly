var apiKey = "2bc1604f";
var hostUrl = 'https://enigmatic-citadel-24557.herokuapp.com/';
var movieArray = [];

// When search button clicked, several functions with fetches are run async so that all the necessary data from each function is fully gathered before the functions are called to generate is information on the page.
$("#searchBtn").on("click", async function (e) {
    e.preventDefault();

    var searchTerm = $("#searchBox").val();

    var didDogDieMovie = await fetchMovie(searchTerm);
    var movie = await getMovie(searchTerm);
    var dog = await fetchDog(didDogDieMovie.items[0].id);

    loadMovieDetails(movie, dog);

    storeMovie(searchTerm);

    $("#searchResults").removeClass("hidden");
});
// Adds additional event listener to "search" area so that user may press enter key in order to call search as well.
$(".input-search").on('keyup', async function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        var searchTerm = $("#searchBox").val();
        var searchTerm = $("#searchBox").val();
        var didDogDieMovie = await fetchMovie(searchTerm);
        var movie = await getMovie(searchTerm);
        var dog = await fetchDog(didDogDieMovie.items[0].id);

        loadMovieDetails(movie, dog);

        storeMovie(searchTerm);

        $("#searchResults").removeClass("hidden");
    }
});
// Event listener for items in the dropdown that basically calls all the same functions as the "search" event listener, except for "storeMovie" which is unnecessary since the movie clicked on is already stored.
$(document).on("click", "#dropdown li", async function (e) {

    var searchTerm = e.target.innerText;

    var didDogDieMovie = await fetchMovie(searchTerm);
    var movie = await getMovie(searchTerm);
    var dog = await fetchDog(didDogDieMovie.items[0].id);

    loadMovieDetails(movie, dog);

    $("#searchResults").removeClass("hidden");
});
// Called on page load. Checks local storage for items and parses them into empty "movie array" if they are available before calling renderSearchList.
function checkArray() {
    var storedMovies = localStorage.getItem("search-history");
    if (storedMovies) {
        movieArray = JSON.parse(storedMovies);
    }
    renderSearchList();
}
// Creates list elements within the "Search History" dropdown generated from the movieArray taken from local storage.
function renderSearchList() {
    var dropEl = document.getElementById("dropdown");
    dropEl.innerHTML = "";

    for (var i = movieArray.length - 1; i >= 0; i--) {
        var liEl = document.createElement('li');
        liEl.classList.add('dropdown-item');
        liEl.textContent = movieArray[i];
        dropEl.append(liEl);
    }
}
// Called when "search" is clicked or enter button is clicked. This makes the API call to "OMDB" in order to get the data for the movie information.
async function getMovie(searchTerm) {
    return await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${searchTerm}`)
        .then(response => response.json());
};
// Called when "search" is clicked or enter button is clicked. This makes the initial API call to "Does the Dog Die" with the movie title and gathers the data from this call needed to make the media call for the info needed.
async function fetchMovie(titleEncoded) {
    var dddMovieUrl = 'https://www.doesthedogdie.com/dddsearch?q=';

    return await fetch(hostUrl + dddMovieUrl + encodeURI(titleEncoded), {
        headers: {
            Accept: 'application/json',
            'X-API-KEY': '62c08a52331c1b494657c5fada8c179c',
        },
    })
        .then(res => res.json());
}
// Called when "search" is clicked or enter button is clicked. This makes the second API call to "Does the Dog Die" using the movie ID gathered from the initial call in order to get information on the fate of dogs in the movie.
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
// Once the calls have been made, this loads all the information from the calls into their proper places after first emptying the elements so that information is not added onto the end of previous searches. Dog information (numbers of "yes's" and "no's" voted on sire) is run through a quick "if-else" statement that determines what answer should be given for the doggie's fate.
function loadMovieDetails(movie, dog) {
    var dogAnsEl = document.getElementById("dog-answer");
    var dogIconEl = document.getElementById("dog-icon");

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
// Called when "search" is clicked or enter button is clicked. This checks if the movie title searched for is already represented in the movie array, and if not, it adds it to local storage before running the "checkArray" function again to go through the process of adding it to the "Search History" dropdown.
function storeMovie(movie) {
    if (!movieArray.includes(movie)) {
        movieArray.push(movie);
        localStorage.setItem("search-history", JSON.stringify(movieArray));
    }
    checkArray();
}
// Calls "checkArray" function on page load in order to check for any content in Local Storage so it persists on refresh.
checkArray();