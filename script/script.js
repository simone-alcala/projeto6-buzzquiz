
function loadQuizzes(){
  let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  
  promise.then(renderQuizzes);
  promise.catch( erro => {

    console.error(erro.response);
    alert("Não carregou - DEPOIS VOU TIRAR A MENSAGEM");
  });

}

function renderQuizzes (promise){
  let quizzes = promise.data;
  let allQuizzes = document.querySelector(".allQuizzes");
  allQuizzes.innerHTML="";
  quizzes.forEach(quiz => {
    allQuizzes.innerHTML +=
      `<div class="quiz">
          <img src="${quiz.image}" alt="" />
          <a href="#" >${quiz.title}</a>
      </div> `
  });
}

loadQuizzes();

//-- CRIAR QUIZZ --//
function createNewQuizz() {
  const element = document.querySelector("main")
  element.classList.add("hide")
}