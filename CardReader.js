const fs = require('fs'),
    inquirer = require('inquirer');
let catagories = [];
let cardArray;

fs.readdir('./', 'UTF8', (err, files) => {
    if (err) throw err;
    files.map(file => {
        if (file.includes('.cards')) {
            catagories.push(file.split('.')[0]);
        }
    })
    if (catagories.length > 0) {
        inquirer.prompt([{
            name: 'catagory',
            type: 'list',
            message: 'Select a catagory',
            choices: catagories
        }]).then(response => {
            fs.readFile(response.catagory + '.cards', 'UTF8', (err, data) => {
                if (err) throw err;
                else {
                    cardArray = JSON.parse(data);
                    askCard(cardArray);
                }
            })
        })
    } else {
        console.log('No catagories found.  Try creating some cards first!');
    }
})



function askCard(arr) {
    const cardIndex = Math.round(Math.random() * (arr.length -1));
    const currentCard = arr[cardIndex];
    if (currentCard.hasOwnProperty('front')) {
        inquirer.prompt([{
            name: 'card',
            message: currentCard.front,
            validate: input => {
                if (input) {
                    return true;
                } else return false;
            }
        }]).then(response => {
            if (response.card.toLowerCase() === currentCard.back.toLowerCase()) {
                console.log('Correct! -- ' + currentCard.front + ' - ' + currentCard.back);
                askAgain();
            } else {
                console.log('Sorry the correct answer was ' + currentCard.back);
                askAgain();
            }
        })
    } else if (currentCard.hasOwnProperty('cloze')) {
        inquirer.prompt([{
            name: 'card',
            message: currentCard.partial,
            validate: input => {
                if (input) {
                    return true;
                } else return false;
            }
        }]).then(response => {
            if (response.card.toLowerCase() === currentCard.cloze.toLowerCase()) {
                console.log('Correct! -- ' + currentCard.fullText);
                askAgain();
            } else {
                console.log('Sorry the correct answer was ' + currentCard.cloze);
                askAgain();
            }
        })
    } else {
        console.log('Error: Invalid card type');
    }
}

function askAgain() {
    inquirer.prompt([{
        name: 'again',
        message: 'Would you like to try another card?',
        type: 'confirm'
    }]).then(response => {
        if (response.again) {
            askCard(cardArray);
        }
    })
}
