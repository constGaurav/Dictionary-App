const input = document.getElementById("input");
const searchBtn = document.getElementById("search");
const notFound = document.getElementById("not_found");
const API_KEY = "ce55c5b8-edb8-451d-b46c-4df1dcb95264";
const defBox = document.getElementById("def");
const audioBox = document.getElementById("audio");
const loading = document.getElementById("loading");

const renderSound = (soundName) => {
  const subFolder = soundName.charAt(0);
  const soundSrc = `https://media.merriam-webster.com/soundc11/${subFolder}/${soundName}.wav?key=${API_KEY}`;

  const aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
};

const getData = async (word) => {
  // Show loading
  loading.style.display = "block";

  // Ajax call
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${API_KEY}`
  );
  const data = await response.json();

  // if empty result
  if (!data.length) {
    // Hide loading
    loading.style.display = "none";

    notFound.innerText = "No result found";
    return;
  }

  // If result is suggetions
  if (typeof data[0] === "string") {
    // Hide loading
    loading.style.display = "none";

    let heading = document.createElement("h3");
    heading.innerText = "Did you mean?";
    notFound.appendChild(heading);
    data.forEach((element) => {
      let suggetion = document.createElement("span");
      suggetion.classList.add("suggested");
      suggetion.innerText = element;
      notFound.appendChild(suggetion);
    });
    return;
  }

  // Result found
  // Hide loading
  loading.style.display = "none";
  const defination = data[0].shortdef[0];
  defBox.innerText = `Defination : ${defination}`;

  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    // if word sound is avaliable
    renderSound(soundName);
  }
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Clear previous data
  audioBox.innerHTML = "";
  notFound.innerText = "";
  defBox.innerText = "";
  // Hide loading
  loading.style.display = "none";

  // Get Input From User
  const word = input.value;

  if (word === "") {
    alert("Please, Enter a word :)");
    return;
  }

  // Call API to get Data
  getData(word);
});
