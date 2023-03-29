let canvas = document.querySelector('#canvas1')
let ctx = canvas.getContext('2d')

canvas.width = 900
canvas.height = 400

// GLOBAL VARIABLES
let cellSize = 100
let cellGap = 3
let frames = 0
let enemySpawnTime = 500
let resources = 300

let cells = []
let defenders = []
let projectiles = []
let enemies = []

let mouseX = undefined
let mouseY = undefined

// collision function
const collision = (first, second) => { // the parameters are rectangles, i.e enemy, projectile, defenders
    if (!(first.x > second.x + second.width || // if starting x of first is more right than starting x of second rect + width, they dont colide
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)
    ) {
        return true
    }
}

// get the position of the mose when over the canvas
canvas.addEventListener('mousemove', function (event) {
    mouseX = event.offsetX
    mouseY = event.offsetY
    // console.log(mouseX, mouseY)
})

// ALL THE CLASSES I NEED

class Cell {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = cellSize
        this.height = cellSize
    }
    makeCell() {
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}

class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y
        this.health = 100
        this.width = cellSize
        this.height = cellSize
        this.cost = 100
        this.shootTime = 0
        this.damage = 20
    }
    placeDefender() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'gold'
        ctx.font = '20px Arial'
        ctx.fillText(Math.floor(this.health), this.x, this.y)
    }
    shoot() {
        this.shootTime++
        if (this.shootTime % 75 === 0) {
            projectiles.push(new Projectile(this.x, this.y))
        }
    }
}

class Enemy {
    constructor(verticalPosition) { // vertical position is where i want the enemy to randomly spawn
        this.x = x;
        this.y = verticalPosition
        this.width = cellSize
        this.height = cellSize
        this.speed = Math.random() * 0.2 + 0.4
        this.health = 100
        this.gainedResources = this.health / 2
        this.movement = this.speed
    }
    placeEnemy() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'black'
        ctx.font = '20px Arial'
        ctx.fillText(Math.floor(this.health), this.x, this.y + 30)
    }
    move() {
        this.x -= this.speed
    }
}

// function to make all the cells in the canvas
const createGameBoard = () => {
    for (let y = 0; y < canvas.height; y += cellSize) { // gets all the y valuse as multiples of 100
        for (let x = 0; x < canvas.width; x += cellSize) { // gets all x values as multiples of 100
            cells.push(new Cell(x, y))
        }
    }
}

createGameBoard()

// place a defender on the canvas depending on the mouse position

canvas.addEventListener('click', function (event) {
    let positionOfX = mouseX - (mouseX % cellSize) + cellGap // calculates x coordinate of the clicked cell, subtracts the remainder, and get the most left coordinate and offset it with the cellGap, which is 3
    let positionOfY = mouseY - (mouseY % cellSize) + cellGap // same with Y

    for(let i = 0; i < defenders.length;i++) {
        if (resources >= defenders[i].cost) {
            defenders.push(new Defender(positionOfX, positionOfY))
            resources -= defenders[i].cost
            console.log(defenders)
            break
        }
    }


    console.log(positionOfX, positionOfY)
})

const makeDefender = () => {
    for (let i = 0; i < defenders.length; i++) {
        defenders[i].placeDefender()
        console.log(defenders)
    }
}






const printCells = () => {
    for (let i = 0; i < cells.length; i++) {
        cells[i].makeCell()
    }
}

const animate = () => {
    printCells()
    makeDefender()
    requestAnimationFrame(animate) // recursive function to continue drawing the cells on the canvas
}
animate()

