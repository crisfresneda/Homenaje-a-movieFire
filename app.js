const moviesRef = firebase.database().ref("movies");
const apiKey = "tu token";

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

function showDetails(data) {
    detailsSelector.style.display = "block";
    detailsSelector.innerHTML = `<pre><code>${JSON.stringify(data, null, 4)}</code></pre>`
}



const filmSelector = document.getElementById('movies');
const titleSelector = document.getElementById('title');
const detailsSelector = document.getElementById('details');


// Eventos 
moviesRef.on("value", data => {
    const filmData = data.val()
    console.log("data: ", filmData)

    let htmlFinal = "";

    for( const key in filmData){
        if(filmData.hasOwnProperty(key)) {
            const element = filmData[key];
            htmlFinal += `<li data-id="${key}">
                            ${element.Title}
                            <button data-action="details">Detalles</button>
                            <button data-action="edit">Editar</button>
                            <button data-action="delete">Borrar</button>
                          </li>`
            
        }
    }
    filmSelector.innerHTML = htmlFinal;
})

filmSelector.addEventListener("click", event => {
    const target = event.target;
    if(target.nodeName === "BUTTON" ) {
        const action = target.dataset.action;
        const id = target.parentNode.dataset.id;
        // console.log(action);  
        if(action === "details"){
            getMovieDetails(id).then(showDetails)
            console.log('details'); 
        } else if( action === "edit"){
            const newTitle = prompt("dime nuevo título").trim();
            if (newTitle){
                getMovieData(newTitle).then( moviewDetails => updateMovie(id, moviewDetails))

                
                
            }
        } else if (action === "delete"){
            if( confirm("estás seguro?")){
                deleteMovie(id)
            }
            
            //console.log('delete'); 
        }
    }
    
})

titleSelector.addEventListener("keyup", event => {
    const titleContent = titleSelector.value.trim();
    if(event.keyCode === 13 && titleContent){
        console.log("ahora si", titleContent)
        getMovieData(titleContent).then(addMovie)

    }
})