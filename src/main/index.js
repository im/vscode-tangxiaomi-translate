const humanizeString = require('humanize-string');
const { youdao, baidu, google } = require('translation.js');

function Translate (documents, connection) {
    this._connection = connection
    this._documents = documents
}

Translate.prototype.getText = async function (textDocumentPosition) {
    let block = await this.getSelectionContainPosition(textDocumentPosition);
    if (block) {
        const humanize = humanizeString(block.comment);
        let targetLanguageComment = null
        let contents = []
        try {
            targetLanguageComment = await google.translate(humanize)
        } catch(e) {
            console.log(e)
        }
        if (targetLanguageComment) {
            contents.push(`[Tangxiaomi Translate]    [Google](${targetLanguageComment.link})`)
            contents.push(`${block.comment} =>`)
            contents.push(targetLanguageComment.result)
            contents.push(' ')
        } else {
            contents.push(`[Tangxiaomi Translate]`)
            contents.push('翻译出错啦！~~~')
        }
        return {
            contents: contents,
            range: block.range
        }
    }

    return null
}


Translate.prototype.getSelectionContainPosition = async function (textDocumentPosition) {
    let block = await this._connection.sendRequest('selectionContains', textDocumentPosition);
    return block;
}



module.exports = Translate