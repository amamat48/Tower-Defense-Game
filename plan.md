WHAT DO I NEED TO FINISH THIS GAME?

1. learn how to use html canvas

2. classes for the defenders, enemies, and projectiles and cell

class Defender {
    constructor (x, y) {
        this.x = x;
        this.y = y
        this.health = 100
        this.width =  cellSize
        this.height = cellSize
        this.cost = 100
        this.shootTime = 0
        this.damage = 20
    }
    placeDefender() {
        context.fillStyle = 'blue'
        context.fillRect(this.x, this.y, this.width, this.height)
        context.fillStyle = 'gold'
        context.font = '20px Arial'
        context.fillText(Math.floor(this.health), this.x, this.y + 30)
    }
    shoot() {
        this.shootTime++
        if (this.shootTime % 75 === 0) {
            projectiles.push(new Projectile(this.x, this.y))
        }
    }
}
class Enemy {
    constructor (verticalPosition) {
        this.x = x;
        this.y = verticalPosition
        this.width = cellSize
        this.height = cellSize
        this.speed = Math.random() * 0.2 + 0.4
        this.health = 100
        this.gainedResources = this.health/2
        this.movement  = this.speed
    }
    placeEnemy() {
        context.fillStyle = 'red'
        context.fillRect(this.x, this.y, this.width, this.height)
        context.fillStyle = 'black'
        context.font = '20px Arial'
        context.fillText(Math.floor(this.health), this.x, this.y + 30)
    }
    move() {
        this.x -= this.speed
    }
}

class Projctile {
    constructor (x, y) {
        this.x = x
        this.y = y
        this.speed = 5
        this.power = 25
    }
    placeProjectile() {
        context.fillStyle = 'black'
        context.beginPath()
        context.arc(this.x, this.y, this.width, 0, Math.PI * 2)
        context.fill()
    }
    move() {
        this.x += this.speed
    }
}

class Cell {
    constructor (x, y) {
        this.x = x
        this.y = y
        this.width = cellSize
        this.height =  cellSize
    }
    makeCell() {
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}


3. how to find the position of the mouse at any given time
mouseX = undefined
mouseY = undefined

canvas.addEventListener('mousemove' function(event) {
    mouseX = event.offsetX
    mouseY = event.offsetY
})

4. how to detect collision between an enemy and defender or enemy and projectile

const collision = (first, second) => { // the parameters are rectangles, i.e enemy, projectile, defenders
    if (!(first.x > second.x + second.width || // if starting x of first is more right than starting x of second rect + width, they dont colide
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)
    ) {
        return true
    }
}

5. need to track movement
let Enemy spawn time = 500
let frames = 0
frames++

if(frames % enemy spawn time === 0 ) {
    let the enemy spawn
}



6. need to make the game board
let cells = []

const createGameBoard = () => {
    for (let y = cellSize; y < canvas.height; y += cellSize) {
        for (let x = cellSize; x < canvas.width; x += cellSize) {
            gameBoard.push(new Cell(x, y))
    }
}

7. how big i want each cell

cellSize = 100

8. how i can remove a defender/ enemy from the array whhen it dies

if (defenders[i].health <= 0) {
    defenders.splice(i, 1)
    }


9. Global Variables needed

cellGap = 3
frames = 0
enemy spawn interval = 500
cells = []
defenders = []
projectiles = []
enemies = []

10. how to add defenders to the game and array.

canvas.addEventListener('click', function(event) {
    let positionOfX = mouseX - (mouseX % cellSize) + cellGap // calculates x coordinate of the clicked cell, subtracts the remainder, and get the most left coordinate and offset it with the cellGap, which is 3

    let positionOfY = mouseY - (mouseY % cellSize) + cellGap // same with Y

    defenders.push(new Defender(positionOfX, positionOfY))
})
