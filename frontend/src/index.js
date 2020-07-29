const sidenav = document.querySelector('.sidenav')
const buttonOptions = document.querySelector('.buttons')
const quizContent = document.querySelector('#quiz')
let currentSlide

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
    buttonOptions.innerHTML = ''
    // setting timer
    quizContent.innerHTML = `
    <h3>Seconds remaining: <span id='timer'>90</span></h3>`
    let count = 89
    let interval = setInterval(() => {
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

  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function previousSlide() {
    showSlide(currentSlide - 1);
  }