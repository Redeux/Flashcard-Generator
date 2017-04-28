'use strict';

let BasicCard = require('./BasicCard.js');
let ClozeCard = require('./ClozeCard.js');
let fs = require('fs');
let inquirer = require('inquirer');

function initialPrompt() {
    inquirer.prompt([{
        name: 'type',
        type: 'list',
        message: 'Select the type of card(s) you want to create:',
        choices: ['Basic', 'Cloze', 'Both - You will be prompted for each new card']
    }, {
        name: 'catagory',
        message: 'Define a catagory for your new flash cards:',
        validate: function(input) {
            if (input) {
                return true;
            } else return false;
        }
    }]).then(function(response) {
    	if (response.type != 'Basic' && response.type != 'Cloze') response.type = 'Both';
    	switchBoard(response.type);
    })
}

function promptCloze(type) {

}

function promptBasic(type) {
    inquirer.prompt([{
        name: 'front',
        message: 'Enter card front text:',
        validate: function(input) {
            if (input) {
                return true;
            } else return false;
        }
    }, {
        name: 'back',
        message: 'Enter card back text:',
        validate: function(input) {
            if (input) {
                return true;
            } else return false;
        }
    }]).then(function(response) {
        let front = response.front;
        let back = response.back;
        console.log('Front: ' + front);
        console.log('Back: ' + back);
        inquirer.prompt([{
            name: 'save',
            message: 'Would you like to save this card?',
            type: 'confirm'
        }]).then(function(response) {
            if (response.save === true) {
                let newCard = new BasicCard(front, back);
                saveCard(newCard);
            } else {
                inquirer.prompt([{
                    name: 'again',
                    message: 'Would you like to create another card?',
                    type: 'confirm'
                }]).then(function(response) {
                    if (response.again === true) {
                        switchBoard(type);
                    }
                })
            }
        })
    })
}

initialPrompt();

function saveCard(card) {

}

function switchBoard(type) {
    if (type === 'Basic') {
        promptBasic(type);
    } else if (type === 'Cloze') {
        promptCloze(type);
    } else {
        inquirer.prompt([{
            name: 'thisType',
            type: 'list',
            message: 'Select the type of card you want to create:',
            choice: ['Basic', 'Cloze']
        }]).then(function(response) {
            if (response.thisType === 'Basic') {
                promptBasic(type);
            } else promptCloze(type);
        })
    }
}
