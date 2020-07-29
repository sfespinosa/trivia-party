const sidenav = document.querySelector('.sidenav')
// const mainBody = document.querySelector('.main')
const quizContent = document.querySelector('#quiz')
// const submitButton = document.querySelector('#submit')
// submitButton.addEventListener('click', () => showResults())

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
    generateTimer()
    let form = document.createElement('form')
    let correctAnswers = []
    let questionNumber = 1
    list['questions'].forEach(question => {
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
        questionDiv.appendChild(answersDiv)
        form.appendChild(questionDiv)

        questionNumber++
    })
    let submitButton = document.createElement('button')
    submitButton.textContent = "Submit"
    submitButton.addEventListener('click', () => showResults(correctAnswers))

    // form.addEventListener('submit', (e) => showResults(e, correctAnswers))
    form.appendChild(submitButton)

    quizContent.appendChild(form)
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

const generateTimer = () => {
    quizContent.innerHTML = `
    <h3>Seconds remaining: <span id='timer'>90</span></h3>`
    let count = 89
    let interval = setInterval(() => {
        document.getElementById('timer').textContent = count
        count--;
        if (count === 0){
            clearInterval(interval);
            showResults(correctAnswers);
        }
    }, 1000)
}