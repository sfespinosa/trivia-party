const sidenav = document.querySelector('.sidenav')
const quizContent = document.querySelector('#quiz')
const createQuizButton = document.getElementById('create-quiz-button')
const quizForm = document.getElementById('quiz-form')
const questionsForm = document.getElementById('questions-form')
createQuizButton.addEventListener('click', () => buildListForm())

const buttonOptions = document.querySelector('.buttons')
let currentSlide
let interval


async function fetchList() {
    let response = await fetch('http://localhost:3000/lists')
    let json = await response.json()
    json.forEach(list => buildNav(list))
} 
fetchList()

const buildNav = (list) => {
    let span = document.createElement('span')
    span.textContent = list.title
    sidenav.appendChild(span)
    span.addEventListener('click', () => generateQuiz(list))
}

const generateQuiz = (list) => {
    quizForm.style.display = 'none'
    questionsForm.style.display = 'none'
    buttonOptions.innerHTML = ''

    // setting timer
    quizContent.innerHTML = `
    <h3>Seconds remaining: <span id='timer'>90</span></h3>`
    let count = 89
    clearInterval(interval)
    interval = setInterval(() => {
        document.getElementById('timer').textContent = count
        count--;
        if (count === 0){
            clearInterval(interval)
            showResults(correctAnswers)
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
        questionDiv.className = `question-${questionNumber}`
        let h2 = document.createElement('h2')
        h2.textContent = question.question
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
    previousButton.addEventListener('click', () => previousSlide())

    // next button
    let nextButton = document.createElement('button')
    nextButton.textContent = "Next Question"
    nextButton.id = 'next'
    nextButton.addEventListener('click', () => nextSlide())

    // submit button
    let submitButton = document.createElement('button')
    submitButton.textContent = "Submit Quiz"
    submitButton.id = 'submit'
    submitButton.addEventListener('click', () => {
        clearInterval(interval)
        showResults(correctAnswers)
    })

    buttonOptions.append(previousButton, nextButton, submitButton)

    showSlide(currentSlide)
}

const generateAnswerChoice = (answer, id) => {
    let label = document.createElement('label')
    let input = document.createElement('input')
    input.type = 'radio'
    input.value = answer
    input.name = `question-${id}`
    label.textContent = answer
    label.prepend(input)
    return label
}

const showResults = (correctAnswers) => {
    buttonOptions.innerHTML = ''
    let answersCorrectCount = 0
    for (let i = 0; i < correctAnswers.length; i++) {
        if (document.querySelector(`input[name='question-${i+1}']:checked`)) {
            let userInput = document.querySelector(`input[name='question-${i+1}']:checked`).value
            if (correctAnswers[i] === userInput) {
                answersCorrectCount++
            }
        }
    }
    quizContent.textContent = `You got ${answersCorrectCount} out of ${correctAnswers.length} correct!`
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
    quizContent.textContent = ''
    document.getElementById('submit-quiz').style.display='none'
    questionsForm.style.display='none'
    quizForm.style.display='block'
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
    console.log(newList)
    quizForm.reset()
    buildQuestionsForm(newList)
}

const buildQuestionsForm = (newList) => {
    quizForm.style.display = 'none'
    questionsForm.style.display = 'block'
    for (i = 1; i < 11; i++) {
        let div = document.createElement('div')
        div.innerHTML = `
            <label for="question">Question ${i}:</label><br>
            <textarea rows="3" cols="50" name="question${1}" id="q${i}"></textarea><br><br>
            <label for="correct-answer">Correct answer:</label><br>
            <input type="text" name="correct" id="correct${i}"><br><br>
            <label for="incorrect-answer">Incorrect answer 1:</label><br>
            <input type="text" name="incorrect" id="incorrecta${i}"><br><br>
            <label for="incorrect-answer">Incorrect answer 2:</label><br>
            <input type="text" name="incorrect" id="incorrectb${i}"><br><br>
            <label for="incorrect-answer">Incorrect answer 3:</label><br>
            <input type="text" name="incorrect" id="incorrectc${i}"><br><br>
        `
        questionsForm.appendChild(div)
    }
    let button = document.createElement('button')
    button.id = 'create-quiz'
    button.type = 'submit'
    button.textContent = 'Create Quiz'
    questionsForm.appendChild(button)
    questionsForm.addEventListener('submit', (e) => postQuestions(e, newList))
}

async function postQuestions(e, newList) {
    e.preventDefault()
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
    buildNav(newList)
    console.log('questions done')
}

  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function previousSlide() {
    showSlide(currentSlide - 1);
  }

