let canvas = document.querySelector('#canvas1')
let ctx = canvas.getContext('2d')
let startButton = document.querySelector('#start-game')

window.alert('Mr.President! There has been a zombie outbreak and this is the last safe space in the US. We are here to keep you safe and keep the zombies away. But these Zombies are different from the ones in the movies, they know when to retreat! Its your job to direct us on where to go to keep us safe! (click ok to continue)')

canvas.width = 900
canvas.height = 400

// GLOBAL VARIABLES

// BOOLEAN VARIABLES
// let roundWon = false
let gameOver = false
// let gameStarted = false
let bigBossIsAlive = true

// GRID VARIABLES AND TIMING LOGIC VARIABLES
let cellSize = 100
let cellGap = 3
let frames = 0
let enemySpawnTime = 180

// PLAYER STATUS VARIABLES
let currentScore = 0
let money = 400
let defenderCost = 100
let winningScore = 200

// EMPTY ARRAYS FOR STORING DATA
let cells = []
let defenders = []
let projectiles = []
let enemies = []



// TO STORE MOUS DATA
let mouseX = 10
let mouseY = 0


// COLLISION FUNCTION
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
        ctx.font = '20px Tillana'
        ctx.fillText(Math.floor(this.health), this.x + 10, this.y + 20)
    }
    shoot() {
        this.shootTime++
        if (this.shootTime % 60 === 0) {
            projectiles.push(new Projectile(this.x + 30, this.y + 30))
        }
    }
}

class Enemy {
    constructor(y) { // the y parameter is where i want the enemy to randomly spawn
        this.x = canvas.width;
        this.y = y
        this.width = cellSize
        this.height = cellSize
        this.speed = Math.random() * 0.3 + 0.6
        this.health = 180
        this.gainedMoney = 50
    }
    placeEnemy() {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'black'
        ctx.font = '20px Tillana'
        ctx.fillText(Math.floor(this.health), this.x, this.y + 30)
    }
    move() {
        this.x -= this.speed
    }
}

class BigBoss {
    constructor() {
        this.x = canvas.width;
        this.y = 100
        this.width = cellSize * 3
        this.height = canvas.height
        this.speed = Math.random() * 0.3 + 0.3
        this.health = 5000
    }
    placeBoss() {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'black'
        ctx.font = '20px Tillana'
        ctx.fillText(Math.floor(this.health), this.x, this.y + 30)
    }
    move() {
        this.x -= this.speed
    }
}

// 1st Big Boss
let bigBoss = new BigBoss()

class Projectile {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 8
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
    let positionOfX = mouseX - (mouseX % cellSize) // calculates x coordinate of the clicked cell, subtracts the remainder, and get the most left coordinate
    let positionOfY = mouseY - (mouseY % cellSize) // same with Y


    if (money >= defenderCost) {
        defenders.push(new Defender(positionOfX, positionOfY)) // placed a new defender where the mouse is clicked on the canvas
        money -= defenderCost

    } else {
        window.alert('Theres not enough money to add a defender!!')
    }
})

console.log(defenders)
// FUNCTION TO SPAWN ENEMIES

const makeEnemies = () => {
    let enemyY = Math.floor(Math.random() * 3) * cellSize + 100// a random number between 0 and 300 so the enemies can spawn at a random position on the grid

    if (frames % enemySpawnTime === 0 && currentScore <= winningScore) {
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

// FUNCTION TO MAKE THE BIG BOSS



// FUNCTION TO DETECT COLLISION BETWEEN ENEMY AND DEFENDER

const enemyColision = () => {
    for (let i = 0; i < defenders.length; i++) {
        for (let j = 0; j < enemies.length; j++) {

            if (defenders[i] && enemies[j] && collision(defenders[i], enemies[j])) {
                enemies[j].speed = 0
                defenders[i].health -= 0.2
            }

            if (defenders[i] && defenders[i].health <= 0) {
                defenders.splice(i, 1)
                i--
                enemies[j].speed = Math.random() * 0.3 + 0.6
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
                money += enemies[j].gainedMoney
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

// FUNCTION TO MAKE THE BIG BOSS

const makeBigBoss = () => { // contains all the logic related to the Big Boss
    if (currentScore >= winningScore && enemies.length == 0) {
        bigBoss.placeBoss()
        bigBoss.move()
    }
    if (bigBoss.x <= 0) {
        gameOver = true
    }
}

const bigBossCollision = () => {
    for (let i = 0; i < projectiles.length; i++) {
        if (projectiles[i] && bigBoss && collision(projectiles[i], bigBoss)) {

            projectiles.splice(i, 1)
            i--
            bigBoss.health -= 20
        }
        if (bigBoss.health <= 0) {
            bigBossIsAlive = false
        }
    }
    for (let i = 0; i < defenders.length; i++) {
        if (bigBoss && defenders[i] && collision(defenders[i], bigBoss)) {
            defenders[i].health -= 0.5
        }
        if (defenders[i].health <= 0) {
            defenders.splice(i, 1)
            i--
        }
    }

}



// FUNCTION TO MAKE THE TOP GAME BAR
const gameBar = () => {
    ctx.fillStyle = 'black'
    ctx.font = '20px Tillana'
    ctx.fillText(`Money: ${money}`, 20, 40)
    ctx.fillText(`Score: ${currentScore}`, 20, 60)

    if (!bigBossIsAlive) {
        roundWon = true
        ctx.fillStyle = 'gold'
        ctx.font = '35px Tillana'
        ctx.fillText("You killed all the zombies!!! You're safe, For now", 0, 200)
        ctx.font = '30px Tillana'
        ctx.fillText('Score: ' + currentScore, 330, 230)
    }
    if (gameOver) {
        ctx.fillStyle = 'red'
        ctx.font = '50px Tillana'
        ctx.fillText('The Zombies Ate your brains, Game over', 0, 230)
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
    for (let i = 0; i < defenders.length; i++) { // place every defender that is in the array and update it every frame
        defenders[i].placeDefender()
    }
    makeEnemies()
    enemyColision()
    makeProjectiles()
    projectileCollision()
    makeBigBoss()
    bigBossCollision()
    frames++
    if (!gameOver && bigBossIsAlive) { // if the game is not over and the round is not won and the game was started
        requestAnimationFrame(animate) // recursive function to continue drawing the cells on the canvas
    }
    gameBar()
}
animate()

