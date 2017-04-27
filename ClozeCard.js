'use strict';

function ClozeCard(text, cloze) {
    if (this instanceof ClozeCard) {
        this.cloze = cloze.trim();
        this.fullText = text.trim();
        this.checkCloze();
    } else return new ClozeCard(text, cloze);
}

ClozeCard.prototype.checkCloze = function() {
    let clozeIndex = this.fullText.toLowerCase().indexOf(this.cloze.toLowerCase());
    if (clozeIndex != -1) {
        let textToReplace = this.fullText.slice(clozeIndex, clozeIndex + this.cloze.length);
        this.partial = this.fullText.replace(textToReplace, '...');
    } else {
        console.log('Error: cloze not found in text');
        this.cloze = undefined;
        this.fullText = undefined;
    }
};

module.exports = ClozeCard;
