let allCharacters = [];
let currentCharacters = null;

async function loadStudent(){
    const response = await fetch("./student-roster.json");
    allCharacters = await response.json();
    console.log(allCharacters.length,allCharacters[1]);
}
//ロード完了時に生徒名簿を読み込む
document.addEventListener("DOMContentLoaded", async() => {
    await loadStudent();
})


// document.querySelector("#start").addEventListener("click",chooseStudent);
