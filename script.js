const search_bar = document.querySelector('.search-bar');
const submitBtn = document.querySelector('.submit');
const Outcome = document.querySelector('.result');
let timer1;
let timer2;

//Enable light and dark mode
const screenLight = document.querySelector('.screen-color');
screenLight.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        screenLight.innerHTML = '<i class="fa-solid fa-sun"></i>'
    } else {
        screenLight.innerHTML = '<i class="fa-solid fa-moon"></i>'
    }
})

//This runs the commands as soon as the button is clicked
submitBtn.addEventListener("click", () => {
    Outcome.classList.add("enable");
    process()
});

//Get's the word from the API as soon as you press the Enter key
search_bar.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        Outcome.classList.add("enable");
        process()
    };
});


function process() {
    const word = search_bar.value.trim(); //removes all extra spaces

    // If the word is not found return
    if (!word) {
        if (timer1) {
            clearTimeout(timer1)
        }
        Outcome.innerHTML = '<p class="mid">🙄 Please enter a word.</p>';
        playAnimation('error')
        timer1 = setTimeout(() => {
            Outcome.innerHTML = "";
        }, 2000);
        return;
    };
    search_bar.value = '';
    Outcome.innerHTML = '<div class="spinner"></div>';
    getWord(word);
}

//Get word from the API
async function getWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        //if an error occurs display it in the console
        if (!response.ok) throw new Error("Word not found!");

        //Access data from the API
        const data = await response.json();
        const wordInfo = data[0];
        const meaning = wordInfo.meanings[0].definitions[0].definition;
        const example = wordInfo.meanings[0].definitions[0].example || "USE YOUR IMAGINATION";
        const partOfSpeech = wordInfo.meanings[0].partOfSpeech;
        const phonetic = wordInfo.phonetics[0].text || "N/A";

        //render in the browser
        Outcome.innerHTML =
            `<p class="Bigger">Word: ${wordInfo.word}</p>
                <p class="mid">Phonetic: ${phonetic}</p>
                <p class="mid">Part of Speech: ${partOfSpeech}</p>
                <p class="mid">Definition: ${meaning}</p>
                <p class="mid">Example: ${example}</P>`

        playAnimation('render');
    } catch (err) {
        //If there is an error display this
        if (timer2) {
            clearTimeout(timer2)
        }
        Outcome.innerHTML = '<p class="mid">🤷 Word not found<p>';
        playAnimation('error')
        timer2 = setTimeout(() => {
            Outcome.innerHTML = "";
        }, 2000);
        console.error(err);
    };
};

//Give it a nice animation
function playAnimation(msg) {
    const OutputTexts = document.querySelectorAll('.mid');
    const BiggerText = document.querySelector('.Bigger');
    const text = document.querySelector('.mid');

    if (msg === 'error') {
        text.classList.add("activate");
    }
    else {
        BiggerText.classList.add("activate");

        OutputTexts.forEach(text => {
            text.classList.add('activate')
        });
    }
};