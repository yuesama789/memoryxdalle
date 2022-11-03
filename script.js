const selectors = {
    moves: document.querySelector('.moves'),
    reset: document.querySelector('button'),
    end: document.querySelector('.end'),
    cardBox: document.querySelector('.box')
}

const state = {
    gameStarted: false,
    openedCards: 0,
    totalAttempts: 0
}

const cards = [
    [
        '/img/shiba_inu.png',
        '/img/tabby_cat.png',
        '/img/raccoon.png',
        '/img/squirrell.png'
    ],
    [
        '/img/impress_1.png',
        '/img/impress_2.png',
        '/img/impress_3.png',
        '/img/impress_4.png'
    ],
    [
        '/img/paint_1.png',
        '/img/paint_2.png',
        '/img/paint_3.png',
        '/img/paint_4.png'
    ],
    [
        '/img/vader_1.png',
        '/img/vader_2.png',
        '/img/vader_3.png',
        '/img/vader_4.png'
    ],
    [
        '/img/witch_1.png',
        '/img/witch_2.png',
        '/img/witch_3.png',
        '/img/witch_4.png'
    ]
    
]

const setNames = [
    'Pets with Hats',
    'AI-mpressionism',
    'Historically Accurate',
    'Darth Vader in the style of Edward Hopper',
    'A witch relaxing in the bath in her woodland cabin'
]

let playedSet = 0


// RESTART GAME
const resetGame = () => {

    // closes end card if opened
    selectors.end.classList.remove('opened')

    // reset move counter
    selectors.moves.innerHTML = `<span class="move-count">0</span> moves`

    // resets all cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('opened', 'matched')
    })

    state.openedCards = 0
    state.totalAttempts	= 0

    initiateGame()
    
}

// SHUFFLE ITEMS
const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        // switching card positions
        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}


// BUILD GAME
const initiateGame = () => {

    // RANDOMIZE SET SELECT
    let setCount = cards.length
    const randomSet = Math.floor(Math.random() * (setCount))
    playedSet = randomSet


    const items = shuffle([...cards[randomSet], ...cards[randomSet],])
    let cardContainer = `
        <div class="board">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}"></div>
                </div>
            `).join('')}
       </div>
    `
    let parser = new DOMParser().parseFromString(cardContainer, 'text/html')
    
    document.querySelector('.board').replaceWith(parser.querySelector('.board'))

    console.log('new game started')

}

// FLIP BACK CARDS
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('opened')
    })

    state.openedCards = 0

    
}


// CARDS INTERACTIONS
const flipCard = card => {
    state.openedCards++

    if (!state.gameStarted) {
        state.gameStarted = true
    }

    if (state.openedCards <= 2) {
        card.classList.add('opened')
    }

    if (state.openedCards === 2) {

        //collect all open cards which is not matched
        const openedCards = document.querySelectorAll('.opened:not(.matched)')

        //compare collected cards
        if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
            openedCards[0].classList.add('matched')
            openedCards[1].classList.add('matched')
        }

        //Attempt Counter Update
        state.totalAttempts++
        selectors.moves.innerHTML = `<span class="move-count">${state.totalAttempts}</span> moves`
        
        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // end of game, when no cards are left
    if (!document.querySelectorAll('.card:not(.opened)').length) {
        console.log('end of game')
        setTimeout(() => {
            selectors.end.classList.add('opened')
            selectors.end.innerHTML = `
                <span class="win-text">
                    👍 Good Job!<br>
                    You played the set<br>
                    <span class="styled">${setNames[playedSet]}</span><br>
                    and won the round
                    with <span class="highlight">${state.totalAttempts}</span> moves.
                    <button>Next Game</button>
                </span>
            `
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('opened')) {
            flipCard(eventParent)
        }
        else if (eventTarget.nodeName === 'BUTTON') {
            resetGame()
        }
    })
}

initiateGame()
attachEventListeners()