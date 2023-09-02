
// main.js  relacionado a numerologia.html
// llamando los datos del formulario html y creo constantes para los cálculos
// código en ingles para evitar acentos, etc
(function () {
  const numeroscopio = {};
  const name = document.querySelector(`[name="name"]`);
  const name2 = document.querySelector(`[name="name"]`);
  const form = document.querySelector(".main-form");
  const date = document.querySelector(".natalicio");
  const save = document.querySelector("#save");
  const caminoVida = document.querySelector(".camino-vida");
  const senderoAlma = document.querySelector(".sendero-alma");
  const destino = document.querySelector(".destino");
  const personalidad = document.querySelector(".personalidad");

  const nameError = document.querySelector(".name-error");
  const dateError = document.querySelector(".natalicio-error");

  const numberTypes = document.querySelectorAll(".numberTypes li");
  const numberTypesMap = { caminoVida, senderoAlma, destino, personalidad };
  const numberTypeCalculators = {
    caminoVida: calculateCaminoVida,
    senderoAlma: calculateSenderoAlma,
    destino: calculateDestino,
    personalidad: calculatePersonalidad
  };
  // links a las páginas html que contendran los significados de cada tipo de número y de cada número
  const numberTypeLinks = {
    caminoVida: "http://claudiaherrera.online",
    senderoAlma: "http://claudiaherrera.online",
    destino: "http://claudiaherrera.online",
    personalidad:
      "http://claudiaherrera.online"
  };

  for (let i = 0; i < 26; i++) {
    numeroscopio[String.fromCharCode("a".charCodeAt(0) + i)] = i % 9 + 1;
  }
  // acumulando en localStorage nombre y natalicio cuando se complete 
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
    save.checked = true;
  }

  if (localStorage.getItem("birthDate")) {
    date.value = localStorage.getItem("birthDate");
    save.checked = true;
  }
  //  funciones para calcular los tipos de números, número destino, camino de vida, sendero del alma y personalidad
  function calculateDestino(fullName) {
    const names = fullName.toLowerCase().split(" ");

    let result = names.reduce((total, name) => {
      let sum = 0;
      for (let i = 0; i < name.length; i++) {
        sum += numeroscopio[name.charAt(i)];
      }
      return reduceNumber(sum) + total;
    }, 0);

    return reduceNumber(result);
  }
  // split para separa en dígitos 
  function calculateCaminoVida(birthdate) {
    const [year, month, day] = birthdate.split("-");
    const sum = parseInt(year) + parseInt(month) + parseInt(day);
    return reduceNumber(sum);
  }

  function calculateSenderoAlma(fullName) {
    const regexp = /[aeiou]/gi;

    if (!fullName.toLowerCase().match(regexp)) {
      return 0;
    }

    const result = fullName
      .toLowerCase()
      .match(regexp)
      .reduce((total, letter) => total + numeroscopio[letter], 0);

    return reduceNumber(result);
  }
  //separando vocales del nombre 
  function calculatePersonalidad(fullName) {
    const regexp = /[^aeiou\s]/gi;

    if (!fullName.toLowerCase().match(regexp)) {
      return 0;
    }

    const result = fullName
      .toLowerCase()
      .match(regexp)
      .reduce((total, letter) => total + numeroscopio[letter], 0);

    return reduceNumber(result);
  }
  // en la reducción los número 10, 11, 22, 33 son maestron no debe reducir
  function reduceNumber(num) {
    if (num < 10 || num === 11 || num === 22 || num === 33) {
      return num;
    }

    let digit = num;
    num = 0;
    while (digit !== 0) {
      num += digit % 10;
      digit = Math.floor(digit / 10);
    }

    return reduceNumber(num);
  }
  // Retornos 
  function doCalculations(e) {
    e.preventDefault();

    const nameValue = name.value;

    if (!validateInput(nameValue)) return;

    if (save.checked) {
      localStorage.setItem("name", nameValue.trim());
      localStorage.setItem("birthDate", date.value);
    } else {
      localStorage.clear();
    }

    Object.keys(numberTypesMap).forEach(numberType => {
      numberTypesMap[numberType].innerHTML = "";
      numberTypesMap[numberType].classList.remove("show");
    });

    const delayDuration = 500;

    numberTypes.forEach((numberType, index) => {
      const numberTypeName = convertClassNameToCamelCase(numberType.className);
      const numberTypeFunc = numberTypeCalculators[numberTypeName];
      const funcArg =
        numberTypeName !== "caminoVida" ? nameValue.toLowerCase() : date.value;
      const resultText = numberType.className.split("-");

      setTimeout(() => {
        numberTypesMap[numberTypeName].classList.add("show");
        numberTypesMap[numberTypeName].innerHTML = `El número de tu  ${upperCaseFirstLetter(
          resultText
        )}  es&nbsp;<a id=${index + 1} href="${numberTypeLinks[numberTypeName]
          }" target="_blank" >${numberTypeFunc(funcArg)}</a>`;

        setTimeout(() => {
          document.getElementById(index + 1).classList.add("highlight");
        }, delayDuration + 250);
      }, delayDuration * index);
    });

    scrollToResults();
  }

  function dateBlur(e) {
    this.type = "text";
  }

  function dateFocus(e) {
    this.type = "date";
  }

  function convertClassNameToCamelCase(str) {
    const words = str.split("-");

    return words.reduce((fullString, currentWord, index) => {
      if (index > 0) {
        return (
          fullString +
          currentWord.charAt(0).toUpperCase() +
          currentWord.slice(1)
        );
      }
      return currentWord;
    }, "");
  }

  function upperCaseFirstLetter(str) {
    let text = `${str[0].charAt(0).toUpperCase() + str[0].slice(1)}`;

    if (str[1]) {
      text += " " + str[1].charAt(0).toUpperCase() + str[1].slice(1);
    }
    return text;
  }

  function validateInput(fullname) {
    nameError.innerHTML = "";
    dateError.innerHTML = "";
    let isValid = true;

    const names = fullname.trim().split(/ +/g);
    const areNamesValid = names.every(name => {
      return name.match(/[a-zA-Z]+/, "gi");
    });

    if (!fullname) {
      nameError.innerHTML = "Por favor ingresa tu nombre";
      nameError.classList.add("error-show");
      isValid = false;
    } else if (!areNamesValid) {
      nameError.innerHTML = "Por favor ingresa un nombre valido";
      nameError.classList.add("error-show");
      isValid = false;
    }

    if (!date.value) {
      dateError.innerHTML = "Por favor ingresa tu fecha de nacimiento";
      dateError.classList.add("error-show");
      isValid = false;
      return isValid;
    }

    const [year, month, day] = date.value.split("-");
    const yearRegExp = new RegExp(/^\d{4}$/, "g");
    const monthAndDayRegExp = new RegExp(/^\d{2}$/, "g");

    const isValidYear = year.match(yearRegExp);
    const isValidMonth = month.match(monthAndDayRegExp);
    const isValidDay = day.match(monthAndDayRegExp);

    if (!isValidYear || !isValidMonth || !isValidDay) {
      dateError.innerHTML = "Por favor ingresa un dato válido";
      dateError.classList.add("error-show");
      isValid = false;
    }

    return isValid;
  }

  function scrollToResults() {
    const numberTypesEl = document.querySelector(".numberTypes");
    numberTypesEl.style["display"] = "flex";

    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth"
    });
  }

  form.addEventListener("submit", doCalculations);
  date.addEventListener("blur", dateBlur);
  date.addEventListener("focus", dateFocus);
})();
input.onchange = () => verifyNumber(input.value);
