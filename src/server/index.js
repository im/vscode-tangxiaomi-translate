


const { TextDocuments, createConnection, ProposedFeatures } = require('vscode-languageserver')

const Translate = require('../main')

let connection = createConnection(ProposedFeatures.all)

let documents = new TextDocuments()


let translate = null 


connection.onInitialize((params) => {
    let capabilities = params.capabilities;
    translate = new Translate(documents, connection, params)
    return {
		capabilities: {
			hoverProvider: true,
			textDocumentSync: documents.syncKind
		} 
	};
});


connection.onHover(async (textDocumentPosition) => {
    let hover = await translate.getText(textDocumentPosition)
	return hover;
});


documents.listen(connection);

connection.listen();