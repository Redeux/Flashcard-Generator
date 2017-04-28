'use strict';

function BasicCard(front, back) {
    if (this instanceof BasicCard) {
        if (front && back) {
            this.front = front;
            this.back = back;
        } else {
            console.log('Error: missing component')
        }

    } else return new BasicCard(front, back);
}

module.exports = BasicCard;
