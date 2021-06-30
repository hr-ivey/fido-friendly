var apiKey = "2bc1604f";

function getMovie(searchTerm) {
    return fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${searchTerm}`)
        .then(response => response.json());
};

function loadMovieDetails(data) {
    $("#movieTitle").empty().append(data.Title);
    $("#synopsis").empty().append(data.Plot);
    $("#rated").empty().append(data.Rated);
    $("#rating").empty().append(data.imdbRating);
    $("#poster").attr("src", data.Poster);
    $("#releaseDate").empty().append(data.Released);
    $("#genre").empty().append(data.Genre);
    $("#runtime").empty().append(data.Runtime);
    console.log(data);
}


$("#searchBtn").on("click", async function(e) {
    e.preventDefault();

    var searchTerm = $("#searchBox").val();
    var movie = await getMovie(searchTerm);

    loadMovieDetails(movie);

    $("#searchResults").removeClass("hidden");
});