'use strict';

const BasicCard = require('./BasicCard.js'),
    ClozeCard = require('./ClozeCard.js'),
    fs = require('fs'),
    inquirer = require('inquirer');
let catagory;

promptCatagory();

function promptCatagory() {
    //Looks for existing .cards files and presents them to the user as options or lets them define a new catagory
    //If no .cards files are found it prompts the user to define a new catagory
    let existingCatagories = [];

    fs.readdir('./', 'UTF8', (err, files) => {
        files.map(file => {
            if (file.includes('.cards')) {
                existingCatagories.push(file.split('.')[0]);
            }
        })
        if (existingCatagories.length > 0) {
            existingCatagories.push('New Catagory');
            inquirer.prompt([{
                name: 'catagory',
                type: 'list',
                message: 'Select a catagory',
                choices: existingCatagories
            }]).then(response => {
                if (response.catagory === 'New Catagory') {
                    inquirer.prompt([{
                        name: 'catagory',
                        message: 'Enter a catagory for your new flash cards:',
                        validate: input => {
                            if (input) {
                                return true;
                            } else return false;
                        }
                    }]).then(response => {
                        catagory = response.catagory.toLowerCase();
                        promptType();
                    })
                } else {
                    catagory = response.catagory.toLowerCase();
                    promptType();
                }
            })
        } else {
            inquirer.prompt([{
                name: 'catagory',
                message: 'Enter a catagory for your new flash cards:',
                validate: input => {
                    if (input) {
                        return true;
                    } else return false;
                }
            }]).then(response => {
                catagory = response.catagory.toLowerCase();
                promptType();
            })
        }
    })
}

function promptType() {
    //Allows the user to specify if they want to create a Basic or Cloze type card
    //User can specify both and will be asked for a type on each new card
    inquirer.prompt([{
        name: 'type',
        type: 'list',
        message: 'Select the type of card(s) you want to create:',
        choices: ['Basic', 'Cloze', 'Both - You will be prompted for each new card']
    }]).then(response => {
        if (response.type === 'Both - You will be prompted for each new card') response.type = 'Both';
        switchBoard(response.type);
    })
}

function promptCloze(type) {
    //Prompt the user to create a cloze card
    //Shows them their input and asks if they want to save it
    //Then asks if they want to create a new card
    inquirer.prompt([{
        name: 'full',
        message: 'Enter the full card text:',
        validate: input => {
            if (input) {
                return true;
            } else return false;
        }
    }, {
        name: 'cloze',
        message: 'Enter the card cloze text:',
        validate: input => {
            if (input) {
                return true;
            } else return false;
        }
    }]).then(response => {
        const full = response.full;
        const cloze = response.cloze;
        console.log('-'.repeat(10) + 'Card' + '-'.repeat(10));
        console.log('Full Text: ' + full);
        console.log('Cloze: ' + cloze);
        console.log('-'.repeat(24));
        inquirer.prompt([{
            name: 'save',
            message: 'Would you like to save this card?',
            type: 'confirm'
        }]).then(response => {
            if (response.save) {
                const newCard = new ClozeCard(full, cloze);
                saveCard(newCard);
            }
            inquirer.prompt([{
                name: 'again',
                message: 'Would you like to create another card?',
                type: 'confirm'
            }]).then(response => {
                if (response.again) {
                    switchBoard(type);
                }
            })
        })
    })
}

function promptBasic(type) {
    //Prompt the user to create a basic card
    //Shows them their input and asks if they want to save it
    //Then asks if they want to create a new card
    inquirer.prompt([{
        name: 'front',
        message: 'Enter card front text:',
        validate: input => {
            if (input) {
                return true;
            } else return false;
        }
    }, {
        name: 'back',
        message: 'Enter card back text:',
        validate: input => {
            if (input) {
                return true;
            } else return false;
        }
    }]).then(response => {
        let front = response.front;
        let back = response.back;
        console.log('-'.repeat(10) + 'Card' + '-'.repeat(10));
        console.log('Front: ' + front);
        console.log('Back: ' + back);
        console.log('-'.repeat(24));
        inquirer.prompt([{
            name: 'save',
            message: 'Would you like to save this card?',
            type: 'confirm'
        }]).then(response => {
            if (response.save) {
                let newCard = new BasicCard(front, back);
                saveCard(newCard);
            }
            inquirer.prompt([{
                name: 'again',
                message: 'Would you like to create another card?',
                type: 'confirm'
            }]).then(response => {
                if (response.again) {
                    switchBoard(type);
                }
            })
        })
    })
}

function saveCard(card) {
    //Saves a card to the <catagory>.cards file specified previously
    //If the catagory file exists it imports the array and pushes the new object into it before saving the array back to the files
    //If the catagory file doesn't it exist it creates one with a new array
    //This method probably isn't great for large files
    let cardArray;
    if (card instanceof BasicCard || card instanceof ClozeCard) {
        if (!card.bad) {
            fs.readFile(catagory + '.cards', 'UTF8', (err, data) => {
                if (err) cardArray = [];
                else cardArray = JSON.parse(data);
                cardArray.push(card);
                fs.writeFile(catagory.replace(' ', '_') + '.cards', JSON.stringify(cardArray), 'UTF8', (err) => {
                    if (err) throw err;
                });
            })
        } else console.log('Error: Improper card - cannot save');
    }
}

function switchBoard(type) {
    //Decision tree for the type of card to create based on the user's input
    if (type === 'Basic') {
        promptBasic(type);
    } else if (type === 'Cloze') {
        promptCloze(type);
    } else {
        inquirer.prompt([{
            name: 'thisType',
            type: 'list',
            message: 'Select the type of card you want to create:',
            choices: ['Basic', 'Cloze']
        }]).then(response => {
            if (response.thisType === 'Basic') {
                promptBasic(type);
            } else promptCloze(type);
        })
    }
}
