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






var hostUrl = 'https://enigmatic-citadel-24557.herokuapp.com/'
var dddUrl = 'https://www.doesthedogdie.com/dddsearch?q='

function fetchMovie(){

    fetch(hostUrl + dddUrl + "old%20yeller",{
    headers: {
        Accept: 'application/json',
        'X-API-KEY': '62c08a52331c1b494657c5fada8c179c',
            },
    })
        .then(function (res) {
        console.log(res);
        return res.json();
        })
        .then(function (data) {
        console.log(data);
        console.log (data.items[0].id)
        fetchDog(data.items[0].id)
    
    });
    }
    
    function fetchDog(id) {
        var mediaUrl = 'https://www.doesthedogdie.com/media/'
    
        fetch(hostUrl + mediaUrl + id, {
        headers: {
                Accept: 'application/json',
                'X-API-KEY': '62c08a52331c1b494657c5fada8c179c',
                    },
            })
        .then(function (res) {
        console.log(res);
        return res.json();
        })
        .then(function (data) {
        console.log(data); 
        });
    }
    
    
    console.log(encodeURI("old yeller"));
    
    fetchMovie();