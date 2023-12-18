const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")

const width = 8;
let playerGo = 'blackPiece'
playerDisplay.textContent = 'black'

const startPieces = 
[
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]

function createBoard()
{
    startPieces.forEach((startPiece, i) =>
    {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
        const row = Math.floor((63 - i) / 8) + 1
        if(row % 2 === 0)
        {
            square.classList.add(i % 2 === 0 ? "white" : "black")
        }
        else
        {
            square.classList.add(i % 2 === 0 ? "black" : "white")
        }

        if(i <= 15)
        {
            square.firstChild.firstChild.classList.add('blackPiece');
        }
        else if(i >= 48)
        {
            square.firstChild.firstChild.classList.add('whitePiece');
        }
        gameBoard.append(square)
    })
}


createBoard();

const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => 
{
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement

function dragStart(e)
{
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}
function dragOver(e)
{
    e.preventDefault()
}
function dragDrop(e)
{
    e.stopPropagation();
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo == 'whitePiece' ? 'blackPiece' : 'whitePiece'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)

    if(correctGo)
    {
        if(takenByOpponent && valid)
        {
            e.target.parentNode.append(draggedElement)
            e.target.remove();
            checkForWin()
            changePlayer()
            return
        }
        if(taken && !takenByOpponent)
        {
            infoDisplay.textContent = "you cannot go here!"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return
        }
        if(valid)
        {
            e.target.append(draggedElement)
            checkForWin()
            changePlayer()
            return
        }
    }
}
function changePlayer()
{
    if(playerGo === "blackPiece")
    {
        reverseIds();
        playerGo = "whitePiece"
        playerDisplay.textContent = "white"
    }
    else
    {
        revertIds();
        playerGo = "blackPiece"
        playerDisplay.textContent = "black"
    }
}
function reverseIds()
{
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - 1) - i))
}

function revertIds()
{
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', i))
}
function checkIfValid(target)
{
    const piece = draggedElement.id;

    switch(piece)
    {
        case 'pawn' :
            return checkIfPawnMoveValid(target); 
        case 'knight' : 
            return checkIfKnightMoveValid(target);
        case 'king' : 
            return checkIfKingMoveValid(target);
        case 'rook' :
            return checkIfRookMoveValid(target);
        case 'bishop' :
            return checkIfBishopMoveValid(target);
        case 'queen' :
            return checkIfQueenMoveValid(target);
    }
}

function checkIfPawnMoveValid(target)
{
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId);
    const startRow = [8,9,10,11,12,13,14,15]
    if(startRow.includes(startId) && startId + width * 2 === targetId ||
        startId + width === targetId ||
        startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
        startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild)
    {
        return true
    }
}
function checkIfKnightMoveValid(target)
{
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId);
    if(
        startId + width * 2 + 1 === targetId ||
        startId + width * 2 - 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId 
    )
    {
        return true;
    }
}
function checkIfKingMoveValid(target)
{
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const start_x = Math.trunc(Math.abs(startId) % width)
    const start_y = Math.trunc(Math.abs(startId) / width)
    const target_x = Math.trunc(Math.abs(targetId) % width)
    const target_y = Math.trunc(Math.abs(targetId) / width)
    const diff_x = Math.abs(Number(target_x - start_x))
    const diff_y = Math.abs(Number(target_y - start_y))
    return (diff_x === 0 || diff_x === 1) && (diff_y === 0 || diff_y === 1)
}
function checkIfQueenMoveValid(target)
{
    return checkIfRookMoveValid(target) || checkIfBishopMoveValid(target)
}
function checkIfRookMoveValid(target)
{
    //Check if target is straight from start
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const start_x = Math.trunc(Math.abs(startId) % width)
    const start_y = Math.trunc(Math.abs(startId) / width)
    const target_x = Math.trunc(Math.abs(targetId) % width)
    const target_y = Math.trunc(Math.abs(targetId) / width)
    const diff_x = Number(target_x - start_x)
    const diff_y = Number(target_y - start_y)
    const isStraight = (diff_x === 0 || diff_y == 0)
    //Now make sure there are no pieces between the target and start
    if(isStraight)
    {
        for(let i = 1; i < Math.abs(diff_x); i++)
        {
            const checking_x = start_x + i * Math.sign(diff_x)
            const checking_y = start_y + i * Math.sign(diff_y)
            const checkingId = checking_y * width + checking_x
            if(document.querySelector(`[square-id="${checkingId}"]`)?.firstChild)
            {
                return false
            }
        }
        return true
    }
    return false
}
function checkIfBishopMoveValid(target)
{
    //Check if target is diagonal from start
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const start_x = Math.trunc(Math.abs(startId) % width)
    const start_y = Math.trunc(Math.abs(startId) / width)
    const target_x = Math.trunc(Math.abs(targetId) % width)
    const target_y = Math.trunc(Math.abs(targetId) / width)
    const diff_x = Number(target_x - start_x)
    const diff_y = Number(target_y - start_y)
    const isDiagonal = Math.abs(diff_x) === Math.abs(diff_y)
    //Now make sure there are no pieces between the target and start
    if(isDiagonal)
    {
        for(let i = 1; i < Math.abs(diff_x); i++)
        {
            const checking_x = start_x + i * Math.sign(diff_x)
            const checking_y = start_y + i * Math.sign(diff_y)
            const checkingId = checking_y * width + checking_x
            if(document.querySelector(`[square-id="${checkingId}"]`)?.firstChild)
            {
                return false
            }
        }
        return true
    }
    return false
}
function checkForWin()
{
    const kings = Array.from(document.querySelectorAll('#king'))
    if(!kings.some(king => king.firstChild.classList.contains('whitePiece')))
    {
        infoDisplay.innerHTML = "Black player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    else if(!kings.some(king => king.firstChild.classList.contains('blackPiece')))
    {
        infoDisplay.innerHTML = "White player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}