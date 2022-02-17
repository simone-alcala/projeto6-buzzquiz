//-- VARIÁVEIS GLOBAIS --//
let arrayQuizzes       = [];
let arrayQuiz          = [];

let qtQuizQuestions    = 0;
let qtQuizRightAnswers = 0

let validate = false;

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

function validateInfoBasicText(value) {
  if(value.length >= 65 || value.length <=18) {
    alert("Título do quizz: deve ter no mínimo 20 e no máximo 65 caracteres")
    validate = false
  } else {
    validate = true
  }
}

function validateInfoBasicQuestion(value) {
  if (value <= 2) {
    alert("Quantidade de perguntas: no mínimo 3 perguntas")
    validate = false
  } else {
    validate = true
  }
}

function validateInfoBasicLevel(value) {
  if (value <= 1) {
    alert("Quantidade de níveis: no mínimo 2 níveis")
    validate = false
  } else {
    validate = true
    infoBasicButtonAble()
  }
}

function infoBasicButtonAble() {
  const element = document.querySelector(".creatingQuiz button")
  if (validate === true) {
    element.classList.remove("hide")
  }
}

//Se os três estiverem true, habilitar o botão (Como no Driven Eats)

//-- CRIAR NOVAS QUESTÕES --// 
function createNewQuestions() {
  const element = document.querySelector(".creatingQuiz")
  element.classList.add("hide")
  const buttonCreate = document.querySelector(".creating-question")
  buttonCreate.classList.remove("hide")
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


