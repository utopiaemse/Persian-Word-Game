// تابع اصلی برای شروع بازی
function startGame(keys) {
  let currentIndex = 0;
  let words = [];
  let targetWord = "";
  let cleanedWord = "";
  let score = 6; // امتیاز اولیه
  let askedQuestions = []; // سوالات پرسیده شده
  const messages = document.getElementById("messages");
  const scoreElement = document.getElementById("score");
  const wordDisplay = document.getElementById("wordDisplay");

  // تابع برای نمایش کلمه بعدی
  function nextWord() {
    if (askedQuestions.length === words.length) {
      messages.textContent = `شما با امتیاز ${score} برنده شدید 😃`;
      messages.style.color = "green";
      messages.style.fontWeight = "900";
      disableKeysAndInputs();

      return;
    }
    let wordObj;
    let foundNewWord = false;
    while (!foundNewWord) {
      wordObj = words[Math.floor(Math.random() * words.length)];
      if (!askedQuestions.includes(wordObj.question)) {
        foundNewWord = true;
      }
    }

    askedQuestions.push(wordObj.question);
    targetWord = wordObj.targetWord;
    cleanedWord = wordObj.cleanedWord;
    wordDisplay.textContent = wordObj.question;

    const inputContainer = document.getElementById("inputContainer");
    inputContainer.innerHTML = "";
    for (let i = 0; i < targetWord.length; i++) {
      const character = targetWord[i];
      if (character === " ") {
        const space = document.createElement("div");
        space.style.display = "inline-flex";
        space.style.width = "30px";
        inputContainer.appendChild(space);
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.readOnly = true;
        input.classList.add("box-input");
        inputContainer.appendChild(input);
      }
    }
    currentIndex = 0;
  }

  // تابع برای بارگیری لیست کلمات
  async function loadWords() {
    try {
      const response = await fetch("../src/words.json");
      const fetchedWords = await response.json();
      words = fetchedWords.map((wordObj) => ({
        question: wordObj.question,
        targetWord: wordObj.answer,
        cleanedWord: wordObj.answer.replace(/\s/g, ""),
      }));
      nextWord();
    } catch (error) {
      score = 0;
      updateScore(score);
      disableKeysAndInputs();
      scoreElement.style.display = "none";
      wordDisplay.style.display = "none";
      console.error("خطا در بارگیری لیست کلمات:", error);
      messages.textContent =
        "خطا در بارگیری لیست کلمات: برنامه حتما باید روی سرور اجرا شود یا از Live Server VSCode استفاده شود";

      messages.style.color = "red";
      messages.style.fontSize = "1.3rem";
    }
  }

  // تابع برای نمایش امتیازات
  function updateScore(score) {
    if (score < 0) {
      score = 0;
    }
    scoreElement.textContent = score;
  }

  // تابع برای پردازش کلیک روی کلیدها
  function handleKeyClick(char) {
    if (score === 0) {
      return;
    }
    const input = getNextEmptyInput();
    if (input) {
      if (char === cleanedWord[currentIndex]) {
        input.value = char;
        input.style.color = "#67ef55";
        input.classList.add("input-animation-correct");
        setTimeout(
          () => input.classList.remove("input-animation-correct"),
          1200
        );
        score++;
        updateScore(score);
        currentIndex++;
        if (currentIndex === cleanedWord.length) {
          nextWord();
        }
      } else {
        input.classList.add("input-animation-incorrect");
        setTimeout(
          () => input.classList.remove("input-animation-incorrect"),
          1200
        );
        input.style.color = "#d63031";
        input.value = char;

        setTimeout(() => {
          input.style.color = "";
          input.value = "";
        }, 1000);

        score--;
        updateScore(score);
        if (score === 0) {
          messages.textContent = "شما باختید 😞";
          messages.style.color = "red";
          messages.style.fontWeight = "900";
          disableKeysAndInputs();
          return;
        }
      }
    }
  }

  // تابع برای حذف حرف
  function handleBackspace() {
    if (score === 0) {
      return;
    }
    const inputs = document.querySelectorAll("input[type='text']");
    if (currentIndex > 0) {
      currentIndex--;
    }
    for (let i = inputs.length - 1; i >= 0; i--) {
      if (inputs[i].value !== "") {
        inputs[i].value = "";
        inputs[i].style.color = "";
        break;
      }
    }
  }

  // تابع برای یافتن اولین باکس خالی
  function getNextEmptyInput() {
    const inputs = document.querySelectorAll("input[type='text']");
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value === "") {
        return inputs[i];
      }
    }
    return null;
  }

  // تابع برای غیرفعال کردن input
  function disableKeysAndInputs() {
    const keys = document.querySelectorAll(".key");
    keys.forEach((key) => {
      key.style.pointerEvents = "none";
      key.style.opacity = "0.5";
    });
    const inputs = document.querySelectorAll("input[type='text']");
    inputs.forEach((input) => {
      input.style.pointerEvents = "none";
      input.style.opacity = "0.5";
    });
  }

  // ساختن صفحه کلید
  const keyboardContainer = document.getElementById("keyboard");
  keys.forEach((key) => {
    const keyElement = document.createElement("div");
    keyElement.classList.add("key");
    keyElement.textContent = key;
    keyElement.addEventListener("click", () => handleKeyClick(key));
    keyboardContainer.appendChild(keyElement);
  });

  const backspaceButton = document.createElement("div");
  backspaceButton.classList.add("key");
  backspaceButton.textContent = "⌫";
  backspaceButton.addEventListener("click", handleBackspace);
  keyboardContainer.appendChild(backspaceButton);

  // بارگیری کلمات
  loadWords();
}

// آرایه حروف فارسی
const persianChars = [
  "ض",
  "ص",
  "ث",
  "ق",
  "ف",
  "غ",
  "ع",
  "ه",
  "خ",
  "ح",
  "ج",
  "چ",
  "پ",
  "ش",
  "س",
  "ی",
  "ب",
  "ل",
  "ا",
  "ت",
  "ن",
  "م",
  "ک",
  "گ",
  "ظ",
  "ط",
  "ز",
  "ر",
  "ژ",
  "ذ",
  "د",
  "و",
];

// شروع بازی
startGame(persianChars);
