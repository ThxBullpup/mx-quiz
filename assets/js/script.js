// game.js

// グローバル変数（ゲーム全体で使うデータ）
let allCharacters = []; // JSONから読み込んだ全キャラクターデータ
let currentCharacter = null; // 現在出題中のキャラクター

// ----------------------------------------------------
// 1. メインの処理 (ページの読み込み完了時に実行)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    // JSONデータを非同期で読み込む
    await loadGameData();

    // 最初の問題を出題する
    displayNewQuestion();

    // 「回答する」ボタンが押されたときの処理
    const checkButton = document.getElementById('check-button');
    checkButton.addEventListener('click', checkAnswer);
});

// ----------------------------------------------------
// 2. JSONデータを読み込む関数 (async/await を使用)
// ----------------------------------------------------
async function loadGameData() {
    try {
        // student-roster.json ファイルを fetch (取得)
        const response = await fetch('student-roster.json');
        if (!response.ok) {
            throw new Error('データの読み込みに失敗しました。');
        }
        allCharacters = await response.json();

        console.log('キャラクターデータを読み込みました:', allCharacters);

    } catch (error) {
        console.error(error);
        alert('ゲームデータの読み込みに失敗しました。');
    }
}

// ----------------------------------------------------
// 3. 新しい問題を表示する関数
// ----------------------------------------------------
function displayNewQuestion() {
    // ランダムにキャラクターを1人選ぶ
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    currentCharacter = allCharacters[randomIndex];

    // デバッグ用: コンソールに正解を表示
    console.log('現在の正解:', currentCharacter.firstname);

    // 画像パスを組み立てる
    // --- (もし 0000.webp 形式ならこっち) ---
    const idStr = String(currentCharacter.id).padStart(4, '0');
    const imagePath = `images/${idStr}.webp`;

    // 画面の要素を取得
    const imageElement = document.getElementById('quiz-image');
    const answerInput = document.getElementById('answer-input');
    const resultMessage = document.getElementById('result-message');

    // 画面を更新
    imageElement.src = imagePath;
    answerInput.value = ''; // 入力欄を空にする
    resultMessage.textContent = ''; // 結果を空にする
    resultMessage.className = ''; // CSSクラスも消す
}

// ----------------------------------------------------
// 4. 回答をチェックする関数
// ----------------------------------------------------
function checkAnswer() {
    // 画面の要素を取得
    const answerInput = document.getElementById('answer-input');
    const resultMessage = document.getElementById('result-message');

    // ユーザーの入力値と、現在の問題の正解（firstname）を取得
    const userAnswer = answerInput.value;
    const correctAnswer = currentCharacter.firstname;

    // 正解判定 (ひらがな・カタカナを無視する場合は別途処理が必要)
    if (userAnswer === correctAnswer) {
        resultMessage.textContent = '正解！ 🎉';
        resultMessage.className = 'correct';

        // 正解したら2秒後に次の問題へ
        setTimeout(displayNewQuestion, 2000);

    } else {
        resultMessage.textContent = `不正解... 正解は「${correctAnswer}」でした。`;
        resultMessage.className = 'incorrect';

        // 不正解なら3秒後に次の問題へ
        setTimeout(displayNewQuestion, 3000);
    }
}