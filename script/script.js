let arrayQuizzes = [];

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
      `<div class="quiz" style="${quizImage}"> <div onclick="openQuiz(quiz)">${quiz.title}</div> </div> `
  });
}

loadQuizzes();

//-- CRIAR QUIZZ --//
function createNewQuizz() {
  const element = document.querySelector("main")
  element.classList.add("hide")
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

function openQuiz(quiz){
  closeMain();
}

loadQuizzes();

