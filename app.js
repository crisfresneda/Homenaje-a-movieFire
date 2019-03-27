const moviesRef = firebase.database().ref("movies");
const apiKey = "<--TU TOKEN -->";

// moviesRef.set(["hola",14 ,"fin"]);

// moviesRef.set({
//     title: "Hulk",
//     creationDate: new Date().getTime()
// });

// moviesRef.update({
//     title: "The Hulk",
//     description: "bla bla bla.."
// });

// CRUD (CREATE, READ, UPDATE, DELETE)

function addMovie (data) {
    return moviesRef.push(data)
}

function deleteMovie (id) {
    return moviesRef.child(id).remove()
}

function updateMovie (id, data) {
    return moviesRef.child(id).set(data)
}

function getMovieDetails(id) {  
    // Detalles de una película
    return new Promise ((resolve, reject) => {
        moviesRef.child(id).once("value", data => {
            resolve(data.val())
        })
    })
       
}

function getMovies() {
    // Listado de películas
    return moviesRef.on("value", data => {
        console.log("data: ", data.val())
    })
}


//PETICIÓN AJAX
function getMovieData (title) {
    // Retornar datos
    const url = `http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`
    return fetch(url).then(res => res.json())
}