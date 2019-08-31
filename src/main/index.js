const humanizeString = require('humanize-string');
const { youdao, baidu, google } = require('translation-api');
// const { env, Position, window } = require('vscode');

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
        // global.translateProxyUrl = 'http://www.baidu.com'
        // console.log(env)
        if (targetLanguageComment) {
            contents.push(`![](https://avatars3.githubusercontent.com/u/12029165?s=460&v=4)[Tangxiaomi Translate]    [Google](${targetLanguageComment.link})`)
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