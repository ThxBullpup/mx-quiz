let allCharacters = [];
let currentCharacters = null;

//htmlの読み込み時に生徒名簿を読み込む関数
async function loadStudent(){
    const response = await fetch("./student-roster.json");
    allCharacters = await response.json();
}

//出題される生徒を選ぶ
function chooseStudent(){
    choice = Math.floor(Math.random() * allCharacters.length);
    //選ばれた生徒のIDと名前から使用する画像の名前を生成する
    faceImageAddress = `./assets/images/${('0000' + allCharacters[choice].id).slice( -4 ) + "-" + allCharacters[choice].firstname.english}.webp`;
    //画像と名前を置き換え
    document.querySelector(".faceAndName").hidden = false;
    document.querySelector("#faceImage").setAttribute("src", faceImageAddress);
    document.querySelector("#firstName").textContent = allCharacters[choice].firstname.kana;
}


//ロード完了時に生徒名簿を読み込む
document.addEventListener("DOMContentLoaded", async() => {
    await loadStudent();
})

//ボタンが押されたら生徒を選ぶ関数へ
document.querySelector("#start").addEventListener("click",chooseStudent);
