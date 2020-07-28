const sidenav = document.querySelector('.sidenav')
// const mainBody = document.querySelector('.main')
const quizContent = document.querySelector('#quiz')

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