// State variables
let backgroundSoundOn = false;
let muteComms = false;

const nameList = "Ashley,Bryant,Bryon,Corey,Dywayne,Irina,Jason,Joel,Karl,Linda,Mark,Matt,Megan,Seth,Susan,Troy,Vasu";
let shuffledNamesList = [];
let selectedItems = [];
let buttonLinks = [];
let bridgeAudio;
let buttonBridge;
let buttonMuteComms;

const colors = [
    { name: "african-violet", hex: "#cc88ff" },
    { name: "blue", hex: "#4455ff" },
    { name: "bluey", hex: "#7788ff" },
    { name: "gold", hex: "#ffaa00" },
    { name: "green", hex: "#33cc99" },
    { name: "ice", hex: "#88ccff" },
    { name: "lilac", hex: "#cc33ff" },
    { name: "magenta", hex: "#cc4499" },
    { name: "mars", hex: "#ff2200" },
    { name: "moonlit-violet", hex: "#9944ff" },
    { name: "orange", hex: "#ff7700" },
    { name: "peach", hex: "#ff8866" },
    { name: "red", hex: "#dd4444" },
    { name: "sky", hex: "#aaaaff" },
    { name: "space-white", hex: "#f5f6fa" },
    { name: "sunflower", hex: "#ffcc66" },
    { name: "tomato", hex: "#ff5555" },
    { name: "violet-creme", hex: "#ddbbff" },
    { name: "cardinal", hex: "#cc2233" },
    { name: "cool", hex: "#5588ff" },
    { name: "evening", hex: "#2255ff" },
    { name: "galaxy", hex: "#444a77" },
    { name: "ghost", hex: "#88bbff" },
    { name: "honey", hex: "#ffcc99" },
    { name: "martian", hex: "#99dd66" },
    { name: "midnight", hex: "#2129ff" },
    { name: "moonbeam", hex: "#ccdeff" },
    { name: "moonshine", hex: "#ddeeff" },
    { name: "pumpkinshade", hex: "#ff7744" },
    { name: "roseblush", hex: "#cc6666" },
    { name: "tangerine", hex: "#ff8833" },
    { name: "wheat", hex: "#ccaa88" }
];

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
    "computerbeep_14.mp3"
];
let soundNdx = 0;

// Utility: Shuffle array using Fisher-Yates algorithm
const fisherYatesShuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Utility: Play an audio file once
const playAudioOnce = (filePath, volumeLevel = 1) => {
    const audio = new Audio(filePath);
    audio.volume = Math.max(0, Math.min(volumeLevel, 1)); // Clamp volume between 0 and 1
    audio.play().catch(error => console.error('Error playing audio:', error));
    audio.onended = () => console.log('Audio playback finished');
};

// Initialize list of names
const buildListOfNames = () => {
    const namesContainer = document.getElementById('name-list-container');
    namesContainer.innerHTML = '';

    const urlParams = new URLSearchParams(window.location.search);
    const namesListParam = urlParams.get('names');
    const names = (namesListParam || nameList).split(',').map(name => name.toUpperCase());
    shuffledNamesList = fisherYatesShuffle(names);

    shuffledNamesList.forEach((name, ndx) => {
        const color = colors[ndx % colors.length].name;
        const ndxDisplay = (ndx + 1).toString().padStart(2, '0');
        const link = document.createElement('a');
        link.href = '#';
        link.className = color;
        link.textContent = `${name}:${ndxDisplay}`;
        link.addEventListener('click', handleNameClick);
        namesContainer.appendChild(link);
    });

    buttonLinks = document.querySelectorAll('#name-list-container a');
};

// Update display with selected name
const updateSelectedNameDisplay = (link) => {
    const selectedName = document.getElementById('selected-name');
    selectedName.textContent = link.textContent;

    const ict = document.getElementById('incoming-transmission');
    ict.innerHTML = selectedItems.length === shuffledNamesList.length
        ? 'Transfer Complete'
        : `Incoming transmission from ${link.textContent}`;

    ict.classList.add('blink-custom');
    setTimeout(() => ict.classList.remove('blink-custom'), 1000);
};

// Handle random selection
const selectRandomLink = () => {
    const availableLinks = Array.from(buttonLinks).filter(link => !selectedItems.includes(link));

    if (availableLinks.length) {
        const randomIndex = Math.floor(Math.random() * availableLinks.length);
        const selectedLink = availableLinks[randomIndex];
        selectedLink.classList.add('selected');
        updateSelectedNameDisplay(selectedLink);
        selectedItems.push(selectedLink);
        playNextSound();
    } else {
        console.log('All items have been selected.');
    }
};

// Handle name click
const handleNameClick = (event) => {
    event.preventDefault();
    const clickedLink = event.target;

    muteComms = false;
    buttonMuteComms.innerText = "COMMS SOUND OFF";

    const isSelected = selectedItems.includes(clickedLink);
    clickedLink.classList.toggle('selected', !isSelected);

    if (isSelected) {
        selectedItems = selectedItems.filter(link => link !== clickedLink);
    } else {
        selectedItems.push(clickedLink);
    }

    updateSelectedNameDisplay(clickedLink);
    playNextSound();
};

// Play next sound
const playNextSound = () => {
    if (muteComms) return;

    playAudioOnce(`sounds/${soundNames[soundNdx]}`);
    soundNdx = (soundNdx + 1) % soundNames.length;

    if (selectedItems.length === shuffledNamesList.length) {
        playAudioOnce('sounds/transfercomplete_clean.mp3', 0.1);
    }
};

// Initialize application
window.addEventListener('DOMContentLoaded', () => {
    bridgeAudio = new Audio('sounds/tng_bridge_1.mp3');
    bridgeAudio.loop = true;

    // declare separately to reference in other places
    buttonBridge = document.getElementById('btn-bridge')
    buttonBridge.addEventListener('click', () => {
        backgroundSoundOn = !backgroundSoundOn;
        buttonBridge.innerText = backgroundSoundOn ? "BRIDGE SOUND OFF" : "BRIDGE SOUND ON";
        backgroundSoundOn ? bridgeAudio.play() : bridgeAudio.pause();
    });

    // declare separately to reference in other places
    buttonMuteComms = document.getElementById('btn-mute-comms')
    buttonMuteComms.addEventListener('click', () => {
        muteComms = !muteComms;
        buttonMuteComms.innerText = muteComms ? "COMMS SOUND ON" : "COMMS SOUND OFF";
        playAudioOnce('sounds/computer_work_beep.mp3');
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        playAudioOnce('sounds/tng_viewscreen_off.mp3')
        selectedItems = [];
        buildListOfNames();
        document.getElementById('selected-name').textContent = 'CREW ON DECK';
        const ict = document.getElementById('incoming-transmission');
        ict.innerHTML = "Use Hail Next or select a crew member.";
    });

    document.getElementById('btn-hail-next').addEventListener('click', selectRandomLink);

    buildListOfNames();
});
