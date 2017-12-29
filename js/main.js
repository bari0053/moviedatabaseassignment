// main.js

let app = {
    URL: 'http://api.themoviedb.org/3/',
    imageURL: "https://image.tmdb.org/t/p/w300/",
    currentlyActive: null,
    init: function () {
        document.getElementById('search-input').focus();
        setTimeout(app.addHandlers, 1111);
    },
    addHandlers: function () {
        let btnSearch = document.getElementById('search-button');
        btnSearch.addEventListener('click', app.runSearch);
        document.addEventListener('keypress', function (ev) {
            let char = ev.char || ev.charCode || ev.which;
            let str = String.fromCharCode(char);
            console.log(str, str);
            if (char == 10 || char == 13) {
                btnSearch.dispatchEvent(new MouseEvent('click'));
                }
        let btnBack = document.getElementById('back-button');
            btnBack.addEventListener('click',app.goBack);
        });
    },
    
    
    goBack: function(ev){
    if (currentlyActive == 'search') {
      window.location.reload(true);
    } else {
      app.runSearch(ev);
    }
        
    },
    runSearch: function (ev) {
        console.log(ev.type);
        ev.preventDefault();
        let input = document.getElementById('search-input');
        if (input.value) {
            let url = app.URL + "search/movie?api_key=" + KEY + "&query=" + input.value;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    app.showMovies(data);

                })
                .catch(err => {
                    console.log(err)
                })
        }else {
            let alert = document.getElementById('text');
            alert.textContent = 'Please write something.';
        }
    },
    showMovies: function (movies) {
        let container = document.querySelector('#search-results .content');
        currentlyActive = 'search';
        window.scrollTo(0, 0);
        document.querySelector('#search-results').classList.add('active');
        document.querySelector('#recommend-results').classList.remove('active');
        let df = document.createDocumentFragment('div');
        container.innerHTML = "";
        movies.results.forEach(function (movie) {
            let div = document.createElement('div');
            let h2 = document.createElement('h2');
            let p = document.createElement('p');
            let img = document.createElement('img');
            let date = document.createElement('p');
            date.textContent = "Release date: " + movie.release_date;
            div.classList.add('card');
            div.appendChild(h2);
            div.appendChild(date);
            div.appendChild(img);
            div.appendChild(p);
            h2.textContent = movie.title;
            h2.classList.add('movie');
            h2.setAttribute('data-movie', movie.id);
            h2.addEventListener('click', app.getRecommended);
            p.textContent = movie.overview;
            img.src = app.imageURL + movie.poster_path;
            img.classList.add('wrap');
            img.alt = "Poster for " + movie.title + " is unavailable";;
            df.appendChild(div);
        });
        container.appendChild(df);
        let X = movies.total_results;
        let p = document.getElementById('text');
        p.textContent = "You have " + X + " results.";
    },
    getRecommended: function (ev) {
        let id = ev.target.getAttribute('data-movie');
        let url = `${app.URL}movie/${id}/recommendations?api_key=${KEY}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                app.showRecommended(data);
            })
            .catch(err => {
                console.log(err)
            })
    },
    showRecommended: function (movies) {
        window.scrollTo(0, 0);
        currentlyActive = 'results';
        let container = document.querySelector('#recommend-results .content');
        container.innerHTML = "";
        let text = document.querySelector('#recommend-results .title');
        text.innerHTML = "";
        document.querySelector('#search-results').classList.remove('active');
        document.querySelector('#recommend-results').classList.add('active');
        let df = document.createDocumentFragment('div');
        container.innerHTML = "";
        movies.results.forEach(function (movie) {
            let div = document.createElement('div');
            div.id = "card";
            let h2 = document.createElement('h2');
            let p = document.createElement('p');
            let img = document.createElement('img');
            let date = document.createElement('p');
            div.classList.add('card');
            div.appendChild(h2);
            div.appendChild(date);
            div.appendChild(img);
            div.appendChild(p);
            h2.textContent = movie.title;
            h2.classList.add('movie');
            h2.setAttribute('data-movie', movie.id);            
            date.textContent = "Release date: " + movie.release_date;
            p.textContent = movie.overview;
            img.src = app.imageURL + movie.poster_path;
            h2.addEventListener('click', app.getRecommended);
            df.appendChild(div);
        });   
            let X = movies.total_results;
            let t = document.createElement('p');
            t.textContent = "You have " + X + " recommendations.";
            text.appendChild(t);
           container.appendChild(df);
    },
}
document.addEventListener('DOMContentLoaded', app.init)