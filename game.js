let canvas = document.querySelector('#canvas1')
let ctx = canvas.getContext('2d')

canvas.width = 900
canvas.height = 400

// GLOBAL VARIABLES

let roundWon = false
let gameOver = false

let cellSize = 100
let cellGap = 3
let frames = 0
let enemySpawnTime = 270

let currentScore = 0
let resources = 300
let defenderCost = 100
let winningScore = 40

let cells = []
let defenders = []
let projectiles = []
let enemies = []

let mouseX = 10
let mouseY = 0

// collision function
const collision = (first, second) => { // the parameters are rectangles, i.e enemy, projectile, defenders

    //checks if they DON'T overlap
    if (!
        (first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y < second.y)
    ) {
        return true
    }
    return false

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
        this.shootTime = 0
        this.damage = 20
    }
    placeDefender() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'gold'
        ctx.font = '20px Arial'
        ctx.fillText(Math.floor(this.health), this.x + 10, this.y + 20)
    }
    shoot() {
        this.shootTime++
        if (this.shootTime % 100 === 0) {
            projectiles.push(new Projectile(this.x + 30, this.y + 30))
        }
    }
}

class Enemy {
    constructor(y) { // vertical position is where i want the enemy to randomly spawn
        this.x = canvas.width;
        this.y = y
        this.width = cellSize
        this.height = cellSize
        this.speed = Math.random() * 0.2 + 0.4
        this.health = 100
        this.gainedResources = this.health / 2
        this.movement = this.speed
    }
    placeEnemy() {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'black'
        ctx.font = '20px Arial'
        ctx.fillText(Math.floor(this.health), this.x, this.y + 30)
    }
    move() {
        this.x -= this.movement
    }
}

class Projectile {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 6
        this.speed = 3.5
    }
    placeProjectile() {
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2)
        ctx.fill()
    }
    move() {
        this.x += this.speed
    }
}

// function to make all the cells in the canvas
const createGameBoard = () => {
    for (let y = cellSize; y < canvas.height; y += cellSize) { // gets all the y valuse as multiples of 100
        for (let x = 0; x < canvas.width; x += cellSize) { // gets all x values as multiples of 100
            cells.push(new Cell(x, y))
        }
    }
}

createGameBoard()

// place a defender on the canvas depending on the mouse position

canvas.addEventListener('click', function (event) {
    let positionOfX = mouseX - (mouseX % cellSize) // calculates x coordinate of the clicked cell, subtracts the remainder, and get the most left coordinate and offset it with the cellGap, which is 3
    let positionOfY = mouseY - (mouseY % cellSize) // same with Y


    if (resources >= defenderCost) {
        defenders.push(new Defender(positionOfX, positionOfY))
        resources -= defenderCost
        // for(let i = 0; i < defenders.length; i++) {
        //     defenders[i].placeDefender()
        //     console.log(defenders[i])
        // }

    }



    console.log(positionOfX, positionOfY)
})

console.log(defenders)
// FUNCTION TO SPAWN ENEMIES

const makeEnemies = () => {
    let enemyY = Math.floor(Math.random() * 4) * cellSize + 100 // a random number between 0 and 400 so the enemies can spawn at a random position on the grid

    if (frames % enemySpawnTime === 0) {
        enemies.push(new Enemy(enemyY))

    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].move()
        enemies[i].placeEnemy()
        if (enemies[i].x <= 0) {
            gameOver = true
        }
    }


}

// FUNCTION TO DETECT COLLISION BETWEEN ENEMY AND DEFENDER

const enemyColision = () => {
    for (let i = 0; i < defenders.length; i++) {
        for (let j = 0; j < enemies.length; j++) {

            if (defenders[i] && collision(defenders[i], enemies[j])) {
                enemies[j].movement = 0
                defenders[i].health -= 0.2
            }

            if (defenders[i] && defenders[i].health <= 0) {
                defenders.splice(i, 1)
                i--
                enemies[j].movement = enemies[j].speed
            }

        }
    }
}

// FUNCTION TO MAKE PROJECTILES

const makeProjectiles = () => {
    for (let i = 0; i < defenders.length; i++) {

        defenders[i].shoot()

        for (let j = 0; j < projectiles.length; j++) {

            projectiles[j].placeProjectile()
            projectiles[j].move()
            // console.log(projectiles[j])
            // console.log(defenders)

        }
    }
}

// COLLISION BETWEEN PROJECTILES AND ENEMIES

const projectileCollision = () => {
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (projectiles[i] && enemies[j] && collision(projectiles[i], enemies[j])) {

                projectiles.splice(i, 1)
                i--
                enemies[j].health -= 20
            }
            if (enemies[j].health <= 0) {
                resources += enemies[j].gainedResources
                currentScore += 10
                enemies.splice(j, 1)
                i--
            }
            if (projectiles[i] && projectiles[i].x >= canvas.width) {
                projectiles.splice(i, 1)
            }
        }


    }
}

const gameStatus = () => {
    ctx.fillStyle = 'black'
    ctx.fillText(`Resources: ${resources}`, 20, 40)
    ctx.fillText(`Score: ${currentScore}`, 20, 60)

    if(currentScore >= winningScore) {
        ctx.fillStyle = 'gold'
        ctx.font = '60px Arial'
        ctx.fillText('Level Complete', 300, 200)
        ctx.font = '30px Arial'
        ctx.fillText('Score: ' + currentScore, 330, 230)
        roundWon = true
        console.log(enemies)
    }
    if (gameOver === true) {
        ctx.fillStyle = 'gold'
        ctx.font = '60px Arial'
        ctx.fillText('GAME OVER', 135, 330)
    }



}








const printCells = () => {
    for (let i = 0; i < cells.length; i++) {
        cells[i].makeCell()
    }
}

const animate = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height) // every frame clears the canvas
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, canvas.width, cellSize)
    printCells()
    gameStatus()
    for (let i = 0; i < defenders.length; i++) { // place every defender that is in the array and update it every frame
        defenders[i].placeDefender()
    }
    makeEnemies()
    enemyColision()
    makeProjectiles()
    projectileCollision()
    frames++
    if (!gameOver && !roundWon) { // if the game is not over
        requestAnimationFrame(animate) // recursive function to continue drawing the cells on the canvas
    }
}
animate()

