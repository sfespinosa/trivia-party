let currentSlide
let interval
let currentUser
let userTestResults

// Login pages
const welcomePageDiv = document.querySelector('.welcome-page')
const createUserDiv = document.querySelector('.create-user')
const loginUserDiv = document.querySelector('.login')
const createUserButton = document.getElementById('create-user-button')
createUserButton.addEventListener('click', () => {
    welcomePageDiv.style.display = 'none'
    createUserDiv.style.display = 'block'
    sidenav.style.display = 'block'
    quizContainer.style.display = 'none'
})
const loginUserButton = document.getElementById('login-user-button')
loginUserButton.addEventListener('click', () => {
    welcomePageDiv.style.display = 'none'
    loginUserDiv.style.display = 'block'
    sidenav.style.display = 'block'
    quizContainer.style.display = 'none'
})
const createUserForm = document.getElementById('create-user')
createUserForm.addEventListener('submit', (e) => createUser(e))
const loginForm = document.getElementById('login')
loginForm.addEventListener('submit', (e) => loginUser(e))
const frontPage = document.querySelector('div.front-page')


// Side nav
const sidenav = document.querySelector('.sidenav')
let profileButton = document.getElementById('view-profile-button')
profileButton.addEventListener('click', () => {
    quizContainer.style.display = 'none'
    quizForm.style.display = 'none'
    buttonOptions.style.display = 'none'
    resultsList.style.display = 'block'
    frontPage.style.display = 'block'
    resultsPage.style.display = 'none'
    fetchUserScores(currentUser)

})

// Main body
const quizContent = document.querySelector('#quiz')
const quizContainer = document.querySelector('.quiz-container')
const createQuizButton = document.getElementById('create-quiz-button')
const quizForm = document.getElementById('quiz-form')
const questionsForm = document.getElementById('questions-form')
createQuizButton.addEventListener('click', () => buildListForm())
const buttonOptions = document.querySelector('.buttons')
const userProgressBar = document.getElementById('user-progress-bar')
const deleteUserButton = document.getElementById('delete-user-button')
deleteUserButton.addEventListener('click', () => deleteUser())
const resultsPage = document.querySelector('div.user-results')
const resultsList = document.querySelector('div.list-results')

async function createUser(e) {
    e.preventDefault()
    let data = {name: e.target.name.value}
    let response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    let json = await response.json()
    if (json['error']) {
        alert(json['error'])
    } else {
        currentUser = json
        loginUserDiv.style.display = 'none'
        createUserDiv.style.display = 'none'
        frontPage.style.display = 'block'
        createQuizButton.style.display = 'block'
        profileButton.style.display = 'block'
        sidenav.style.display = 'block'
        fetchList()
    }
}

async function loginUser(e) {
    e.preventDefault()
    let response = await fetch(`http://localhost:3000/users/?name=${e.target.name.value}`)
    let json = await response.json()
    if (json['error']) {
        alert(json['error'])
    } else {
        currentUser = json
        loginUserDiv.style.display = 'none'
        createUserDiv.style.display = 'none'
        frontPage.style.display = 'block'
        createQuizButton.style.display = 'block'
        profileButton.style.display = 'block'
        sidenav.style.display = 'block'
        fetchUserScores(currentUser)
        fetchList()
    }
}

async function deleteUser() {
    let response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {method: 'DELETE'})
    let json = await response.json()
    welcomePageDiv.style.display = 'block'
    createUserDiv.style.display = 'none'
    loginUserDiv.style.display = 'none'
    frontPage.style.display = 'none'
    quizContainer.style.display = 'none'
    buttonOptions.style.display = 'none'
    resultsList.style.display = 'none'
    quizForm.style.display = 'none'
    sidenav.style.display = 'none'
    deleteUserButton.style.display = 'none'
    alert(json['message'])
}

async function fetchList() {
    let response = await fetch('http://localhost:3000/lists')
    let json = await response.json()
    json.forEach(list => buildNav(list))
} 


const buildNav = (list) => {
    let span = document.createElement('span')
    span.textContent = list.title
    sidenav.appendChild(span)
    span.addEventListener('click', () => generateQuiz(list))

}

const generateQuiz = (list) => {
    userOnList(list.id, currentUser.id)
    frontPage.style.display = 'none'
    quizForm.style.display = 'none'
    questionsForm.style.display = 'none'
    createUserDiv.style.display = 'none'
    loginUserDiv.style.display = 'none'
    quizContainer.style.display = 'block'
    resultsList.style.display = 'none'
    resultsPage.style.display = 'none'
    buttonOptions.style.display = 'block'
    buttonOptions.innerHTML = ''

    // setting timer
    quizContent.innerHTML = `
    <h4>Time remaining: <span id='timer'>90</span></h4>`
    let count = 89
    clearInterval(interval)
    interval = setInterval(() => {
        document.getElementById('timer').textContent = count
        count--;
        if (count === 0){
            clearInterval(interval)
            showResults(correctAnswers, list.id)
        }
    }, 1000)

    let correctAnswers = []
    let questionNumber = 1
    currentSlide = 0

    list['questions'].forEach(question => {
        // slide div
        let slideDiv = document.createElement('div')
        slideDiv.className = 'slide'

        // question
        let questionDiv = document.createElement('div')
        questionDiv.className = `question`
        let h2 = document.createElement('h2')
        h2.innerHTML = `<strong>${question.question}</strong>`
        questionDiv.appendChild(h2)

        // answers
        let answerOptions = []
        let answersDiv = document.createElement('div')
        answersDiv.className = 'answers'
        answerOptions.push(generateAnswerChoice(question.correct_answer, questionNumber))
        correctAnswers.push(question.correct_answer)

        question.incorrect_answers.forEach(answer => {
            answerOptions.push(generateAnswerChoice(answer, questionNumber))
        })
        answerOptions.sort(() => Math.random() - 0.5)
        answerOptions.forEach(answer => answersDiv.appendChild(answer))
        slideDiv.append(questionDiv, answersDiv)
        quizContent.appendChild(slideDiv)

        questionNumber++
    })
    // previous button
    let previousButton = document.createElement('button')
    previousButton.textContent = "Previous Question"
    previousButton.id = 'previous'
    previousButton.className = 'primary_btn'
    previousButton.addEventListener('click', () => previousSlide())

    // next button
    let nextButton = document.createElement('button')
    nextButton.textContent = "Next Question"
    nextButton.id = 'next'
    nextButton.className = 'primary_btn'
    nextButton.addEventListener('click', () => nextSlide())

    // submit button
    let submitButton = document.createElement('button')
    submitButton.textContent = "Submit Quiz"
    submitButton.id = 'submit'
    submitButton.className = 'primary_btn'
    submitButton.addEventListener('click', () => {
        clearInterval(interval)
        showResults(correctAnswers, list.id)
    })

    buttonOptions.append(previousButton, nextButton, submitButton)
    userProgressBar.style.width = '0%'
    showSlide(currentSlide)
}

const generateAnswerChoice = (answer, id) => {
    let label = document.createElement('label')
    let input = document.createElement('input')
    input.type = 'radio'
    input.value = answer
    input.name = `question-${id}`
    label.innerHTML = ` ${answer}`
    label.prepend(input)
    return label
}

const showResults = (correctAnswers, listId) => {
    buttonOptions.style.dispaly = 'none'
    quizContainer.style.display = 'none'
    let answersCorrectCount = 0
    for (let i = 0; i < correctAnswers.length; i++) {
        if (document.querySelector(`input[name='question-${i+1}']:checked`)) {
            let userInput = document.querySelector(`input[name='question-${i+1}']:checked`).value
            if (correctAnswers[i] === userInput) {
                answersCorrectCount++
            }
        }
    }
    postScore(answersCorrectCount, listId)
}

function showSlide(n) {
    const slides = document.querySelectorAll(".slide");
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const submitButton = document.querySelector('#submit')
    currentSlide = n;
    if(currentSlide === 0){
      previousButton.style.display = 'none';
    }
    else{
      previousButton.style.display = 'inline-block';
    }
    if(currentSlide === slides.length-1){
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    }
    else{
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }
}

const buildListForm = () => {
    buttonOptions.style.display = 'none'
    resultsList.style.display = 'none'
    resultsPage.style.display = 'none'
    frontPage.style.display = 'none'
    quizContainer.style.display = 'none'
    questionsForm.style.display = 'none'
    loginUserDiv.style.display = 'none'
    resultsList.style.display = 'none'
    quizForm.style.display = 'block'
    quizForm.addEventListener('submit', (e) => postList(e))
}

async function postList(e) {
    e.preventDefault()
    let data = {
        title: e.target.title.value,
        category: e.target.category.value
    }
    let response = await fetch('http://localhost:3000/lists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let newList = await response.json()
    quizForm.reset()
    buildQuestionsForm(newList)
}

const buildQuestionsForm = (newList) => {
    quizForm.style.display = 'none'
    questionsForm.style.display = 'block'
    questionsForm.innerHTML = ''
    for (i = 1; i < 11; i++) {
        let div = document.createElement('div')
        div.innerHTML = `
            <div class="card-column">
            <div class="card">
            <label for="question">Question ${i}:</label>
            <textarea rows="3" cols="50" name="question${1}" id="q${i}"></textarea><br>
            <label for="correct-answer">Correct answer:</label>
            <input type="text" name="correct" id="correct${i}"><br>
            <label for="incorrect-answer">Incorrect answer 1:</label>
            <input type="text" name="incorrect" id="incorrecta${i}"><br>
            <label for="incorrect-answer">Incorrect answer 2:</label>
            <input type="text" name="incorrect" id="incorrectb${i}"><br>
            <label for="incorrect-answer">Incorrect answer 3:</label>
            <input type="text" name="incorrect" id="incorrectc${i}">
            </div>
            </div>
        `
        questionsForm.appendChild(div)
    }
    let button = document.createElement('button')
    button.id = 'create-quiz'
    button.type = 'submit'
    button.className = 'primary_btn'
    button.textContent = 'Create Quiz'
    questionsForm.appendChild(button)
    questionsForm.addEventListener('submit', (e) => postQuestions(e, newList))
}

async function postQuestions(e, newList) {
    e.preventDefault()
    // debugger
    for (i = 1; i < 11; i++) {
        let q = document.getElementById(`q${i}`).value
        let correct = document.getElementById(`correct${i}`).value
        let incorrecta = document.getElementById(`incorrecta${i}`).value
        let incorrectb = document.getElementById(`incorrectb${i}`).value
        let incorrectc = document.getElementById(`incorrectc${i}`).value
        let data = {
            question: q,
            question_type: 'multiple',
            category: newList.category,
            difficulty: 'medium',
            correct_answer: correct,
            incorrect_answers: [incorrecta, incorrectb, incorrectc],
            list_id: newList.id
        }
        let response = await fetch('http://localhost:3000/questions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
            body: JSON.stringify(data)
        })
    }
    let fetchNewList = await fetch(`http://localhost:3000/lists/${newList.id}`)
    let list = await fetchNewList.json()
    console.log('Questions done')
    buildNav(list)
    questionsForm.reset()
    questionsForm.style.display = 'none'
    quizContainer.style.display = 'none'
    quizForm.style.display = 'none'
    buttonOptions.style.display = 'none'
    frontPage.style.display = 'block'
}

const nextSlide = () => {
    showSlide(currentSlide + 1);
    let width = userProgressBar.style.width.replace(/\W/,"")
    userProgressBar.style.width = (parseInt(width, 10) + 10).toString() + '%'
  }
  
const previousSlide = () => {
    showSlide(currentSlide - 1);
    let width = userProgressBar.style.width.replace(/\W/,"")
    userProgressBar.style.width = (parseInt(width, 10) - 10).toString() + '%'
  }

async function postScore(score, listId){
    let verb
    let URL = `http://localhost:3000/scores`
    let data = {
        score: score,
        user_id: currentUser.id,
        list_id: listId
    }

    if (userTestResults) {
        verb = 'PATCH'
        URL = URL + `/${userTestResults.id}`
    } else {
        verb = 'POST'
    }

    let response = await fetch(URL, {
        method: verb,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let json = await response.json()
    displayResults(json)
}

const displayResults = (score) => {
    

    fetchListScores(score)

    resultsPage.style.display = 'block'
    resultsList.style.display = 'block'
    resultsPage.innerHTML = `
    <h1>You got ${score.score} questions correct!</h1>
    `
    resultsList.innerHTML = "<ol id='ranking'></ol>"
    const resultsOrderedList = document.getElementById('ranking')
    // resultsPage.textContent = `You got ${score.score} questions correct!`
}

async function fetchListScores(score) {
    let response = await fetch(`http://localhost:3000/scores?list_id=${score.list_id}`)
    let json = await response.json()
    json.sort((a,b) => b.score - a.score)
    json.forEach(score => buildAllScores(score))
}

const buildAllScores = (score) => {
    const resultsOrderedList = document.getElementById('ranking')
    resultsOrderedList.style.display = 'block'
    let li = document.createElement('li')
    li.textContent = `${score.user_name}: ${score.score}`
    resultsOrderedList.appendChild(li)
}

async function fetchUserScores(currentUser) {
    let response = await fetch(`http://localhost:3000/scores?user_id=${currentUser.id}`)
    let json = await response.json()
    resultsList.innerHTML = ''
    resultsList.innerHTML = '<h3>Your quiz scores:</h3>'
    json.sort((a,b) => b.score - a.score)
    json.forEach(score => buildUserScores(score))
}

const buildUserScores = (score) => {
    resultsList.style.display = 'block'
    let li = document.createElement('li')
    li.textContent = `${score.list_title}: ${score.score}`
    resultsList.appendChild(li)
}


const userOnList = (listId, userId) => {
    fetch(`http://localhost:3000/scores?user_id=${userId}&list_id=${listId}`)
    .then(response => response.json())
    .then(json => {
        console.log(json)
        userTestResults = json
    })
}
