const moviesRef = firebase.database().ref("movies");
const apiKey = "token";

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




//PETICIÓN AJAX
function getMovieData (title) {
    // Retornar datos
    const url = `http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`
    return fetch(url).then(res => res.json())
}



const filmSelector = document.getElementById('movies');
const titleSelector = document.getElementById('title');



//Eventos 
moviesRef.on("value", data => {
    const filmData = data.val()
    console.log("data: ", filmData)

    let htmlFinal = "";

    for( const key in filmData){
        if(filmData.hasOwnProperty(key)) {
            const element = filmData[key];
            htmlFinal += `<li>${element.Title}</li>`
            
        }
    }
    filmSelector.innerHTML = htmlFinal;
})


titleSelector.addEventListener("keyup", event => {
    const titleContent = titleSelector.value.trim();
    if(event.keyCode === 13 && titleContent){
        console.log("ahora si", titleContent)
        getMovieData(titleContent).then(addMovie)

    }
})