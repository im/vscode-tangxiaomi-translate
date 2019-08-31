const humanizeString = require('humanize-string');
const { youdao, baidu, google } = require('translation-api');
const getLink = require('../utils/link');
const { translateLink } = require('../utils/github');

function Translate (documents, connection, params) {
    this._connection = connection
    this._documents = documents
    global.translateProxyUrl = params.initializationOptions.proxyUrl || ''
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
            contents.push(`${translateLink('google', targetLanguageComment.link)}`)
            contents.push(`${block.comment} => ${targetLanguageComment.result}`)
            contents.push(' ')
        } else {
            contents.push(`${translateLink('google', getLink('baidu', humanize))}`)
            contents.push('翻译失败啦！~~~')
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