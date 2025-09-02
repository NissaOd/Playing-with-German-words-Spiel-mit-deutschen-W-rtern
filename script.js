/** 
 * ДАННЫЕ (пример)
 * Положите файлы картинок в /images. Расширения .jpg/.png — любые, лишь бы совпадали имена.
 */
const data = [
  { word: 'Elefant', img: 'Elefant.jpg' },
  { word: 'Katze',   img: 'Katze.jpg' },
  { word: 'Hund',    img: 'Hund.jpg' },
  { word: 'Vogel',   img: 'Vogel.jpg' },
  { word: 'Fisch',   img: 'Fisch.jpg' },
];

/** --- Состояние --- */
let selectedImage = null;
let selectedWord  = null;
let shuffledImages = [];  // ⬅️ теперь будем перемешивать КАРТИНКИ отдельно
let shuffledWords  = [];  // ⬅️ и СЛОВА отдельно

let score    = 0;
let attempts = 0;

/** --- DOM --- */
const imagesContainer  = document.getElementById('images');
const wordsContainer   = document.getElementById('words');
const result           = document.getElementById('result');
const matchedContainer = document.getElementById('matched');

const scoreEl    = document.getElementById('score');
const attemptsEl = document.getElementById('attempts');
const accuracyEl = document.getElementById('accuracy');
const resetBtn   = document.getElementById('resetBtn');

/** Рейтинг (процент верных) */
function updateAccuracy() {
  const accuracy = attempts === 0 ? 0 : Math.round((score / attempts) * 100);
  accuracyEl.textContent = `${accuracy}%`;
}

/**
 * Инициализация поля:
 * — перемешиваем картинки И слова
 * — перерисовываем оба столбца
 */
function initGame() {
  imagesContainer.innerHTML = '';
  wordsContainer.innerHTML  = '';

  // ⬇️ Перемешиваем отдельно картинки и слова
  shuffledImages = [...data].sort(() => Math.random() - 0.5);
  shuffledWords  = [...data].sort(() => Math.random() - 0.5);

  // Рисуем КАРТИНКИ по shuffledImages
  shuffledImages.forEach((item) => {
    const imgEl = document.createElement('img');
    imgEl.src = `images/${item.img}`;
    imgEl.alt = item.word;
    imgEl.dataset.word = item.word;

    imgEl.addEventListener('click', () => {
      document.querySelectorAll('.images img').forEach(img => img.classList.remove('selected'));
      imgEl.classList.add('selected');
      selectedImage = item.word;
      checkMatch();
    });

    imagesContainer.appendChild(imgEl);
  });

  // Рисуем СЛОВА по shuffledWords
  shuffledWords.forEach((item) => {
    const wordEl = document.createElement('div');
    wordEl.textContent = item.word;
    wordEl.dataset.word = item.word;

    wordEl.addEventListener('click', () => {
      document.querySelectorAll('.words div').forEach(div => div.classList.remove('selected'));
      wordEl.classList.add('selected');
      selectedWord = item.word;
      checkMatch();
    });

    wordsContainer.appendChild(wordEl);
  });
}

/**
 * Проверка совпадения
 */
function checkMatch() {
  if (selectedImage && selectedWord) {
    attempts++;
    attemptsEl.textContent = attempts;

    if (selectedImage === selectedWord) {
      result.textContent = `Правильно! Это "${selectedWord}"`;

      score++;
      scoreEl.textContent = score;
      updateAccuracy();

      // Находим реальные элементы на поле по data-word
      const matchedImage = document.querySelector(`img[data-word="${selectedWord}"]`);
      const matchedWord  = document.querySelector(`div[data-word="${selectedWord}"]`);

      // Блокируем их и приглушаем
      matchedImage.style.pointerEvents = 'none';
      matchedWord.style.pointerEvents  = 'none';
      matchedImage.style.opacity = '0.5';
      matchedWord.style.opacity  = '0.5';

      // Переносим пару вниз (клонируем картинку)
      const pairEl = document.createElement('div');
      pairEl.classList.add('matched-pair');

      const imgClone = matchedImage.cloneNode(true);
      imgClone.classList.remove('selected');
      imgClone.style.opacity = '1';

      const wordClone = document.createElement('div');
      wordClone.textContent = selectedWord;

      pairEl.appendChild(imgClone);
      pairEl.appendChild(wordClone);
      matchedContainer.appendChild(pairEl);
    } else {
      result.textContent = 'Неправильно, попробуйте ещё раз.';

      // Временная красная подсветка
      const selectedImg = document.querySelector('.images img.selected');
      const selectedWrd = document.querySelector('.words div.selected');
      if (selectedImg) selectedImg.classList.add('wrong');
      if (selectedWrd) selectedWrd.classList.add('wrong');
      setTimeout(() => {
        if (selectedImg) selectedImg.classList.remove('wrong');
        if (selectedWrd) selectedWrd.classList.remove('wrong');
      }, 1000);

      updateAccuracy();
    }

    // Сброс текущих выборов и синей подсветки
    selectedImage = null;
    selectedWord  = null;
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  }
}

/**
 * Полный сброс:
 * — обнуляем счётчики/текст
 * — чистим угаданные пары
 * — запускаем initGame(), который СНОВА ПЕРЕМЕШАЕТ картинки и слова
 */
function resetGame() {
  score = 0;
  attempts = 0;
  selectedImage = null;
  selectedWord  = null;

  scoreEl.textContent    = '0';
  attemptsEl.textContent = '0';
  accuracyEl.textContent = '0%';
  result.textContent     = '';
  matchedContainer.innerHTML = '';

  initGame(); // <-- при каждом сбросе перемешиваем и перерисовываем заново
}

/** Кнопка «Начать заново» */
if (resetBtn) resetBtn.addEventListener('click', resetGame);

/** Старт */
initGame();