# これは？

Markdown から<s>日本企業っぽいメール</s>プレーンテキストで読みやすいテキストに変換します。

[![dependencies Status](https://david-dm.org/anydown/maildown/status.svg)](https://david-dm.org/anydown/maildown)

[![npm version](https://badge.fury.io/js/%40anydown%2Fmaildown.svg)](https://badge.fury.io/js/%40anydown%2Fmaildown)

# Demo

https://maildown-example.netlify.com/

![image](https://user-images.githubusercontent.com/3132889/43113200-59139640-8f34-11e8-8c5e-e3aa5326a572.png)

🤔


# NPM から利用する

`npm install @anydown/maildown`

```js
const maildown = require("@anydown/maildown");

const converted = maildown(`## test

# test

- this
- is
- test
`, {lineLength: 70});

console.log(converted);
//>  ■test
//>  【test】
//>  　・this
//>  　・is
//>  　・test
```

# Options

| オプション名 | 説明             | デフォルト |
| ------------ | ---------------- | ---------- |
| lineLength   | １行の最大文字長 | `70` |
| h1PrefixText   | h1 の接頭辞テキスト | `【` |
| h1SuffixText   | h1 の接尾辞テキスト | `】` |
| h2PrefixText   | h2 の接頭辞テキスト | `❐ ` |
| h2SuffixText   | h2 の接尾辞テキスト | `` |
| h3PrefixText   | h3 の接頭辞テキスト | `◆ ` |
| h3SuffixText   | h3 の接尾辞テキスト | `` |
| h4PrefixText   | h4 以降の接頭辞テキスト | `■ ` |
| h4SuffixText   | h4 以降の接尾辞テキスト | `` |
| listDefaultSpacer   | リストの左端に挿入するスペーサー | `` |
| listAdditionalSpacer   | リストに追加するスペーサー | `　` |
| listPrefixText   | リストの接頭辞テキスト | `・` |
| listPrefixNumbering   | リスト接頭辞テキスト（ナンバリング） | `（%d）` |

# Who uses maildown

 - [Markdown to Plain](https://chrome.google.com/webstore/detail/markdown-to-plain/kcfemfieficedfhplhkmlpeddpkgiaok) : Chrome拡張 by [@mtgto](https://github.com/mtgto)
 - [md2mail](https://marketplace.visualstudio.com/items?itemName=satopirka.md2mail) : VSCode拡張 by [@satopirka](https://github.com/satopirka)
