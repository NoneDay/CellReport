import {test_expr} from "../api/report_api"
export const register_crjs=function(){
    monaco.languages.register({ id: 'crjs' });
    let keywords = [
    'break', 'case',  'continue', 'do', 'else',
    'export', 'extends', 'false', 'for', 'function',
    'get', 'if', 'import', 'in', 'not', 'new', 'null',
    'return',  'switch',  'true', 'var', 'void', 'while', 
    ];
//quickSuggestions: false, // 默认的提示关掉
    monaco.languages.setLanguageConfiguration("crjs", 
    {
    "surroundingPairs":[{"open":"{","close":"}"}],
    "autoClosingPairs":[{"open":"{","close":"}"}],
    "brackets":[["{","}"]]
    }
    )
    monaco.languages.setMonarchTokensProvider('crjs', {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    tokenPostfix: '.crjs',
    keywords ,
    typeKeywords: [
        'any', 'boolean', 'number', 'object', 'string', 'undefined'
    ],
    
    operators: [
        '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**',
        '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
        '|', '^', '!', '~', '&&', '||', '?', ':', '=', '+=', '-=',
        '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=',
        '^=', '@',
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [
        [/[{}]/, 'delimiter.bracket'],
        { include: 'common' }
        ],

        common: [
        // identifiers and keywords
        [/[a-z_$][\w$]*/, {
            cases: {
            '@typeKeywords': 'keyword',
            '@keywords': 'keyword',
            '@default': 'identifier'
            }
        }],
        [/[A-Z][\w\$]*/, 'type.identifier'],  // to show class names nicely
        // [/[A-Z][\w\$]*/, 'identifier'],

        // whitespace
        { include: '@whitespace' },

        // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
        [/\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],

        // delimiters and operators
        [/[()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
            cases: {
            '@operators': 'delimiter',
            '@default': ''
            }
        }],

        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
        [/0[xX](@hexdigits)/, 'number.hex'],
        [/0[oO]?(@octaldigits)/, 'number.octal'],
        [/0[bB](@binarydigits)/, 'number.binary'],
        [/(@digits)/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
        ],

        whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
        ],

        comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment']
        ],

        jsdoc: [
        [/[^\/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc']
        ],

        // We match regular expression quite precisely
        regexp: [
        [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
        [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
        [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'],
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [/(\/)([gimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']],
        ],

        regexrange: [
        [/-/, 'regexp.escape.control'],
        [/\^/, 'regexp.invalid'],
        [/@regexpesc/, 'regexp.escape'],
        [/[^\]]/, 'regexp'],
        [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
        ],

        string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
        ],

        string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
        ],

        string_backtick: [
        [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
        [/[^\\`$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop']
        ],

        bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'common' }
        ],
    },
    });
    const identifierPattern = "([a-zA-Z_]\\w*)";	// 正则表达式定义 注意转义\\w

    function getTokens(code) {
        let identifier = new RegExp(identifierPattern, "g");	// 注意加入参数"g"表示多次查找
        let tokens = [];
        let array1;
        while ((array1 = identifier.exec(code)) !== null) {
            tokens.push(array1[0]);
        }
        return Array.from(new Set(tokens));			// 去重
    }
    monaco.languages.registerCompletionItemProvider('crjs', {
    triggerCharacters: ['.'], // 触发提示的字符，可以写多个
    provideCompletionItems: async (model, position, context, token) => {
        let curWord=model.getWordUntilPosition(position);//当前输入的单词。{word: 'd', startColumn: 1, endColumn: 2}
        let words = [];
        let tokens = getTokens(model.getValue());
        for (const item of tokens) {
            if (item != curWord.word) {
                words.push({
                    label: item,
                    kind: monaco.languages.CompletionItemKind.Text,	// Text 没有特殊意义 这里表示基于文本&单词的补全
                    documentation: "",
                    insertText: item,
                    //range: range
                });
            }
        }
        // 获取当前行数
        const line = position.lineNumber
        // 获取当前列数
        const column = position.column
        // 获取当前输入行的所有内容
        const content = model.getLineContent(line)
        // 通过下标来获取当前光标后一个内容，即为刚输入的内容
        const sym = content[column - 2]
        if(sym=="."){
            let retList=await test_expr(model.getValue(),line,column-2)
            console.info(Enumerable.from(retList.hint).select(x=>`/** */\n${x.documentation}:${x.detail}\n`).toArray().join(""))
            let ret=Enumerable.from(retList.hint).select(x=>{return {
                label: x.name,
                kind: monaco.languages.CompletionItemKind[x.kind],	// Text 没有特殊意义 这里表示基于文本&单词的补全
                documentation: x.documentation,
                detail: x.detail,
                insertText: x.insertText,
            }}).toArray();
            return { suggestions:  ret};
        }
        const suggestions = [
            ...keywords.map(k => {
                return {
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: k,
                };
            })
        ].concat(words);
        return { suggestions: suggestions };
    }
    });
    monaco.languages.registerHoverProvider('crjs', {
        provideHover: function(model, position) { 
            // Log the current word in the console, you probably want to do something else here.
            let word=model.getWordAtPosition(position)
            return {
                contents: [
                    { value: "word" },
                    { value: word },
                ],
            };
        }
    });
}