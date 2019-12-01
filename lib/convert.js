var kaigyo = require("./kaigyo");
var parse = require("@textlint/markdown-to-ast").parse;
var Syntax = require("@textlint/markdown-to-ast").Syntax;
var traverse = require("@textlint/ast-traverse").traverse;
var VisitorOption = require("@textlint/ast-traverse").VisitorOption;
var WordTable = require("word-table");

function nodeToString(node) {
  var output = "";
  if (node.value) {
    output += node.value;
  }
  if (node.children) {
    node.children.forEach(leaf => {
      output += nodeToString(leaf);
    });
  }
  return output;
}

function nodeToStringOrderedList(node, i, spacer, opts, counter) {
  var output = "";
  if (node.value) {
    output += spacer;
    output += opts.listPrefixNumbering.replace("%d", i + 1)
    output += opts.lineLength < 1 ? node.value : kaigyo(node.value, opts.lineLength - 4, spacer + opts.listAdditionalSpacer + opts.listAdditionalSpacer + opts.listAdditionalSpacer);
    output += "\n";
  }
  if (node.children) {
    node.children.forEach(leaf => {
      output += nodeToStringOrderedList(
        leaf,
        i,
        counter > 1 ? opts.listAdditionalSpacer + spacer : opts.listDefaultSpacer,
        opts,
        counter ? counter + 1 : 1
      );
    });
  }
  return output;
}

function nodeToStringList(node, spacer, opts, counter) {
  var output = "";
  if (node.value) {
    output += spacer;
    output += opts.listPrefixText;
    output += opts.lineLength < 1 ? node.value : kaigyo(node.value, opts.lineLength - 4, spacer + opts.listAdditionalSpacer);
    output += "\n";
  }
  if (node.children) {
    node.children.forEach(leaf => {
      output += nodeToStringList(
        leaf,
        counter > 1 ? opts.listAdditionalSpacer + spacer : opts.listDefaultSpacer,
        opts,
        counter ? counter + 1 : 1
      );
    });
  }
  return output;
}

/**
 * convert AST to plaintext
 * @param {*} AST
 */
function convert(input, opts) {
  var output = [];
  opts = opts || {};

  //Default options
  var lineLength = opts.lineLength;
  var isUnlimitedLineLength = lineLength < 1;
  opts.h1PrefixText = opts.h1PrefixText ? opts.h1PrefixText : "【";
  opts.h1SuffixText = opts.h1SuffixText ? opts.h1SuffixText : "】";
  opts.h2PrefixText = opts.h2PrefixText ? opts.h2PrefixText : "❐ ";
  opts.h2SuffixText = opts.h2SuffixText ? opts.h2SuffixText : "";
  opts.h3PrefixText = opts.h3PrefixText ? opts.h3PrefixText : "◆ ";
  opts.h3SuffixText = opts.h3SuffixText ? opts.h3SuffixText : "";
  opts.h4PrefixText = opts.h4PrefixText ? opts.h4PrefixText : "■ ";
  opts.h4SuffixText = opts.h4SuffixText ? opts.h4SuffixText : "";
  opts.listDefaultSpacer = opts.listDefaultSpacer ? opts.listDefaultSpacer : "";
  opts.listAdditionalSpacer = opts.listAdditionalSpacer ? opts.listAdditionalSpacer : "　";
  opts.listPrefixText = opts.listPrefixText ? opts.listPrefixText : "・";
  opts.listPrefixNumbering = opts.listSpace ? opts.listSpace : "（%d）";

  var AST = parse(input);
  var tempTable = [];
  var tempTableRow = [];

  traverse(AST, {
    enter(node) {
      switch (node.type) {
        case Syntax.Document:
          //console.log("Syntax.Document", nodeToString(node));
          break;
        case Syntax.Paragraph:
          //console.log("Syntax.Paragraph", nodeToString(node));
          output.push(isUnlimitedLineLength ? nodeToString(node) : kaigyo(nodeToString(node), lineLength));
          output.push("");
          return VisitorOption.Skip;

        case Syntax.BlockQuote:
          output.push(node.raw);
          return VisitorOption.Skip;

        case Syntax.ListItem:
          //ListItem要素ではolかulか判断出来ないので、上位のListで処理を行っている
          //でも、これだと入れ子要素はレンダリングできなそう（いま出来てない）
          break;

        case Syntax.List:
          var toText = item => item.value;
          if (node.ordered) {
            var toItem = (listItem, i) =>
              nodeToStringOrderedList(listItem, i, "", opts);
            var listText = node.children.map(toItem).join("");
            output.push(listText);
          } else {
            var toItem = listItem =>
              nodeToStringList(listItem, "", opts);
            var listText = node.children.map(toItem).join("");
            output.push(listText);
          }
          return VisitorOption.Skip;

        case Syntax.Header:
          output.push("");
          if (node.depth === 1) {
            output.push(
              opts.h1PrefixText + node.children.map(item => item.value).join("") + opts.h1SuffixText
            );
          }
          if (node.depth === 2) {
            output.push(
              opts.h2PrefixText + node.children.map(item => item.value).join("") + opts.h2SuffixText
            );
          }
          if (node.depth === 3) {
            output.push(
              opts.h3PrefixText + node.children.map(item => item.value).join("") + opts.h3SuffixText
            );
          }
          if (node.depth >= 4) {
            output.push(
              opts.h4PrefixText + node.children.map(item => item.value).join("") + opts.h4SuffixText
            );
          }
          output.push("");
          return VisitorOption.Skip;

        case Syntax.CodeBlock:
          output.push(nodeToString(node));
          output.push("");
          break;

        case Syntax.Html:
          output.push(nodeToString(node));
          output.push("");
          break;

        case Syntax.ReferenceDef:
          break;

        case Syntax.HorizontalRule:
          output.push("================================================");
          break;

        case Syntax.Str:
          break;

        case Syntax.Break:
          break;

        case Syntax.Emphasis:
          break;

        case Syntax.Strong:
          break;

        case Syntax.Html:
          break;

        case Syntax.Link:
          break;

        case Syntax.Image:
          break;

        case Syntax.Code:
          break;

        case "Table":
          tempTable = [];
          break;
        case "TableCell":
          tempTableRow.push(nodeToString(node));
        default:
          break;
      }
    },
    leave(node) {
      switch (node.type) {
        case "Table":
          var wt = new WordTable(tempTable[0], tempTable.slice(1));
          output.push(wt.string());
          output.push("");

        case "TableRow":
          tempTable.push(tempTableRow);
          tempTableRow = [];
        default:
          break;
      }
    }
  });
  return output.join("\n");
}

module.exports = convert;
