const MXQuiz = {
    allStudents: [],
    choiceStudents: [],
    answerHistory:[],
    correctHistory:[],
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
        // `オデュッセイア`,
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
                    <input type='checkbox' class='school-check' name='school' value='${schoolName}' checked="checked">
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

/**
 * 全選択チェックボックスを設定する関数
 * @param {string} allCheckboxId - 全選択チェックボックスのID
 * @param {string} itemClassName - 個別チェックボックスのクラス名
 */
function setupCheckAll(allCheckboxId, itemClassName) {
    const checkAll = document.getElementById(allCheckboxId);
    const itemChecks = document.querySelectorAll('.' + itemClassName);

  // 要素が見つからない場合のエラーを防止
    if (!checkAll || itemChecks.length === 0) return;

  // ①「すべて選択」をクリックした時に、他の項目を連動させる
    checkAll.addEventListener('change', function() {
        itemChecks.forEach(function(item) {
            item.checked = checkAll.checked;
        });
    });

  // ②個別の項目をクリックした時、すべてチェックされたら「すべて選択」もONにする
    itemChecks.forEach(function(item) {
        item.addEventListener('change', function() {
            const isAllChecked = Array.from(itemChecks).every(i => i.checked);
            checkAll.checked = isAllChecked;
        });
    });
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
    const userAnswerText = toKatakana(userAnswerElement.value);
    const correctAnswer = MXQuiz.choiceStudents[MXQuiz.currentQuestion].familyname.kana;
    MXQuiz.answerHistory.push(userAnswerText); //解答を保存
    let isCorrect = false;
    // 得点
    if (userAnswerText == correctAnswer) {
        MXQuiz.score += 1;
        console.log('そういうこった！！')
        MXQuiz.correctHistory.push('◯')
        isCorrect = true
    } else {
        console.log('理解できる')
        MXQuiz.correctHistory.push('☓')
        isCorrect = false
    }
    // テキストボックスをクリア
    userAnswerElement.value = ''
    // 問題数を進める
    MXQuiz.currentQuestion += 1;
    // 正誤判定結果画面へ
    answerReaction(isCorrect,correctAnswer);
}
// 正解が不正解かを表示
function answerReaction(isCorrect,correctAnswer){
    const systemReaction = document.getElementById('reaction');
    if (isCorrect === true){
        console.log('dekiteru~')
        systemReaction.textContent = '正解！'
    }
    else{
        systemReaction.textContent = ('残念！正解は"'+ correctAnswer +'"でした')
    }
    document.getElementById('answerReaction').style.display = 'block';
    document.getElementById('answerandSend').style.display = 'none';
    // 現在の問題が設定した問題数以下なら継続、規定数を超えたら結果画面へ
    const nextButton = document.getElementById('nextQuestion');
    if ((MXQuiz.currentQuestion < MXQuiz.totalQuestions) || MXQuiz.allCheckSwitch === true) {
        console.log('next');
        nextButton.textContent = '次の問題';
    } else {
        console.log('result');
        nextButton.textContent = '結果を見る';
    }
}


// クイズ画面の表示
function displayQuestion() {
    if (MXQuiz.currentQuestion >= MXQuiz.totalQuestions && MXQuiz.allCheckSwitch === false) {
        console.log('result');
        transitionResult(); // 結果画面へ推移
        return; // ここで処理を終わらせて、下の問題表示処理をストップする
    }
    document.getElementById('answerReaction').style.display = 'none';
    document.getElementById('answerandSend').style.display = 'block';
    //デバッグ用に正解を表示
    console.log('正解は',MXQuiz.choiceStudents[MXQuiz.currentQuestion].familyname.kana)
    // 今何問目か表示
    const container = document.getElementById('questionCounter');
    const questionCount = `${MXQuiz.currentQuestion + 1}/${MXQuiz.totalQuestions}`;
    container.innerHTML = questionCount; //ループの問題が治ったらインクリメントを代入に変更
    // 選ばれた生徒のIDと名前から使用する画像の名前を生成する
    const faceImageAddress = `./assets/images/Icons/${MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.english}_Icon.webp`;//全生徒[選ばれた生徒のID]下の名前の英語
    // 画像と名前を置き換え
    const firstNameElement = document.getElementById('firstName');
    const faceImageElement = document.getElementById('faceImage');
    firstNameElement.textContent = MXQuiz.choiceStudents[MXQuiz.currentQuestion].firstname.kana
    // 読み込み失敗時ペロロを表示
    faceImageElement.onerror = function () {
        this.onerror = null;
        this.src = './assets/images/Icons/Peroro_Icon.webp';
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

function toKatakana(str) {
    // ひらがなをカタカナに変換
    str = str.replace(/[ぁ-ゔ]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) + 0x0060);
    });
    return str;
}


//クイズの画面に遷移する
function transitionQuiz() {
    document.getElementById('studentFilter').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    // テキストボックスを格納
    let requestedQuestionCount = document.getElementById('requestedQuestionCount');
    // 全角なら半角に変換して問題数に格納
    rawValue = toHalfWidth(requestedQuestionCount.value);
    MXQuiz.totalQuestions = parseInt(rawValue) || 5; // ||の左側がFalseだったら右の値が入る
    // 出題する生徒を選んでchoiceStudentsに格納
    chooseStudent();
    displayQuestion();
}

// 結果画面に推移する
function transitionResult() {
    document.getElementById('studentFilter').style.display = 'none';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `${MXQuiz.totalQuestions}問中${MXQuiz.score}問正解！！`
    console.log(MXQuiz.choiceStudents)
    // MXQuiz.answerHistory.forEach((answer) => console.log(answer + 'aaa'));
    const container = document.getElementById('history');
    for (let i = 0; i < MXQuiz.totalQuestions; i++){
        const errata =`
        <tr>
        <th scope="row">${i+1}</th>
        <td>${MXQuiz.choiceStudents[i].familyname.kana}</td>
        <td>${MXQuiz.answerHistory[i]}</td>
        <td>${MXQuiz.correctHistory[i]}</td>
        </tr>
    `
    container.innerHTML += errata;
    }
}


// タイトル画面に戻る
function transitionTitle() {
    document.getElementById('studentFilter').style.display = 'block';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    // 変数を初期化
    MXQuiz.choiceStudents = []
    MXQuiz.answerHistory = []
    MXQuiz.correctHistory = []
    MXQuiz.currentQuestion = 0
    MXQuiz.score = 0
    document.getElementById('history').innerHTML = '';
}

// 初期化する処理（一回だけ実行する）
function initQuiz() {
    //ロード完了時に生徒名簿を読み込み、出題フィルターを生成
    document.addEventListener('DOMContentLoaded', async () => {
        await loadStudent();
        await filterGenerate();
        setupCheckAll('check-all-school', 'school-check');
    });


    //ボタンが押されたら生徒を選ぶ関数へ移動
    document.querySelector('#start').addEventListener('click', transitionQuiz);
    // もう一度のボタンを押すとタイトルへ
    document.querySelector('#repeat').addEventListener('click', transitionTitle);
    //解答ボタンを押すと正誤判定関数へ移動
    document.querySelector('#answerSend').addEventListener('click', checkAnswer);
    //次へボタンを押すと次の問題へ
    document.querySelector('#nextQuestion').addEventListener('click', displayQuestion);
}

initQuiz();