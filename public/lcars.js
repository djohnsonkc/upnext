let backgroundSoundOn = false;
let muteComms = false;
let nameList = "Alex,Ben R,Ben W,Chris,Dan,Emily,Fiona,Grace,Hannah,Ian,James,Karen,Liam,Noah,Olivia,Parker,Quinn,Rachel";
let shuffledNamesList = [];
let selectedItems = [];
let buttonLinks = [];
let bridgeAudio;
let buttonBridge;
let buttonMuteComms;
let count = 1;
let soundNdx = 0;

// Courtesy of LCARS 
const colors = ["african-violet", "blue", "bluey", "gold", "green", "ice", "lilac", "magenta", "mars", "moonlit-violet", "orange", "peach", "red", "sky", "space-white", "sunflower", "tomato", "violet-creme", "cardinal", "cool", "evening", "galaxy", "ghost", "honey", "martian", "midnight", "moonbeam", "moonshine", "pumpkinshade", "roseblush", "tangerine", "wheat"]

// Courtesy of https://www.trekcore.com/audio/
const soundNames = [
    "computerbeep_51.mp3",
    "computerbeep_17.mp3",
    "computerbeep_40.mp3",
    "computerbeep_55.mp3",
    "computerbeep_58.mp3",
    "computerbeep_60.mp3",
    "computerbeep_63.mp3",
    "computerbeep_66.mp3",
    "computerbeep_67.mp3",
    "computerbeep_7.mp3",
    "processing.mp3",
    "computer_work_beep.mp3",
    "computerbeep_14.mp3",
];


window.addEventListener('DOMContentLoaded', event => {

    buildListOfNames();

    bridgeAudio = new Audio('sounds/tng_bridge_1.mp3');
    bridgeAudio.loop = true;

    // Button controls
    buttonBridge = document.getElementById('btn-bridge');
    buttonBridge.addEventListener('click', () => {
        if (!backgroundSoundOn) {
            buttonBridge.innerText = "BRIDGE SOUND OFF";
            bridgeAudio.play();
        }
        else {
            buttonBridge.innerText = "BRIDGE SOUND ON";
            bridgeAudio.pause()
        }
        backgroundSoundOn = !backgroundSoundOn; // toggle
    });

    const buttonRestart = document.getElementById('btn-restart');
    const buttonNext = document.getElementById('btn-hail-next');
    // const buttonSound1 = document.getElementById('btn-sound1');
    // const buttonSound2 = document.getElementById('btn-sound2');
    buttonMuteComms = document.getElementById('btn-mute-comms');
    buttonNext.addEventListener('click', (e) => {
        e.preventDefault();
        selectRandomLink();
        // playAudioOnce('sounds/computerbeep_67.mp3')
    });
    buttonMuteComms.addEventListener('click', (e) => {
        e.preventDefault();

        if (!muteComms) {
            buttonMuteComms.innerText = "COMMS SOUND ON";
        }
        else {
            buttonMuteComms.innerText = "COMMS SOUND OFF";
            playAudioOnce('sounds/computer_work_beep.mp3')
        }

        muteComms = !muteComms;


    });

    buttonRestart.addEventListener('click', (e) => {
        e.preventDefault();
        playAudioOnce('sounds/tng_viewscreen_off.mp3')
        selectedItems = [];
        buildListOfNames();

        const selectedName = document.getElementById('selected-name');
        selectedName.innerText = 'CREW ON DECK'
        const ict = document.getElementById('incoming-transmission');
        // ict.style.visibility = "hidden";
        ict.innerText = "Use Hail Next or select a crew member."
    });

});


// the Fisher-Yates (aka Knuth) Shuffle algorithm vs Math.random
// For a more reliable random shuffle, the Fisher-Yates (aka Knuth) Shuffle algorithm is recommended. 
// It ensures every possible permutation of the array has an equal chance of being produced.
function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildListOfNames() {
    console.log("names", nameList)
    const namesContainer = document.getElementById('name-list-container');
    // clear incase we are reloading
    namesContainer.innerHTML = ''

    // get ?names= param, if exists. Otherwise, use the default nameList
    const urlParams = new URLSearchParams(window.location.search);
    const namesListParam = urlParams.get('names');
    if (namesListParam) {
        nameList = namesListParam;
    }

    // create array and shuffle the order...
    // convert to uppercase so that it can be matched later when clicked/unclicked manually
    const names = nameList.split(',').map(name => name.toUpperCase());
    shuffledNamesList = fisherYatesShuffle(names);
    let color = ''
    shuffledNamesList.forEach(function (name, ndx) {
        // If name list is longer than color array, we'll have a runtime error
        if (ndx >= colors.length) {
            color = colors[colors.length - 1]
        }
        else {
            color = colors[ndx];
        }
        let newndx = ndx + 1;
        let ndxDisplay = newndx.toString().padStart(2, '0')
        namesContainer.innerHTML += `<a href='#' class='${color}'>${name}:${ndxDisplay}</a>`
    })

    // hook up a click handler for each link
    buttonLinks = document.querySelectorAll('.buttons a');
    // Attach the click event listener to each <a> tag
    buttonLinks.forEach(link => {
        link.addEventListener('click', handleNameClick);
    });
}



function playAudioOnce(filePath, volumeLevel) {

    const audio = new Audio(filePath);

    // Ensure volume is within valid range
    if (volumeLevel) {
        audio.volume = Math.max(0, Math.min(volumeLevel, 1)); // Clamp between 0 and 1
    }

    audio.play()
        .then(() => {
            //console.log('Audio is playing ' + filePath);
        })
        .catch(error => console.error('Error playing audio:', error));
    // Automatically clean up the audio after playback
    audio.onended = () => {
        //console.log('Audio playback finished');
    };
}


function updateSelectedNameDisplay(link) {
    const name = link.innerText;
    // console.log("name", name, shuffledNamesList)
    const selectedName = document.getElementById('selected-name');
    const index = shuffledNamesList.indexOf(name) + 1;
    selectedName.innerText = name

    const ict = document.getElementById('incoming-transmission');
    if (selectedItems.length === shuffledNamesList.length) {
        ict.innerHTML = `Transfer Complete`
    }
    else {
        ict.innerHTML = `Incoming transmission from ${name}`
    }

    ict.classList.add('blink-custom')
    setTimeout(() => {
        ict.classList.remove('blink-custom')
    },1000)
}

// Function to select a random link
function selectRandomLink() {

    // Filter out previously selected items from the list
    const availableLinks = Array.from(buttonLinks).filter(link => !selectedItems.includes(link));

    if (availableLinks.length > 0) {
        // Get a random index between 0 and the length of availableLinks
        const randomIndex = Math.floor(Math.random() * availableLinks.length);
        const selectedLink = availableLinks[randomIndex];
        selectedLink.classList.add('selected');
        updateSelectedNameDisplay(selectedLink)
        // Add the selected link to the list of previously selected items
        selectedItems.push(selectedLink);
    } else {
        console.log('All items have been selected.');
    }

    playNextSound()


}

// Function to handle the click event
function handleNameClick(event) {

    event.preventDefault();
    const clickedLink = event.target;

    // for now, let's make sure the user hears the sounds when manually selecting people
    muteComms = false;
    buttonMuteComms.innerText = "COMMS SOUND OFF";

    const found = selectedItems.find((link) => link.innerText === clickedLink.innerText);
    // console.log("found", found?.innerText, '=', clickedLink.innerText)
    if (found) {
        clickedLink.classList.remove('selected')
        selectedItems = Array.from(selectedItems).filter((link) => link.innerText !== clickedLink.innerText);
    }
    else {
        clickedLink.classList.add('selected');
        selectedItems.push(clickedLink);
    }
    updateSelectedNameDisplay(clickedLink)
    playNextSound();


}

function playNextSound() {

    if (muteComms) return;

    playAudioOnce(`sounds/${soundNames[soundNdx]}`)

    // manage the index to the array of sounds
    soundNdx++;
    if (soundNdx >= soundNames.length) {
        soundNdx = 0;
    }

    if (selectedItems.length === shuffledNamesList.length) {
        playAudioOnce(`sounds/transfercomplete_clean.mp3`, .1)
    }

}


