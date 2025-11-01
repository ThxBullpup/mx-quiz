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
    let i = 0;
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

//出題される生徒を選ぶ
function chooseStudent(){
    const candidateStudents = MXQuiz.allStudents;
    //出題数ぶん生徒を選んでchoiceStudentsに格納
    for(let i = 0; i < MXQuiz.totalQuestions; i+=1){
        MXQuiz.choiceStudents.push(candidateStudents[Math.floor(Math.random() * candidateStudents.length)]);
    }
}

    //解答を判定する
function checkAnswer(){
    const userAnswerElement = document.getElementById('userAnswer');
    const correctAnswer = MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.kana;

    // 得点
    if (userAnswerElement.value == correctAnswer){
        MXQuiz.score += 1;
        console.log('正解!!シャーレに+1点')
    }else{
        console.log('残念!!しっかりしな')
    }
    // テキストボックスをクリア
    userAnswerElement.value =''
    // 問題数を進める
    MXQuiz.currentQuestion += 1;
    // 現在の問題が設定した問題数以下なら継続、規定数を超えたら結果画面へ
    if (MXQuiz.currentQuestion < MXQuiz.totalQuestions){
        displayQuestion();
    }else{
        console.log('result');
        transitionResult();
    }
}

// クイズ画面の表示
function displayQuestion(){
    // 今何問目か表示
    const container = document.getElementById('questionCounter');
    const questionCount = `第${MXQuiz.currentQuestion+1}問`;
        container.innerHTML = questionCount; //ループの問題が治ったらインクリメントを代入に変更
    // 選ばれた生徒のIDと名前から使用する画像の名前を生成する
    const faceImageAddress = `./assets/images/${('0000' + MXQuiz.choiceStudents[MXQuiz.currentQuestion].id).slice( -4 ) + '-' + MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.english}.webp`;//全生徒[選ばれた生徒のID]下の名前の英語
    // 画像と名前を置き換え
    const firstNameElement = document.getElementById('firstName');
    const faceImageElement = document.getElementById('faceImage');
    firstNameElement.textContent = MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.kana
    // 読み込み失敗時ペロロを表示
    faceImageElement.onerror = function() {
        this.onerror = null;
        this.src = './assets/images/9999-peroro.webp';
    }
    faceImageElement.src = faceImageAddress;
}

//クイズの画面に遷移する
function transitionQuiz(){
    document.getElementById('studentFilter').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    // 出題する生徒を選んでchoiceStudentsに格納
    chooseStudent();
    displayQuestion();
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
}

// 初期化する処理（一回だけ実行する）
function initQuiz(){
    //ロード完了時に生徒名簿を読み込み、出題フィルターを生成
    document.addEventListener('DOMContentLoaded', async() => {
    await loadStudent();
    await filterGenerate();
    })
    //ボタンが押されたら生徒を選ぶ関数へ移動
    document.querySelector('#start').addEventListener('click',transitionQuiz);
    // もう一度のボタンを押すとタイトルへ
    document.querySelector('#repeat').addEventListener('click',transitionTitle);
    //解答ボタンを押すと正誤判定関数へ移動
    document.querySelector('#answerSend').addEventListener('click',checkAnswer);
}

initQuiz();