console.log('Lets write JavaScript');
let currentSong = new Audio()
let songs;
let currFolder;

function secondsToMinuitesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`https://adarshsugandhe.github.io/${folder}/`)
    let response = await a.text()

    let div = document.createElement('div')
    div.innerHTML = response

    let as = div.getElementsByTagName('a')

    songs = []

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3") || (element.href.endsWith(".mp4a"))) {
            songs.push(element.href.split(`/${folder}/`)[1])
            // console.log(songs);
            
        }
    }


    // Show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML +
            `<li>
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Adarsh</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/playsong.svg" alt="">
                </div>
            </li>`;
    }
    


    // Attach an event Listener to the each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
        })

    });

    return songs
}

const playMusic = (track, pause = (false)) => {
    // let audio = new Audio("/songs/" + track)
    // console.log(track);

    // console.log(audio);

    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}
async function displayAlbums() {
    let a = await fetch(`https://adarshsugandhe.github.io/songs/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let anchor = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchor)
    for (let i = 0; i < array.length; i++) {
        const e = array[i];


        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            let a = await fetch(`https://adarshsugandhe.github.io/songs/${folder}/info.json`)
            let response = await a.json()
            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML +
                `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <img src="img/playsong.svg" alt="">
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="img">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`

        }
    }

    // Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            // console.log(item.currentTarget);
            playMusic(songs[0])
        })
    })


}


async function main() {
    // Get the list of all the songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)
    // console.log(songs); 
    // songs.forEach(so => {
    //     console.log(so);
    // });

    // Display all the albums on the page
    displayAlbums()


    // Attach an event Listener to play, next and prev
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/playsong.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinuitesSeconds(currentSong.currentTime)} / ${secondsToMinuitesSeconds(currentSong.duration)}`

        // Moving circle sick dot 
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listerer for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for the close button
    document.querySelector(".close-btn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener for prev and next buttons
    prev.addEventListener("click", () => {
        // console.log('Prev clicked');  

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(songs,index);

        if (index > 0) {
            playMusic(songs[index - 1])
        }
    }) 

    next.addEventListener("click", () => {
        // console.log('next clicked');  
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(songs,index);

        if (index < songs.length - 1) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to the range volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e);
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
        }

        else if (currentSong.volume == 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/volume.svg", "img/mute.svg")
        }

    })

    // Add an event listener to mute the volume
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // console.log("e.target");
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }

        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        }

    })



}

main()
