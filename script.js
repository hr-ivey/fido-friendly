var apiKey = "2bc1604f";

function getMovie(searchTerm) {
    return fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${searchTerm}`)
        .then(response => response.json());
};

function loadMovieDetails(data) {
    $("#plot").empty().append(data.Plot);
    $("#rated").empty().append(data.Rated);
    $("#ratings").empty().append(data.imdbRating);
    $("#poster img").attr("src", data.Poster);
}


$("#searchForm").on("submit", async function(e) {
    e.preventDefault();

    var searchTerm = $("#searchBox").empty().val();
    var movie = await getMovie(searchTerm);

    loadMovieDetails(movie);
    console.log(movie);
});