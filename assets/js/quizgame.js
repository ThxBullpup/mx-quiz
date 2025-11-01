const MXQuiz = {
    allStudents : [],
    choiceStudents : [],
    totalQuestions : 5,
    currentQuestion : 0,
    score : 0
}

//htmlの読み込み時に生徒名簿を読み込む関数
async function loadStudent(){
    const response = await fetch('./student-roster.json');
    MXQuiz.allStudents = await response.json();
}

//htmlの読み込み時にフィルターを生成する関数
async function filterGenerate(){
    // 学校のリスト
    const schools = [
        'アビドス',
        'ゲヘナ',
        'ミレニアム',
        'トリニティ',
        'アリウス',
        '百鬼夜行',
        '山海経',
        'レッドウィンター',
        'ヴァルキューレ',
        'SRT',
        'ハイランダー',
        'ワイルドハント',
        'クロノス',
        '連邦生徒会',
        '不明'
    ]
    // チェックボックスにして表示、改行
    const container = document.getElementById('school');
    i = 0;
    schools.forEach(schoolName => {
        const filterCheckbox =`
            <label>
                <input type='checkbox' name='school' value='${schoolName}'>
                ${schoolName}
            </label>
        `
        container.innerHTML += filterCheckbox;
        i += 1;
        if(i % 3 == 0){
            container.innerHTML += '<br>';
        }
    })
}

// 出題リストの初期化
function initializeQuizList(){

}

//出題される生徒を選ぶ
function chooseStudent(){
    const candidateStudents = MXQuiz.allStudents;
    //出題数ぶん生徒を選んで、そのIDをchoiceStudentsに格納
    for(let i = 0; i < MXQuiz.totalQuestions; i+=1){
        MXQuiz.choiceStudents.push(candidateStudents[Math.floor(Math.random() * candidateStudents.length)].id);
    }
}

    //解答を判定する
function checkAnswer(){
    document.getElementById('userAnswer')
    const correctAnswer = MXQuiz.allStudents[MXQuiz.choiceStudents[MXQuiz.currentQuestion]].firstname.kana
    if (userAnswer.value == correctAnswer){
        MXQuiz.score += 1;
        console.log('正解!!シャーレに+1点')
    }else{
        console.log('残念!!しっかりしな')
    }
    userAnswer.value =''
    MXQuiz.currentQuestion += 1;
    if (MXQuiz.currentQuestion < MXQuiz.totalQuestions){
        displayQuestion();
    }else{
        console.log('result');
        transitionResult();
    }

}

function displayQuestion(){
    // 今何問目か表示
    const container = document.getElementById('questionCounter');
    const questionCount = `第${MXQuiz.currentQuestion+1}問`
        container.innerHTML = questionCount; //ループの問題が治ったらインクリメントを代入に変更
    //選ばれた生徒のIDと名前から使用する画像の名前を生成する
    faceImageAddress = `./assets/images/${('0000' + MXQuiz.choiceStudents[MXQuiz.currentQuestion]).slice( -4 ) + '-' + MXQuiz.allStudents[MXQuiz.choiceStudents[MXQuiz.currentQuestion]].firstname.english}.webp`;//全生徒[選ばれた生徒のID]下の名前の英語
    //画像と名前を置き換え
    document.querySelector('#answerSend').addEventListener('click',{name: MXQuiz.allStudents[MXQuiz.choiceStudents[MXQuiz.currentQuestion]].firstname.kana}); document.querySelector('#faceImage').setAttribute('src', faceImageAddress);
    document.querySelector('#firstName').textContent = MXQuiz.allStudents[MXQuiz.choiceStudents[MXQuiz.currentQuestion]].firstname.kana;
}

//クイズの画面に遷移する
function transitionQuiz(){
    document.getElementById('studentFilter').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    // 出題する生徒を選んでchoiceStudentsに格納
    chooseStudent();
    displayQuestion();
    document.querySelector('#answerSend').addEventListener('click',checkAnswer);

}

// タイトル画面に戻る
function transitionTitle(){
    document.getElementById('studentFilter').style.display = 'block';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    // 変数を初期化
    MXQuiz.choiceStudents = []
    MXQuiz.currentQuestion = 0
    MXQuiz.score = 0
}

// 結果画面に推移する
function transitionResult(){
    document.getElementById('studentFilter').style.display = 'none';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    // はじめの画面に戻るボタン
    document.querySelector('#repeat').addEventListener('click',transitionTitle());
}


//ロード完了時に生徒名簿を読み込み、出題フィルターを生成
document.addEventListener('DOMContentLoaded', async() => {
    await loadStudent();
    await filterGenerate();
})

//ボタンが押されたら生徒を選ぶ関数へ
document.querySelector('#start').addEventListener('click',transitionQuiz);
