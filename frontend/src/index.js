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
    let correctAnswers = []
    quizContent.textContent = ''
    let form = document.createElement('form')
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

    form.addEventListener('submit', (e) => showResults(e, correctAnswers))
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

const showResults = (e, correctAnswers) => {
    e.preventDefault()
    // debugger
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