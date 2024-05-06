//Barra ricerca
function apriBarraRicerca(event){
    const image= event.currentTarget;
    const barra_chiusa = document.querySelector('nav');
    const barra_aperta = document.querySelector('nav2');
    barra_chiusa.classList.add('hidden');
    barra_aperta.classList.remove('hidden');
}

const cerca= document.getElementById('logo-ricerca');
cerca.addEventListener('click', apriBarraRicerca);


function chiudiBarraRicerca(event){
    const image= event.currentTarget;
    const barra_chiusa = document.querySelector('nav');
    const barra_aperta = document.querySelector('nav2');
    barra_aperta.classList.add('hidden');
    barra_chiusa.classList.remove('hidden');
}

const chiudi= document.getElementById('exit');
chiudi.addEventListener('click', chiudiBarraRicerca);



//Immagine dinamica
function immagineDinamica(event){
    const image = event.currentTarget;
    if (image.src.includes('ninesquared-kneepads-banner-mobile.jpg')) {
        image.src = 'home-2023-11.jpg';
    } else {
        image.src = 'ninesquared-kneepads-banner-mobile.jpg';
    }
}

const home = document.getElementById('img-header');
home.addEventListener('click', immagineDinamica);



//Bottone newsletter
function messaggioNewsletter(event){
    const bottone = event.currentTarget;
    let nuovoMessaggio = document.createElement('h5');
    nuovoMessaggio.textContent = 'Richiesta inviata!';
    let container = document.getElementById('dx-cf');
    container.appendChild(nuovoMessaggio);
    bottone.removeEventListener('click', messaggioNewsletter);
}

const bottoneNewsletter = document.getElementById('bottone-invia');
bottoneNewsletter.addEventListener('click', messaggioNewsletter);



// Apertura modale
function apriModale(event) {
    const image = event.currentTarget;
    let modChiusa = document.getElementById('modal-view');
    modChiusa.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

const imgAccount = document.getElementById('logo-account');
imgAccount.addEventListener('click', apriModale);



//Chiusura modale
function chiudiModale(event) {
    const image = event.currentTarget;
    let modAperta = document.getElementById('modal-view');
    modAperta.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

const exitModale = document.getElementById('modal-exit');
exitModale.addEventListener('click', chiudiModale);


// API Youtube
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'hkcj1g9RjO0',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}


//API Spotify

const APIController = (function() {
    
    const clientId = '5b439905906645a8aca4b4e7f7fd0761';
    const clientSecret = 'dbcd1aa4dbdd4333beed9a93d8679886';

    const ottieniToken = async () => {

        const risultato = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await risultato.json();
        return data.access_token;
    }
    
    const ottieniGenere = async (token) => {

        const risultato = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await risultato.json();
        return data.categories.items;
    }

    const ottieniPlaylist = async (token, IDGenere) => {

        const limite = 15;
        
        const risultato = await fetch(`https://api.spotify.com/v1/browse/categories/${IDGenere}/playlists?limit=${limite}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await risultato.json();
        return data.playlists.items;
    }

    const ottieniCanzoni = async (token, tracksEndPoint) => {

        const limite = 15;

        const risultato = await fetch(`${tracksEndPoint}?limit=${limite}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await risultato.json();
        return data.items;
    }

    const ottieniTraccia = async (token, trackEndPoint) => {

        const risultato = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await risultato.json();
        return data;
    }

    return {
        R_ottieniToken() {
            return ottieniToken();
        },
        R_ottieniGenere(token) {
            return ottieniGenere(token);
        },
        R_ottieniPlaylist(token, IDGenere) {
            return ottieniPlaylist(token, IDGenere);
        },
        R_ottieniCanzoni(token, tracksEndPoint) {
            return ottieniCanzoni(token, tracksEndPoint);
        },
        R_ottieniTraccia(token, trackEndPoint) {
            return ottieniTraccia(token, trackEndPoint);
        }
    }
})();


// Gestione Interfaccia Utente
const GestioneIU = (function() {

    const DOMElements = {
        scegliGenere: '#select_genre',
        scegliPlaylist: '#select_playlist',
        bottoneSubmit: '#btn_submit',
        DettagliTraccia: '#song-detail',
        Token: '#hidden_token',
        Tracce: '.song-list'
    }

    return {

        inputField() {
            return {
                genre: document.querySelector(DOMElements.scegliGenere),
                playlist: document.querySelector(DOMElements.scegliPlaylist),
                tracks: document.querySelector(DOMElements.Tracce),
                submit: document.querySelector(DOMElements.bottoneSubmit),
                songDetail: document.querySelector(DOMElements.DettagliTraccia)
            }
        },

        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.scegliGenere).insertAdjacentHTML('beforeend', html);
        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.scegliPlaylist).insertAdjacentHTML('beforeend', html);
        },

        createTrack(id, name) {
            const html =
             `
            <a href="#" class="lista-tracce" id="${id}">${name}</a></br>
            `;
            document.querySelector(DOMElements.Tracce).insertAdjacentHTML('beforeend', html);
        },

        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.DettagliTraccia);
            // elimino i dati della canzone cliccata precedentemente
            detailDiv.innerHTML = '';

            const html = 
            `
            <img src="${img}" id="img-traccia">        
            <div class="titolo-traccia">
                <label for="Genre"><strong>${title}</strong></label>
            </div>
            <div class="artista-traccia">
                <label for="artist"><em>${artist}</em></label>
            </div>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.Token).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.Token).value
            }
        }
    }
})();

const APPController = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField();

    const loadGenres = async () => {
        const token = await APICtrl.R_ottieniToken();       
        UICtrl.storeToken(token);
        const genres = await APICtrl.R_ottieniGenere(token);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    // event listener sul genere
    DOMInputs.genre.addEventListener('change', async () => {
        //resetto la playlist
        UICtrl.resetPlaylist();
        // prendo il token
        const token = UICtrl.getStoredToken().token;
        const genreSelect = UICtrl.inputField().genre;       
        // prendiamo l'ID del genere scelto
        const IDGenere = genreSelect.options[genreSelect.selectedIndex].value;             
        // prendiamo la playlist in base al genere
        const playlist = await APICtrl.R_ottieniPlaylist(token, IDGenere);       
        // crea una lista di playlist per ogni playlist ricevuta
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
     
    // creo un event listener al click del bottone submit
    DOMInputs.submit.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTracks();
        const token = UICtrl.getStoredToken().token;   
        const playlistSelect = UICtrl.inputField().playlist;
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        const tracks = await APICtrl.R_ottieniCanzoni(token, tracksEndPoint);
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });

    DOMInputs.tracks.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTrackDetail();
        const token = UICtrl.getStoredToken().token;
        const trackEndpoint = e.target.id;
        const track = await APICtrl.R_ottieniTraccia(token, trackEndpoint);
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });    

    return {
        init() {
            console.log('Avvio APP!');
            loadGenres();
        }
    }

})(GestioneIU, APIController);

// serve per caricare i generi
APPController.init();

function testoRicerca(event){
    const bottone = event.currentTarget;
    let testoAggiunto = document.createElement('h3');
    testoAggiunto.textContent = 'Ecco qualche canzone che ti potrebbe piacere:';
    let container = document.getElementById('form-spotify');
    container.appendChild(testoAggiunto);
    bottone.removeEventListener('click', zoom);
}

const bottoneSubmit = document.getElementById('btn_submit');
bottoneSubmit.addEventListener('click', testoRicerca);