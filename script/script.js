//-- VARIÁVEIS GLOBAIS --//
let arrayQuizzes = [];

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

loadQuizzes();

//-- CRIAR QUIZZ --//
function createNewQuizz() {
  const element = document.querySelector("main")
  element.classList.add("hide")
  const buttonCreate = document.querySelector(".creatingQuiz")
  buttonCreate.classList.remove("hide")
}

function validateInfoBasic() {
  const element = document.querySelectorAll(".creatingQuiz div input")
  const title = element[0].value.toString()
  const qntdQuestion = element[2].value
  const qntdLevel = element[3].value
  if (title.length >= 65 || title.length <= 18) {
    alert("Título do quizz: deve ter no mínimo 20 e no máximo 65 caracteres")
    //Função que perde o foco no próprio INPUT - Utilizar o Blur
  }
  if (qntdQuestion <= 2) {
    alert("Quantidade de perguntas: no mínimo 3 perguntas")
    //Função que perde o foco no próprio INPUT - Utilaizar o Blur
  }
  if (qntdLevel <= 1) {
    alert("Quantidade de níveis: no mínimo 2 níveis")
    //Função que perde o foco no próprio INPUT - Utilizar o Blur
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
  let arrayQuiz = arrayQuizzes.filter(quiz => quiz.id === quizId );
  renderQuiz (arrayQuiz);
}

function renderQuiz(quiz){
  let answeringQuiz = document.querySelector(".answeringQuiz");

  let gradientTitle = gradientTitleQuiz (quiz[0].image);

  let answeringQuizHTML = 
    ` <div class="header" style="${gradientTitle}">${quiz[0].title}</div> `;
    
    quiz[0].questions.forEach(question => {
      
      answeringQuizHTML += `
        <div class="question"> 
          <div class="title"> ${question.title}</div>
          <input class="color hidden" value="${question.color}" /> `;

        question.answers.forEach(answer => {
          answeringQuizHTML += `
            <div class="images">
              <img src="${answer.image}" alt="${answer.image}" />
              <strong>${answer.text}</strong>
            </div>
            <input class="answer hidden" value="${answer.isCorrectAnswer}" /> `;
        });
      });

      answeringQuizHTML += ` </div> `;
  
  answeringQuiz.innerHTML = answeringQuizHTML;
  }

function gradientTitleQuiz(quizImage){
  return `background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), 
                            rgba(0, 0, 0, 0.6)), url(	${quizImage});`;
}

loadQuizzes();


