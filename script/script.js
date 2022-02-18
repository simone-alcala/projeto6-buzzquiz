//-- VARIÁVEIS GLOBAIS --//
let arrayQuizzes       = [];
let arrayQuiz          = [];

let qtQuizQuestions    = 0;
let qtQuizRightAnswers = 0

let qntdCreateQuestion
let qntdCreateLevel

//-- --//
function loadQuizzes(){
  let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promise.then( promises => {
    setArrayQuizzes(promises);
    renderQuizzes (promises.data);   
  });

  promise.catch( erro => {
    console.error(erro.response);
    alert("Não carregou - DEPOIS VOU TIRAR A MENSAGEM");
  });
}

function setArrayQuizzes(promise){
  arrayQuizzes = promise.data.slice();
}

function renderQuizzes (quizzes){
  let allQuizzes = document.querySelector(".allQuizzes");
  
  allQuizzes.innerHTML="";

  quizzes.forEach(quiz => {
    let quizImage = gradientImageQuiz(quiz.image);
    
    allQuizzes.innerHTML +=
      `<div class="quiz" style="${quizImage}"> <div onclick="openQuiz(${quiz.id})">${quiz.title}</div> </div> `;
  });
}

//-- CRIAR QUIZZ --//
function createNewQuizz() {
  const element = document.querySelector("main")
  element.classList.add("hide")
  const buttonCreate = document.querySelector(".creatingQuiz")
  buttonCreate.classList.remove("hide")
}

function validateInfoBasic() {
  const  element = document.querySelectorAll(".creatingQuiz div input")
  const text = validateInfoBasicText(element[0].value)
  const url = validateUrl(element[1].value)
  const qntdQuestion = validateInfoBasicQuestion(element[2].value)
  const qntdLevel = validateInfoBasicLevel(element[3].value) 
  if ( text === true && url === true && qntdQuestion === true && qntdLevel === true) {
    createNewQuestions()
  }
}

function validateInfoBasicText(value) {
  if(value.length >= 65 || value.length <=18) {
    alert("Complete o título corretamente!")
  } else {
    return true
  }
}

function validateUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ 
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
    '(\\#[-a-z\\d_]*)?$','i'); 
  if (!!pattern.test(str)) {
    return true
  } else {
    alert("Complete a URL corretamente!")
    return false
  }
}

function validateInfoBasicQuestion(value) {
  if (value <= 2) {
    alert("Complete o número corretamente!")
  } else {
    qntdCreateQuestion = parseInt(value)
    return true
  }
}

function validateInfoBasicLevel(value) {
  if (value <= 1) {
    alert("Complete os níveis corretamente!")
  } else {
    qntdCreateLevel = parseInt(value)
    return true
  }
}

//-- CRIAR NOVAS QUESTÕES --// 
function createNewQuestions() {
  const element = document.querySelector(".creatingQuiz")
  element.classList.add("hide")
  const buttonCreate = document.querySelector(".creating-question")
  buttonCreate.classList.remove("hide")
  showNewQuestions()
}

function showNewQuestions() {
  const element = document.querySelector(".creating-question")
  for (let i = 0; i<qntdCreateQuestion; i++) {
    element.innerHTML += `<div class="another-question card${i+1}">
                            <div class="top-title" onclick="openCreateQuestion(this)">
                              <h2>Pergunta ${i+1}</h2>
                              <ion-icon name="create-outline"></ion-icon>
                            </div>
                            <div class="hide">
                              <div class="text-question">
                                <input type="text" placeholder="Texto da pergunta">
                                <input type="text" placeholder="Cor de fundo da pergunta">
                              </div>
                              <h2>Resposta correta</h2>
                              <div class="right-answer">
                                <input type="text" placeholder="Resposta correta">
                                <input type="text" placeholder="URL da imagem">
                              </div>
                              <h2>Respostas incorretas</h2>
                              <div class="wrong-answer wrong1">
                                <input type="text" placeholder="Resposta incorreta 1">
                                <input type="text" placeholder="URL da imagem 1">
                              </div>
                              <div class="wrong-answer wrong2">
                                <input type="text" placeholder="Resposta incorreta 2">
                                <input type="text" placeholder="URL da imagem 2">
                              </div>
                              <div class="wrong-answer wrong3">
                                <input type="text" placeholder="Resposta incorreta 3">
                                <input type="text" placeholder="URL da imagem 3">
                              </div>
                            </div>
                          </div>`
  }
}

function openCreateQuestion(question) {
  const all = question.parentNode
  all.children[1].classList.toggle("hide")
}

function validateNewQuestions() {
  let card 
  let validate
  for (let i = 0; i < qntdCreateQuestion; i++) {
    card = document.querySelector(`.another-question.card${i+1}`)
    let va1 = validateAllTitle(card)
    let va2 = validateAllRightAnswer(card)
    let va3 = validateFirstWrongAnswer(card)
    let va4 = validateOtherWrongAnswer(card)
    if (va1 === true && va2 === true && va3 === true && va4 === true) {
      validate = true
    } else {
      validate = false
    }
  }
  if (validate === true) {
    createLevels()
  }
}

function validateAllTitle(card) {
  const element = card.querySelectorAll(".text-question input")
  const title = validateNewQuestionTitle(element[0].value)
  const color = validateNewQuestionColor(element[1].value)
  if (title === true && color === true) {
    return true
  }
}

function validateAllRightAnswer(card) {
  const element = card.querySelectorAll(".right-answer input")
  const answer = validateNewQuestionAnswer(element[0].value)
  const url = validateUrl(element[1].value)
  if (answer === true && url === true) {
    return true
  }
}

function validateFirstWrongAnswer(card) {
  const element = card.querySelectorAll(".wrong-answer.wrong1 input")
  const answer = validateNewQuestionAnswer(element[0].value)
  const url = validateUrl(element[1].value)
  if ( answer === true && url === true) {
    return true
  }
}

function validateOtherWrongAnswer(card) {
  let element
  let answer
  let url
  for (let i = 0; i < 2; i++) {
    element = card.querySelectorAll(`.wrong-answer.wrong${i+2} input`)
    if ( element[0].value != "" || element[1].value != "") {
      answer = validateNewQuestionAnswer(element[0].value)
      url = validateUrl(element[1].value)
      if (answer === true && url === true) {
        return true
      }
    } else {
      return true
    }
  }
}

function validateNewQuestionTitle(value) {
  if (value.length >= 19) {
    return true
  } else {
    alert("Complete o texto da pergunta corretamente!")
    return false
  }
}

function validateNewQuestionColor(value) {
  if (value.length == 7) {
    return true
  } else {
    alert("Complete o texto hexadecimal da pergunta corretamente!")
    return false
  }
}

function validateNewQuestionAnswer(value) {
  if (value === "") {
    alert("Complete a resposta corretamente!")
    return false
  } else {
    return true
  }
}

//-- CRIAR NÍVEIS --//
function createLevels() {
  const element = document.querySelector(".creating-question")
  element.classList.add("hide")
  const buttonCreate = document.querySelector(".creating-levels")
  buttonCreate.classList.remove("hide")
}

//-- --//
function gradientImageQuiz(quizImage){
 return `background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, 
                           rgba(0, 0, 0, 0.5) 64.58%, #000000 100%),
                           url(	${quizImage});`;
}

function closeMain(){
  document.querySelector("main").classList.add("hidden");
}

function showMain(){
  document.querySelector("main").classList.remove("hidden");
}

function openQuiz(quizId){
  closeMain();
  arrayQuiz = arrayQuizzes.filter(quiz => quiz.id === quizId );
  renderQuiz (arrayQuiz);
}

function renderQuiz(quiz){
  let answeringQuiz = document.querySelector(".answeringQuiz");

  let gradientTitle = gradientTitleQuiz (quiz[0].image);

  let answeringQuizHTML = 
    ` <div class="header" style="${gradientTitle}">${quiz[0].title}</div> `;
    
    qtQuizQuestions = quiz[0].questions.length;

    quiz[0].questions.forEach(question => {
     
      let color = getTitleColor (question.color);

      answeringQuizHTML += `
        <div class="question"> 
          <div class="title" style="${color}"> ${question.title}</div>
          <input class="color hidden" value="${question.color}" /> 
          <div class = "answers" >`;

        question.answers.sort(shuffle);  

        question.answers.forEach(answer => {
          answeringQuizHTML += `
            <div class="answer" onclick="answerQuestion(this)">
              <img src="${answer.image}" alt="${answer.image}" />
              <strong>${answer.text}</strong>
              <input class="isCorrectAnswer hidden" value="${answer.isCorrectAnswer}" /> 
            </div>`;
            
        });
        answeringQuizHTML += ` </div></div> `;
      });
 
  answeringQuiz.innerHTML = answeringQuizHTML;
}

function shuffle(){
  return Math.random() - 0.5; 
}

function gradientTitleQuiz(quizImage){
  return `background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), 
                            rgba(0, 0, 0, 0.6)), url(	${quizImage});`;
}

function getTitleColor(color){
  return `background-color: ${color};`;
}

function answerQuestion(marked){

  marked.classList.add("marked");

  let answers = [...marked.parentNode.querySelectorAll(".answer")];

  answers.forEach(answer => {

    let isCorrectAnswer = answer.querySelector(".isCorrectAnswer");

    answer.setAttribute("onclick",null);
    
    if (!answer.classList.contains("marked")){
      answer.classList.add("not-marked");
    }
    if (isCorrectAnswer.value === "true"){
      answer.querySelector("strong").classList.add("correct");

      if (answer.classList.contains("marked")){
        qtQuizRightAnswers ++;
      }

    }   

    if (isCorrectAnswer.value === "false"){
      answer.querySelector("strong").classList.add("incorrect");
    }
  });

  let nextQuestion = marked.parentNode.parentNode.nextElementSibling;

  if (nextQuestion !== null) {
    setTimeout( () => scrollPage(nextQuestion), 2000 );
  } 
}

function scrollPage(destination){
  destination.scrollIntoView();
}

function calculateScore(){

  let total = (qtQuizRightAnswers/qtQuizQuestions*100).toFixed(0);

  console.log(arrayQuiz[0].levels);

}


loadQuizzes();


