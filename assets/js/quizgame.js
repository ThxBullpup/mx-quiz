const MXQuiz = {
    allStudents: [],
    choiceStudents: [],
    totalQuestions: 10,
    currentQuestion: 0,
    score: 0,
    allCheckSwitch: false
}

//htmlの読み込み時に生徒名簿を読み込む関数
async function loadStudent() {
    const response = await fetch('./student-roster.json');
    MXQuiz.allStudents = await response.json();
}

//htmlの読み込み時にフィルターを生成する関数
async function filterGenerate() {
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
        '不明/無し'
    ]
    // チェックボックスにして表示、改行
    const container = document.getElementById('schoolList');
    let i = 0;
    schools.forEach(schoolName => {
        const filterCheckbox = `
            <label>
                <div class='school'>
                    <input type='checkbox' name='school'  value='${schoolName}'>
                    ${schoolName}
                </div>
            </label>
        `
        container.innerHTML += filterCheckbox;
    })
}

function getSelectedSchools() {
    // nameがschoolになっているチェックボックスを、定数に格納する
    const checkedBoxes = document.querySelectorAll("input[name='school']:checked");
    // checkboxの中身をちゃんとしたリストにして、.mapで中身の値を変換する。
    // <input value="アビドス">　を　'アビドス'　に変換するみたいな感じ？多分
    const selectedSchools = Array.from(checkedBoxes).map(checkbox => checkbox.value);
    return selectedSchools;
}

//出題される生徒を選ぶ
function chooseStudent() {
    if (MXQuiz.allCheckSwitch === false) {
        //まず名字が判明していない(=nullにしている)生徒を除外する。
        let candidateStudents = MXQuiz.allStudents.filter(student => {
            return student.familyname.kana
        });
        //['アビドス', 'ミレニアム']みたいな値が得られる。
        const schoolsFilter = getSelectedSchools();
        if (schoolsFilter.length >= 1) {
            //条件に合致したものだけをcandidateStudentsに格納
            //取り出す配列.filter(配列から一個づつ取り出した値 => {ここの関数の値がTrueの時に変数に格納される})
            candidateStudents = candidateStudents.filter(student => {
                return schoolsFilter.includes(student.school); // 値.include(ここの値に.include手前の値が含まれてたらTrueを返す)
            });                                                // ['アビドス', 'ミレニアム'].includes(student.school)だったら、filterで取り出したstudentの、schoolにアビドスかミレニアムがあればcandidateStudentsに格納
        }
        // 出題数より選ばれた生徒が少ないなら出題数を調整する。
        if (candidateStudents.length < MXQuiz.totalQuestions) {
            MXQuiz.totalQuestions = candidateStudents.length;
        }
        // 出題数ぶん生徒を選んでchoiceStudentsに格納。
        for (let i = 0; i < MXQuiz.totalQuestions; i += 1) {
            //濾された生徒のうち何番目を選ぶか決める
            selectedNumber = Math.floor(Math.random() * candidateStudents.length);
            MXQuiz.choiceStudents.push(candidateStudents[selectedNumber]);
            // 選ばれた生徒を除外
            candidateStudents.splice(selectedNumber, 1);
        }
    } else {
        MXQuiz.choiceStudents = MXQuiz.allStudents;//デバッグスイッチがOnなら、全員を出題リストにぶち込みますわよ!?
    }


}

//解答を判定する
function checkAnswer() {
    const userAnswerElement = document.getElementById('userAnswer');
    const correctAnswer = MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.kana;

    // 得点
    if (userAnswerElement.value == correctAnswer) {
        MXQuiz.score += 1;
        console.log('そういうこった！！')
    } else {
        console.log('理解できる')
    }
    // テキストボックスをクリア
    userAnswerElement.value = ''
    // 問題数を進める
    MXQuiz.currentQuestion += 1;
    // 現在の問題が設定した問題数以下なら継続、規定数を超えたら結果画面へ
    if ((MXQuiz.currentQuestion < MXQuiz.totalQuestions) || MXQuiz.allCheckSwitch === true) {
        displayQuestion();
    } else {
        console.log('result');
        transitionResult();
    }
}

// クイズ画面の表示
function displayQuestion() {
    // 今何問目か表示
    const container = document.getElementById('questionCounter');
    const questionCount = `第${MXQuiz.currentQuestion + 1}問`;
    container.innerHTML = questionCount; //ループの問題が治ったらインクリメントを代入に変更
    // 選ばれた生徒のIDと名前から使用する画像の名前を生成する
    const faceImageAddress = `./assets/images/Student_Icon/${MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.english}_Icon.webp`;//全生徒[選ばれた生徒のID]下の名前の英語
    // 画像と名前を置き換え
    const firstNameElement = document.getElementById('firstName');
    const faceImageElement = document.getElementById('faceImage');
    firstNameElement.textContent = MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.kana
    // 読み込み失敗時ペロロを表示
    faceImageElement.onerror = function () {
        this.onerror = null;
        this.src = './assets/images/Student_Icon/Peroro_Icon.webp';
    }
    faceImageElement.src = faceImageAddress;
}

function toHalfWidth(str) {
    // 全角英数字を半角に変換
    str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    return str;
}


//クイズの画面に遷移する
function transitionQuiz() {
    document.getElementById('studentFilter').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    const requestedQuestionCount = document.getElementById('requestedQuestionCount');
    // 全角なら半角に変換して問題数に格納
    MXQuiz.totalQuestions = toHalfWidth(requestedQuestionCount.value);
    // 出題する生徒を選んでchoiceStudentsに格納
    chooseStudent();
    displayQuestion();
}

// タイトル画面に戻る
function transitionTitle() {
    document.getElementById('studentFilter').style.display = 'block';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    // 変数を初期化
    MXQuiz.choiceStudents = []
    MXQuiz.currentQuestion = 0
    MXQuiz.score = 0
}

// 結果画面に推移する
function transitionResult() {
    document.getElementById('studentFilter').style.display = 'none';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    // はじめの画面に戻るボタン
}

// 初期化する処理（一回だけ実行する）
function initQuiz() {
    //ロード完了時に生徒名簿を読み込み、出題フィルターを生成
    document.addEventListener('DOMContentLoaded', async () => {
        await loadStudent();
        await filterGenerate();
    })
    //ボタンが押されたら生徒を選ぶ関数へ移動
    document.querySelector('#start').addEventListener('click', transitionQuiz);
    // もう一度のボタンを押すとタイトルへ
    document.querySelector('#repeat').addEventListener('click', transitionTitle);
    //解答ボタンを押すと正誤判定関数へ移動
    document.querySelector('#answerSend').addEventListener('click', checkAnswer);
}

initQuiz();