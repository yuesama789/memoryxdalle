const selectors = {
    boardContainer: document.querySelector('.board-container'),
    moves: document.querySelector('.moves'),
    reset: document.querySelector('button'),
    win: document.querySelector('.win'),
    cardBox: document.querySelector('.box')
}

const state = {
    gameStarted: false,
    openedCards: 0,
    totalAttempts: 0
}

const cards = [
    '/img/shiba_inu.png',
    '/img/tabby_cat.png',
    '/img/raccoon.png',
    '/img/squirrell.png'
]


// RESTART GAME
const resetGame = () => {
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

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}


// BUILD GAME
const initiateGame = () => {
    const items = shuffle([...cards, ...cards])
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
        selectors.moves.innerText = `${state.totalAttempts} moves`
        
        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // end of game, when no cards are left
    if (!document.querySelectorAll('.card:not(.opened)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('opened')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalAttempts}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
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