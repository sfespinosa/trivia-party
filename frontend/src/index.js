const sidenav = document.querySelector('.sidenav')
const quizContent = document.querySelector('#quiz')
const createQuizButton = document.getElementById('create-quiz-button')
const quizForm = document.getElementById('quiz-form')
const questionsForm = document.getElementById('questions-form')
createQuizButton.addEventListener('click', () => buildListForm())

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
    quizContent.textContent = ''
    quizForm.style.display = 'none'
    questionsForm.style.display = 'none'
    list['questions'].forEach(question => {
        let div = document.createElement('div')
        // question
        let h2 = document.createElement('h2')
        h2.textContent = question.question
        div.appendChild(h2)

        // answers
        let answers = []

        quizContent.appendChild(div)

    })

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
    console.log('questions done')
}