//-- VARIÁVEIS GLOBAIS --//
let arrayQuizzes       = [];
let arrayQuiz          = [];
let myQuizzes          = [];
let allQuizzesLessMine = [];

let qtQuizQuestions    = 0;
let qtQuizRightAnswers = 0;
let questionsAnswered  = 0;

let qntdCreateQuestion
let qntdCreateLevel

let titleQuiz 
let imageQuiz 

let answerList = []
let questionList = []
let levelList = []

//-- CARREGAR OS QUIZZES --//
function loadQuizzes(){
  let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promise.then( promises => {
    setArrayQuizzes(promises);
  });

  promise.catch( erro => {
    console.log(erro.response);
  });
}

function setArrayQuizzes(promise){
  arrayQuizzes = promise.data.slice();
  getMyQuizzes();
  renderQuizzes ();
}

function renderQuizzes (){

  window.scrollTo({ top: 0, behavior: 'smooth' }); 

  let yourQuizzes = document.querySelector(".yourQuizzes");
  let allQuizzes = document.querySelector(".allQuizzes");
  
  if (myQuizzes.length > 0){

    yourQuizzes.innerHTML=
     `<div class="yourQuizzes-title">
        <strong>Seus Quizzes</strong>
        <ion-icon name="add-circle" onclick="createNewQuizz()" ></ion-icon>
      </div>`;
    
    myQuizzes.forEach(quiz => {
      let quizImage = gradientImageQuiz(quiz.image);
      yourQuizzes.innerHTML += `<div class="quiz" style="${quizImage}"> <div onclick="openQuiz(${quiz.id})">${quiz.title}</div> </div> `;
    });
  }

  allQuizzes.innerHTML="";

  allQuizzesLessMine.forEach(quiz => {
    let quizImage = gradientImageQuiz(quiz.image);
    allQuizzes.innerHTML += `<div class="quiz" style="${quizImage}"> <div onclick="openQuiz(${quiz.id})">${quiz.title}</div> </div> `;
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
    titleQuiz = value
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
    imageQuiz = str
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
  let cardsOk = [];

  for (let i = 0; i < qntdCreateQuestion; i++) {
    card = document.querySelector(`.another-question.card${i+1}`)
    let va1 = validateAllTitle(card)
    let va2 = validateAllRightAnswer(card)
    let va3 = validateFirstWrongAnswer(card)
    let va4 = validateOtherWrongAnswer(card)

    if (va1 === true && va2 === true && va3 === true && va4 === true) {
      cardsOk.push(card);
      //questionObject(card)
      validate = true
    } else {
      cardsOk = [];
      validate = false
    }
  }

  if (validate === true) {
    cardsOk.forEach(element => { 
      answerList = [];
      validateAllRightAnswer(element)
      validateFirstWrongAnswer(element)
      validateOtherWrongAnswer(element)
      questionObject(element);  
    });

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
    rigthAnswerObject(element[0].value, element[1].value)
    return true
  }
}

function validateFirstWrongAnswer(card) {
  const element = card.querySelectorAll(".wrong-answer.wrong1 input")
  const answer = validateNewQuestionAnswer(element[0].value)
  const url = validateUrl(element[1].value)
  if ( answer === true && url === true) {
    wrongAnswerObject(element[0].value, element[1].value)
    return true
  }
}

function validateOtherWrongAnswer(card) {
  let element
  let answer
  let url
  for (let i = 0; i < 2; i++) {
    element = card.querySelectorAll(`.wrong-answer.wrong${i+2} input`)
    if ( element[0].value != "" && element[1].value != "") {
      answer = validateNewQuestionAnswer(element[0].value)
      url = validateUrl(element[1].value)
      if (answer === true && url === true) {
        //wrongAnswerObject(element[0].value, element[1].value)
        validate = true
      } else {
        validate = false
      }
    } else if (element[0].value == "" && element[1].value == ""){
      //alert("a")
      return true 
    } else if (element[0].value != "" && element[1] == "") {
      //alert("b")
      return false
    } else { 
      alert("Complete o campo de resposta corretamente!")
      break;
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
  showNewLevels()
}

function showNewLevels() {
  const element = document.querySelector(".creating-levels")
  for (let i = 0; i < qntdCreateLevel; i++) {
    element.innerHTML += `<div class="level card${i+1}">
                            <div class="another-level" onclick="openCreateLevel(this)">
                              <h2>Nível ${i+1}</h2>
                              <ion-icon name="create-outline"></ion-icon>
                            </div>
                            <div class="white hide">
                              <input type="text" placeholder="Título do nível">
                              <input type="number" placeholder="% de acerto mínima">
                              <input type="text" placeholder="URL da imagem do nível">
                              <input type="text" placeholder="Descrição do nível" class="bigger">
                            </div>
                          </div>`
  }
}

function openCreateLevel(level) {
  const all = level.parentNode
  all.children[1].classList.toggle("hide") 
}

function validateNewLevels() {
  let card 
  let validate
  let cardsOk = [];

  for (let i = 0; i < qntdCreateLevel; i++) {
    card = document.querySelector(`.level.card${i+1}`)
    let va1 = validateAllCard(card)
    if (va1 === true ) {
      cardsOk.push(card);
      //levelObject(card)
      validate = true
    } else {
      cardsOk = [];
      validate = false
    }
  }

  if (validate === true) {
    cardsOk.forEach(element => { levelObject(element);  });
    createSucess()
  }
}

function validateAllCard(card) {
  const element = card.querySelectorAll(".white input")
  const title = validateNewLevelTitle(element[0].value)
  const percentage = validateNewLevelPercentage(element[1].value)
  const url = validateUrl(element[2].value)
  const description = validateNewLevelDescription(element[3].value)
  if (title === true && percentage === true && url === true && description === true) {
    return true
  }
}

function validateNewLevelTitle(value) {
  if ( value < 10) {
    alert("Complete os títulos corretamente!")
    return false
  } else {
    return true
  }
}

function validateNewLevelPercentage(value) {
  if ( value < 0 || value > 100) {
    alert("Complete a porcentagem corretamente!")
    return false
  } else {
    return true
  }
}

function validateNewLevelDescription(value) {
  if ( value < 30) {
    alert("Complete as descrições corretamente!")
    return false
  } else {
    return true
  }
}

function validateAtLeastOneZero(value1) {
  if ( value1 !== 0 ) {
    alert("Complete os níveis corretamente!")
    return false
  } else {
    return true
  }
}

//-- ENVIAR OBJETO --//
function completeObject() {
  let object = {
    title: titleQuiz ,
    image: imageQuiz,
    questions: questionList,
    levels:levelList
  }
  return object
}

function questionObject(card) {
  const element = card.querySelectorAll(".text-question input")
  const object = {
    title: element[0].value,
    color: element[1].value,
    answers: answerList
  }
  answerList = []
  questionList.push(object)
}

function rigthAnswerObject(answer, url) {
  const object = {
    text: answer,
    image: url,
    isCorrectAnswer: true
  }
  answerList.push(object)
}

function wrongAnswerObject(answer, url) {
  const object = {
    text: answer,
    image: url,
    isCorrectAnswer: false
  }
  answerList.push(object)
}

function levelObject(card) {
  const element = card.querySelectorAll(".white input")
  const object = {
    title: element[0].value,
    image: element[2].value,
    text: element[3].value,
    minValue: element[1].value
  }
  levelList.push(object)
}

//-- QUIZZ CRIADO COM SUCESSO --// 
function createSucess() {
  let newQuiz = completeObject();
  sendQuiz(newQuiz);
}

function sendQuiz(newQuiz){
  let promise = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", newQuiz );
  
  promise.then( promise => {
    setLocalStorage(promise.data.id);
  });

  promise.catch( erro => {
    console.log(erro.response);
  });
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

  qtQuizRightAnswers = 0;
  questionsAnswered  = 0;

  document.querySelector("head").scrollIntoView(true);

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
          <div class = "answers" >`;

        question.answers.sort(shuffle);  

        question.answers.forEach(answer => {
          let alt = getImageName(answer.image);
          answeringQuizHTML += `
            <div class="answer" onclick="answerQuestion(this)">
              <img src="${answer.image}" alt="${alt}" />
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

  questionsAnswered ++;

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
    setTimeout( () => nextQuestion.scrollIntoView({behavior: "smooth", block: "center"}), 2000 );
  } 

  if (questionsAnswered == qtQuizQuestions){
    setTimeout( calculateScore, 2000 );
  }
}

function calculateScore(){
  let scoreInfo = null;
  let score = Math.round( (qtQuizRightAnswers/qtQuizQuestions*100) );

  arrayQuiz[0].levels.sort( (firstElement, secondElement) => firstElement.minValue - secondElement.minValue );

  scoreInfo = arrayQuiz[0].levels[0];

  arrayQuiz[0].levels.forEach(level => {

    if (level.minValue <= score){
      scoreInfo = level;
    }
  });

  renderScore(scoreInfo,score)

}

function renderScore(scoreInfo,score){

  let answeringQuiz = document.querySelector(".answeringQuiz");

  let alt = getImageName(scoreInfo.image);
  answeringQuiz.innerHTML += 

       `<div class="score"> 
          <div class="title"> ${score}% de acerto: ${scoreInfo.title}</div>
          <img src="${scoreInfo.image}" alt="${alt}" />
          <strong>${scoreInfo.text}</strong>
        </div> 
        
        <div class="restart-quizz" onclick="restartQuizz()">Reiniciar Quizz</div>
        <div class="return-home"   onclick="returnHome()">Voltar para home</div> `;

  document.querySelector(".score").scrollIntoView({behavior: "smooth", block: "center"})      
}

function restartQuizz(){
  
  document.querySelector(".answeringQuiz .title").scrollIntoView({ block:"end"});
  renderQuiz(arrayQuiz);
}

function returnHome(){
  document.querySelector(".answeringQuiz").innerHTML="";
  arrayQuiz  = [];
  loadQuizzes();
  showMain();
}

function closeQuizz(){
  document.querySelector(".answeringQuiz").classList.add("hidden");
}

function getImageName(imageURL){
  let index = imageURL.lastIndexOf("/");
  return imageURL.substring(index + 1);
}

function setLocalStorage(idMyNewQuiz){

  let myLocalQuizzes = [];
  if (getLocalStorage() !== null){
    myLocalQuizzes = JSON.parse(getLocalStorage())
  } 

  myLocalQuizzes.push(idMyNewQuiz);
  localStorage.setItem( "idMyNewQuiz",JSON.stringify(myLocalQuizzes) );
}

function getLocalStorage(){
  return localStorage.getItem( "idMyNewQuiz" );
}

function getMyQuizzes(){ 

  allQuizzesLessMine = [];
  myQuizzes = [];

  if (getLocalStorage() !== null){
    let myQuizzesArray = JSON.parse(getLocalStorage());
    arrayQuizzes.forEach(quiz => {      
      if ( myQuizzesArray.includes(quiz.id) ){
        myQuizzes.push(quiz);
      } else {
        allQuizzesLessMine.push(quiz);
      }
    });
  } else {
    allQuizzesLessMine = arrayQuizzes.slice();
  }
}

loadQuizzes();


