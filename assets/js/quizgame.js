let allCharacters = [];
let currentCharacters = null;

async function loadStudent(){
    const response = await fetch("./student-roster.json");
    allCharacters = await response.json();
    console.log(allCharacters.length,allCharacters[1]);
}

function chooseStudent(){
    choice = Math.floor(Math.random() * allCharacters.length);
    faceImageAddress = `./assets/images/${('0000' + allCharacters[choice].id).slice( -4 ) + "-" + allCharacters[choice].firstname.english}.webp`;
    console.log(faceImageAddress);
    document.querySelector("#faceImage").setAttribute("src", faceImageAddress);
}
//ロード完了時に生徒名簿を読み込む
document.addEventListener("DOMContentLoaded", async() => {
    await loadStudent();
})

document.querySelector("#start").addEventListener("click",chooseStudent);
