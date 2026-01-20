// frontend/lexer/types.ts
var TokenType = /* @__PURE__ */function (TokenType2) {
  TokenType2[TokenType2["Number"] = 0] = "Number";
  TokenType2[TokenType2["Identifier"] = 1] = "Identifier";
  TokenType2[TokenType2["String"] = 2] = "String";
  TokenType2[TokenType2["BinaryOperator"] = 3] = "BinaryOperator";
  TokenType2[TokenType2["Equals"] = 4] = "Equals";
  TokenType2[TokenType2["OpenParen"] = 5] = "OpenParen";
  TokenType2[TokenType2["CloseParen"] = 6] = "CloseParen";
  TokenType2[TokenType2["OpenBrace"] = 7] = "OpenBrace";
  TokenType2[TokenType2["CloseBrace"] = 8] = "CloseBrace";
  TokenType2[TokenType2["OpenBracket"] = 9] = "OpenBracket";
  TokenType2[TokenType2["CloseBracket"] = 10] = "CloseBracket";
  TokenType2[TokenType2["Colon"] = 11] = "Colon";
  TokenType2[TokenType2["Semicolon"] = 12] = "Semicolon";
  TokenType2[TokenType2["Comma"] = 13] = "Comma";
  TokenType2[TokenType2["Dot"] = 14] = "Dot";
  TokenType2[TokenType2["EOF"] = 15] = "EOF";
  TokenType2[TokenType2["Let"] = 16] = "Let";
  TokenType2[TokenType2["Const"] = 17] = "Const";
  TokenType2[TokenType2["Fn"] = 18] = "Fn";
  TokenType2[TokenType2["Return"] = 19] = "Return";
  TokenType2[TokenType2["If"] = 20] = "If";
  TokenType2[TokenType2["ElseIf"] = 21] = "ElseIf";
  TokenType2[TokenType2["Else"] = 22] = "Else";
  TokenType2[TokenType2["While"] = 23] = "While";
  TokenType2[TokenType2["For"] = 24] = "For";
  TokenType2[TokenType2["Continue"] = 25] = "Continue";
  TokenType2[TokenType2["Break"] = 26] = "Break";
  return TokenType2;
}({});
var KEYWORDS = {
  "xullas": TokenType.Let,
  "jovob": TokenType.Const,
  "endi": TokenType.Equals,
  "tema": TokenType.Fn,
  "qaytar": TokenType.Return,
  // conditions
  "agar": TokenType.If,
  "yemasa": TokenType.ElseIf,
  "oxiri": TokenType.Else,
  "va": TokenType.BinaryOperator,
  "yoki": TokenType.BinaryOperator,
  // loops
  "aylan": TokenType.While,
  "qarama": TokenType.Continue,
  "toxta": TokenType.Break
};

// frontend/lexer/misc.ts
function isAlpha(src) {
  return /[a-zA-Z]/.test(src);
}
function isInt(src) {
  return /^-?\d+$/.test(src);
}
function isEscapeChar(src) {
  return /^[ \n\t\r]$/.test(src);
}

// frontend/errors/index.ts
function parserError(msg, line) {
  throw `Parser Error: ${msg} Line: ${line || "optional"}`;
}
function lexerError(msg, line) {
  throw `Lexet Error: ${msg} Line: ${line || "optional"}`;
}

// frontend/lexer/index.ts
function tokenize(srcCode) {
  const tokens = new Array();
  const src = srcCode.split("");
  let tempWord = "";
  let line = 1;
  const saveInt = () => {
    tokens.push(token(tempWord, TokenType.Number));
  };
  const saveAlpha = () => {
    const reserved = KEYWORDS[tempWord];
    if (typeof reserved == "number") {
      tokens.push(token(tempWord, reserved));
      return;
    }
    tokens.push(token(tempWord, TokenType.Identifier));
  };
  const finalHandle = (index) => {
    if (isInt(tempWord)) {
      saveInt();
    } else if (isAlpha(tempWord)) {
      saveAlpha();
    } else if (!isEscapeChar(src[index]) && tempWord) {
      lexerError("Cannot divide by zero!", index);
    }
    tempWord = "";
  };
  const findTheEnd = (i) => {
    while (src[i] != "\n" && src[i] != void 0) {
      i++;
    }
    return i;
  };
  const getString = (i) => {
    let str = "";
    i++;
    while (src[i] != '"') {
      str += src[i];
      i++;
    }
    tokens.push(token(str, TokenType.String));
    return i;
  };
  function token(value, type) {
    return {
      value,
      type,
      line
    };
  }
  for (let i = 0; i < src.length; i++) {
    if (src[i] == "\n") {
      line++;
    }
    if (src[i] == "#") {
      i = findTheEnd(i);
      continue;
    }
    if (src[i] == '"') {
      i = getString(i);
      continue;
    }
    if (src[i] == "(") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.OpenParen));
      continue;
    }
    if (src[i] == ")") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.CloseParen));
      continue;
    }
    if (src[i] == "{") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.OpenBrace));
      continue;
    }
    if (src[i] == "}") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.CloseBrace));
      continue;
    }
    if (src[i] == "[") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.OpenBracket));
      continue;
    }
    if (src[i] == "]") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.CloseBracket));
      continue;
    }
    if ([
    "+",
    "-",
    "*",
    "/",
    "%"].
    includes(src[i])) {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.BinaryOperator));
      continue;
    }
    if (src[i] == ";") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.Semicolon));
      continue;
    }
    if (src[i] == ":") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.Colon));
      continue;
    }
    if (src[i] == ",") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.Comma));
      continue;
    }
    if (src[i] == ".") {
      finalHandle(i);
      tokens.push(token(src[i], TokenType.Dot));
      continue;
    }
    if (isInt(src[i])) {
      tempWord += src[i];
      if (i + 1 == src.length) {
        saveInt();
      }
      continue;
    }
    if (isAlpha(src[i])) {
      tempWord += src[i];
      if (i + 1 == src.length) {
        saveAlpha();
      }
      continue;
    }
    if ([
    ">",
    "<",
    "!",
    "="].
    includes(src[i])) {
      if (src[i + 1] == "=") {
        finalHandle(i);
        tokens.push(token(`${src[i]}${src[i + 1]}`, TokenType.BinaryOperator));
        i++;
        continue;
      }
      if (src[i] == "=") {
        finalHandle(i);
        tokens.push(token(src[i], TokenType.Equals));
        continue;
      }
      finalHandle(i);
      tokens.push(token(src[i], TokenType.BinaryOperator));
      continue;
    }
    finalHandle(i);
  }
  tokens.push({
    value: "EndOfFile",
    type: TokenType.EOF,
    line
  });
  return tokens;
}

// frontend/parser/index.ts
var Parser = class {
  tokens = [];
  index = 0;
  notEOF() {
    return this.tokens[this.index].type != TokenType.EOF;
  }
  /** Returns the current token */
  at() {
    return this.tokens[this.index];
  }
  /** Moves one step forward and returns the previous token (came from) */
  next() {
    this.index++;
    return this.tokens[this.index - 1];
  }
  /** Gives the line we are at */
  line() {
    return this.at().line;
  }
  /**
   * Expects some type and moves one step forward \
   * Returns prev values before move
   */
  expect(type, error) {
    this.index++;
    const prev = this.tokens[this.index - 1];
    if (!prev || prev.type != type) {
      parserError(`${error} ->
        ${prev} - 
        Expected: ${type}
        `, this.line());
    }
    return prev;
  }
  /** Terminates process with given error */
  panic(msg) {
    throw `Parse Error: ${msg} Line: ${this.line()}`;
  }
  parseStatement() {
    switch (this.at().type) {
      // variables
      case TokenType.Let:
      case TokenType.Const:
        return this.parseVarDeclaration();
      // functions
      case TokenType.Fn:
        return this.parseFnDeclaration();
      case TokenType.Return:
        return this.parseReturnStatement();
      // conditions
      case TokenType.If:
        return this.parseIfStatement();
      case TokenType.ElseIf:
        this.panic("Elif must have a parent IF stmt!");
      /* falls through */
      case TokenType.Else:
        this.panic("Else must have a parent IF stmt!");
      /* falls through */
      // Loops
      case TokenType.While:
        return this.parseWhileStatement();
      case TokenType.Continue:
        this.skipMove();
        return {
          kind: "ContinueStatement"
        };
      case TokenType.Break:
        this.skipMove();
        return {
          kind: "BreakStatement"
        };
      default:
        return this.parseExpression();
    }
  }
  /**
   *  Formats:
   *  1. (Let | Const) Identifier Equal Expression Semicolon
   *  ```
   *      xullas a endi 4;
   *      aniq a endi 4;
   *  ```
   *  2. Let Identifier Semicolon
   *    ```
   *        xullas a;
   *    ```
   */
  parseVarDeclaration() {
    const isConst = this.next().type == TokenType.Const;
    const identifier = this.expect(TokenType.Identifier, "PARSER: Expected identifier after let | const").value;
    if (this.at().type == TokenType.Semicolon) {
      if (isConst) {
        this.panic("Const must contain a value fool!");
      }
      this.next();
      return {
        kind: "VariableDeclaration",
        identifier,
        isConst
      };
    }
    this.expect(TokenType.Equals, "Expected equals token");
    const declaration = {
      kind: "VariableDeclaration",
      identifier,
      value: this.parseExpression(),
      isConst
    };
    if (this.at().type == TokenType.Semicolon) {
      this.next();
    }
    return declaration;
  }
  parseFnDeclaration() {
    this.next();
    const name = this.expect(TokenType.Identifier, "Expceted function name following fn keyword").value;
    const args = this.parseArgs();
    const params = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        this.panic("Expected identifier on func declaration");
      }
      params.push(arg.symbol);
    }
    this.expect(TokenType.OpenBrace, "Expected '{' after function params");
    const body = [];
    while (this.at().type != TokenType.EOF && this.at().type != TokenType.CloseBrace) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.CloseBrace, "Expected '}' after function body");
    const fn = {
      kind: "FunctionDeclaration",
      name,
      body,
      params
    };
    return fn;
  }
  parseReturnStatement() {
    this.next();
    const value = this.parseExpression();
    this.expect(TokenType.Semicolon, "Expected semicolon after return");
    return {
      kind: "ReturnStatement",
      value
    };
  }
  parseIfStatement() {
    this.next();
    this.expect(TokenType.OpenParen, "Expected '(' after IF statement");
    const condition = this.parseLogicalExpression();
    this.expect(TokenType.CloseParen, "Expected ')' after IF statement");
    this.expect(TokenType.OpenBrace, "Expected '{' after IF statement");
    const body = [];
    while (this.at().type != TokenType.EOF && this.at().type != TokenType.CloseBrace) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.CloseBrace, "Expected '}' after if body");
    const children = [];
    let counter = 0;
    const checkChildren = () => {
      if (this.at().type == TokenType.ElseIf) {
        children.push(this.parseElifStatement());
        checkChildren();
      } else if (this.at().type == TokenType.Else) {
        if (counter > 0) {
          this.panic("If can contain only one else statement");
        }
        children.push(this.parseElseStatement());
        counter++;
        checkChildren();
      }
    };
    checkChildren();
    const ifStmt = {
      kind: "IfStatement",
      condition,
      body,
      children: children.length > 0 ? children : void 0
    };
    return ifStmt;
  }
  parseElifStatement() {
    this.next();
    this.expect(TokenType.OpenParen, "Expected '(' after elif statement");
    const condition = this.parseLogicalExpression();
    this.expect(TokenType.CloseParen, "Expected ')' after elif statement");
    this.expect(TokenType.OpenBrace, "Expected '{' after elif statement");
    const body = [];
    while (this.at().type != TokenType.EOF && this.at().type != TokenType.CloseBrace) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.CloseBrace, "Expected '}' after if body");
    const elifStmt = {
      kind: "ElifStatement",
      condition,
      body
    };
    return elifStmt;
  }
  parseElseStatement() {
    this.next();
    this.expect(TokenType.OpenBrace, "Expected '{' after else statement");
    const body = [];
    while (this.at().type != TokenType.EOF && this.at().type != TokenType.CloseBrace) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.CloseBrace, "Expected '}' after if body");
    const elseStmt = {
      kind: "ElseStatement",
      body
    };
    return elseStmt;
  }
  parseWhileStatement() {
    this.next();
    this.expect(TokenType.OpenParen, "Expected open paren on while loop");
    const condition = this.parseLogicalExpression();
    this.expect(TokenType.CloseParen, "Expected ')' after while statement");
    this.expect(TokenType.OpenBrace, "Expected '{' after while statement");
    const body = [];
    while (this.at().type != TokenType.EOF && this.at().type != TokenType.CloseBrace) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.CloseBrace, "Expected '}' after while's body");
    return {
      kind: "WhileStatement",
      condition,
      body
    };
  }
  /**
   * Moves one step forward and after that skips semicolon if faced.
   */
  skipMove() {
    this.next();
    if (this.at().type == TokenType.Semicolon) {
      this.next();
    }
  }
  // - Orders Of Prescidence -
  // Assignment
  // Object
  // Logical
  // Relational
  // AdditiveExpr
  // MultiplicitaveExpr
  // CallMember
  // Member
  // PrimaryExpr
  parseExpression() {
    return this.parseAssignmentExpression();
  }
  parseAssignmentExpression() {
    const left = this.parseArrayExpression();
    if (this.at().type == TokenType.Equals) {
      this.next();
      const value = this.parseAssignmentExpression();
      if (this.at().type == TokenType.Semicolon) {
        this.next();
      }
      return {
        value,
        owner: left,
        kind: "AssignmentExpression"
      };
    }
    return left;
  }
  parseArrayExpression() {
    if (this.at().type !== TokenType.OpenBracket) {
      return this.parseObjectExpression();
    }
    this.next();
    const values = new Array();
    while (this.notEOF() && this.at().type != TokenType.CloseBracket) {
      if (this.at().type == TokenType.Comma) {
        this.next();
        continue;
      }
      values.push(this.parseExpression());
    }
    this.expect(TokenType.CloseBracket, "Closing bracket expected on array");
    if (this.at().type == TokenType.Semicolon) {
      this.next();
    }
    return {
      kind: "ArrayLiteral",
      values
    };
  }
  parseObjectExpression() {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parseLogicalExpression();
    }
    this.next();
    const props = new Array();
    while (this.notEOF() && this.at().type != TokenType.CloseBrace) {
      const key = this.expect(TokenType.Identifier, "Object literal key expected!").value;
      if (this.at().type == TokenType.Comma) {
        this.next();
        props.push({
          kind: "Property",
          key
        });
        continue;
      }
      if (this.at().type == TokenType.CloseBrace) {
        props.push({
          kind: "Property",
          key
        });
        continue;
      }
      this.expect(TokenType.Colon, "Missing colon after key");
      const value = this.parseExpression();
      props.push({
        kind: "Property",
        key,
        value,
        line: this.line()
      });
      if (this.at().type != TokenType.CloseBrace) {
        this.expect(TokenType.Comma, "Comma or closing brace expected on Object");
      }
    }
    this.expect(TokenType.CloseBrace, "Object closing brace missing!");
    return {
      kind: "ObjectLiteral",
      props
    };
  }
  parseLogicalExpression() {
    let left = this.parseRelationalExpression();
    while ([
    "va",
    "yoki"].
    includes(this.at().value)) {
      const operator = this.next().value;
      const right = this.parseRelationalExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator
      };
    }
    return left;
  }
  parseRelationalExpression() {
    let left = this.parseAdditiveExpression();
    while ([
    ">",
    "<",
    "==",
    ">=",
    "<=",
    "!="].
    includes(this.at().value)) {
      const operator = this.next().value;
      const right = this.parseAdditiveExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator
      };
    }
    return left;
  }
  parseAdditiveExpression() {
    let left = this.parseMultiplicativeExpression();
    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.next().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator
      };
    }
    return left;
  }
  parseMultiplicativeExpression() {
    let left = this.parseCallMemeberExpression();
    while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
      const operator = this.next().value;
      const right = this.parseCallMemeberExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator
      };
    }
    return left;
  }
  parseCallMemeberExpression() {
    const member = this.parseMemberExpression();
    if (this.at().type == TokenType.OpenParen) {
      return this.parseCallExpression(member);
    }
    return member;
  }
  parseCallExpression(caller) {
    let callExpr = {
      kind: "CallExpression",
      caller,
      args: this.parseArgs()
    };
    if (this.at().type == TokenType.OpenParen) {
      callExpr = this.parseCallExpression(callExpr);
    }
    return callExpr;
  }
  parseArgs() {
    this.expect(TokenType.OpenParen, "Exprected open paren");
    const args = this.at().type == TokenType.CloseParen ? [] : this.parseArgList();
    this.expect(TokenType.CloseParen, "Exprected close paren");
    if (this.at().type == TokenType.Semicolon) {
      this.next();
    }
    return args;
  }
  parseArgList() {
    const args = [
    this.parseAssignmentExpression()];

    while (this.at().type == TokenType.Comma && this.next()) {
      args.push(this.parseAssignmentExpression());
    }
    return args;
  }
  parseMemberExpression() {
    let object = this.parsePrimaryExpression();
    while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket) {
      const operator = this.next();
      let prop;
      let computed;
      if (operator.type == TokenType.Dot) {
        computed = false;
        prop = this.parsePrimaryExpression();
        if (prop.kind != "Identifier") {
          this.panic("Nuxtadan keyin normalniy klichka berin");
        }
      } else {
        computed = true;
        prop = this.parseExpression();
        this.expect(TokenType.CloseBracket, "Missing close bracker after computed value");
      }
      object = {
        kind: "MemberExpression",
        object,
        prop,
        computed
      };
    }
    return object;
  }
  parsePrimaryExpression() {
    const tk = this.at().type;
    switch (tk) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          symbol: this.next().value
        };
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.next().value)
        };
      case TokenType.String:
        return {
          kind: "StringLiteral",
          value: this.next().value
        };
      case TokenType.OpenParen:{
          this.next();
          const value = this.parseExpression();
          this.expect(TokenType.CloseParen, "Unexpected token inside skobki");
          return value;
        }
      case TokenType.BinaryOperator:{
          if (this.at().value == "-") {
            this.next();
            const num = this.expect(TokenType.Number, "Expected a number after a minus sign").value;
            return {
              kind: "NumericLiteral",
              value: -1 * parseFloat(num)
            };
          }
          this.panic(`Error occured in parsing a token ${this.at()}`);
          break;
        }
      default:
        this.panic(`Error occured in parsing a token ${this.at()}`);
    }
  }
  /**
   * @param srcCode
   * @returns Program to interpert
   *
   * Takes the source code and makes Abstract
   * Syntax Tree to be interpreted
   */
  createAST(srcCode) {
    this.tokens = tokenize(srcCode);
    const program = {
      kind: "Program",
      body: [],
      line: 0
    };
    this.index = 0;
    while (this.notEOF()) {
      const start = this.tokens[this.index].line;
      const stmt = this.parseStatement();
      stmt.line = start;
      program.body.push(stmt);
    }
    return program;
  }
};

// runtime/values.ts
function MK_NUMBER(n) {
  return {
    type: "number",
    value: n
  };
}
function MK_NULL() {
  return {
    type: "null",
    value: null
  };
}
function MK_BOOL(value = true) {
  return {
    type: "boolean",
    value
  };
}
function MK_STR(value) {
  return {
    type: "string",
    value
  };
}
function MK_FLOW(catched, skip, stop, returnValue) {
  return {
    type: "flow",
    catched,
    skip,
    stop,
    returnValue
  };
}
function MK_NATIVE_FN(call) {
  return {
    type: "native-fn",
    call
  };
}

// runtime/errors/panic.ts
function panic(msg, line) {
  throw `Interpretator Error: ${msg} Line: ${line}`;
}
function stdPanic(msg) {
  throw `Standard Lib Error: ${msg}`;
}

// runtime/std/functions.ts
function korsat(args, _env) {
  console.log(...args.map((arg) => {
    if (arg == void 0) {
      return;
    }
    if (arg.type == "array") {
      const temp = [];
      arg.values.forEach((el) => {
        temp.push((el.value ?? "null").toString());
      });
      return "[ " + temp.join(", ") + " ]";
    }
    if (arg.type == "object") {
      return [
      ...arg.props.entries()].
      toString();
    }
    return arg.value;
  }));
  return MK_NULL();
}
async function gapir(args) {
  if (args.length < 2 && args[0].type == "string") {
    const text = args[0];
    const input = await prompt(text.value);
    return MK_STR(input ?? "");
  }
  return MK_NULL();
}
function son(args) {
  if (args.length < 2 && args[0].type == "string") {
    const num = Number(args[0].value);
    return MK_NUMBER(num);
  }
  return MK_NULL();
}
function shara(args) {
  if (args.length != 2) {
    stdPanic(`Random function needs 2 arguments, but ${args.length} were passed`);
  }
  if (args[0].type != "number" || args[1].type != "number") {
    stdPanic("Arguments for random function must be of a number type");
  }
  const min = args[0].value;
  const max = args[1].value;
  return MK_NUMBER(Math.random() * (max - min) + min);
}
function kelishtir(args) {
  if (args.length != 1) {
    stdPanic(`Round function needs 1 argument, but ${args.length} were passed`);
  }
  if (args[0].type != "number") {
    stdPanic("Arguments for round function must be of a number type");
  }
  return MK_NUMBER(Math.round(args[0].value));
}

// runtime/environment/env.ts
function createGlobalEnv() {
  const env = new Environment();
  env.declareVariable("true", MK_BOOL(), true, -1);
  env.declareVariable("lagmon", MK_BOOL(false), true, -1);
  env.declareVariable("pustoy", MK_NULL(), true, -1);
  env.declareVariable("korsat", MK_NATIVE_FN(korsat), true, -1);
  env.declareVariable("gapir", MK_NATIVE_FN(gapir), true, -1);
  env.declareVariable("son", MK_NATIVE_FN(son), true, -1);
  env.declareVariable("shara", MK_NATIVE_FN(shara), true, -1);
  env.declareVariable("kelishtir", MK_NATIVE_FN(kelishtir), true, -1);
  return env;
}
var Environment = class {
  parent;
  variables;
  constants;
  constructor(parentEnv) {
    this.parent = parentEnv;
    this.variables = /* @__PURE__ */new Map();
    this.constants = /* @__PURE__ */new Set();
  }
  declareVariable(name, value, isConst, line) {
    if (this.variables.has(name)) {
      panic(`ENV: Varibale "${name}" already defined. Cannot declare twice`, line);
    }
    if (isConst) {
      this.constants.add(name);
    }
    this.variables.set(name, value);
    return value;
  }
  resolve(name, line) {
    if (this.variables.has(name)) {
      return this;
    }
    if (this.parent == void 0) {
      panic(`ENV: Variable "${name}" is not declared. Cannot assign`, line);
    }
    return this.parent.resolve(name, line);
  }
  assignVariable(name, value, line) {
    const env = this.resolve(name, line);
    if (env.constants.has(name)) {
      panic(`Const ${name} cannot be mutated`, line);
    }
    env.variables.set(name, value);
    return value;
  }
  getVariable(name, line) {
    const env = this.resolve(name, line);
    return env.variables.get(name);
  }
  updateVariable(name, updated, line) {
    const env = this.resolve(name, line);
    env.variables.set(name, updated);
    return updated;
  }
};

// runtime/evaluate/expressions.ts
function evalNumericBinaryExpression(left, right, operator) {
  let result;
  switch (operator) {
    case "+":
      result = left.value + right.value;
      break;
    case "-":
      result = left.value - right.value;
      break;
    case "*":
      result = left.value * right.value;
      break;
    case "/":
      if (right.value == 0) {
        panic("Cannot divide by zero!", -1);
      }
      result = left.value / right.value;
      break;
    default:
      result = left.value % right.value;
  }
  return {
    type: "number",
    value: result
  };
}
function evalStringBinaryExpression(left, right, operator, line = -1) {
  let result;
  switch (operator) {
    case "+":
      result = left.value + right.value;
      break;
    default:
      panic("Faqat concat qilish mumkin!", line);
  }
  return {
    type: "string",
    value: result
  };
}
function evalRelationalBinaryExpr(left, right, operator) {
  let result;
  switch (operator) {
    case ">":
      result = left.value > right.value;
      break;
    case "<":
      result = left.value < right.value;
      break;
    case "==":
      result = left.value == right.value;
      break;
    case "!=":
      result = left.value != right.value;
      break;
    case ">=":
      result = left.value >= right.value;
      break;
    default:
      result = left.value <= right.value;
      break;
  }
  return {
    type: "boolean",
    value: result
  };
}
function evalLogicalBinaryExpr(left, right, operator) {
  let result;
  switch (operator) {
    case "va":
      result = left.value && right.value;
      break;
    default:
      result = left.value || right.value;
  }
  return {
    type: "boolean",
    value: result
  };
}
async function evalBinaryExpression(binop, env) {
  const left = await interpret(binop.left, env);
  const right = await interpret(binop.right, env);
  const bothNumbers = () => {
    return left.type == "number" && right.type == "number";
  };
  const bothStrings = () => {
    return left.type == "string" && right.type == "string";
  };
  const bothBools = () => {
    return left.type == "boolean" && right.type == "boolean";
  };
  if ([
  ">=",
  "<=",
  ">",
  "<",
  "==",
  "!="].
  includes(binop.operator)) {
    if (bothNumbers()) {
      return evalRelationalBinaryExpr(left, right, binop.operator);
    }
    if (bothStrings()) {
      return evalRelationalBinaryExpr(left, right, binop.operator);
    }
    panic("Bir biriga tog'ri keladigan ishni qilin. Son bilan son, gap bilan gap solishtirin faqat", binop.line);
  }
  if (binop.operator == "va" || binop.operator == "yoki") {
    if (bothBools()) {
      return evalLogicalBinaryExpr(left, right, binop.operator);
    }
    panic("va/yoki faqat boolni orasida bo'lishi mumkin aka", binop.line);
  }
  if (bothNumbers()) {
    return evalNumericBinaryExpression(left, right, binop.operator);
  }
  if (bothStrings()) {
    return evalStringBinaryExpression(left, right, binop.operator, binop.line);
  }
  return MK_NULL();
}
function evalIdentifier(ident, env) {
  const varibale = env.getVariable(ident.symbol, ident.line);
  return varibale;
}
async function evalAssignment(node, env) {
  if (node.owner.kind !== "Identifier") {
    panic("Cannot assign to anything rather than an identifier", node.line);
  }
  const varname = node.owner.symbol;
  return env.assignVariable(varname, await interpret(node.value, env), node.line);
}
async function evalObjectExpression(obj, env) {
  const object = {
    type: "object",
    props: /* @__PURE__ */new Map()
  };
  for (const { key, value } of obj.props) {
    const runtimeVal = value == void 0 ? env.getVariable(key, obj.line) : await interpret(value, env);
    object.props.set(key, runtimeVal);
  }
  return object;
}
async function evalArrayExpression(arr, env) {
  const array = {
    type: "array",
    values: []
  };
  for (const element of arr.values) {
    array.values.push(await interpret(element, env));
  }
  return array;
}
async function evalCallExpression(call, env) {
  const args = await Promise.all(call.args.map((arg) => interpret(arg, env)));
  const fn = await interpret(call.caller, env);
  if (fn.type == "native-fn") {
    const result = await fn.call(args, env);
    return result;
  }
  if (fn.type == "function") {
    const func = fn;
    const scope = new Environment(func.declarationEnv);
    if (args.length == func.params.length) {
      for (let i = 0; i < func.params.length; i++) {
        scope.declareVariable(func.params[i], args[i], false, call.line);
      }
      let result = MK_NULL();
      for (const statement of func.body) {
        if (statement.kind == "ReturnStatement") {
          result = await interpret(statement, scope);
          return result;
        }
        result = await interpret(statement, scope);
        if (result.type == "flow") {
          const flow = result;
          if (flow.stop && flow.returnValue) {
            return flow.returnValue;
          }
        }
      }
      return result;
    }
    panic(`The number of args must match calling the function

           You gave ${args.length}

           Should be: ${func.params.length}`, call.line);
  }
  if (call.caller.kind == "MemberExpression") {
    const obj = call.caller.object;
    const cur = env.getVariable(obj.symbol, call.line);
    if (fn.value == "push" && args.length == 1) {
      cur.values.push(args[0]);
      return env.updateVariable(obj.symbol, cur, call.line);
    } else if (fn.value == "pop" && args.length == 0) {
      cur.values.pop();
      return env.updateVariable(obj.symbol, cur, call.line);
    } else if (fn.value == "shift" && args.length == 0) {
      cur.values.shift();
      return env.updateVariable(obj.symbol, cur, call.line);
    } else if (fn.value == "clear" && args.length == 0) {
      cur.values = [];
      return env.updateVariable(obj.symbol, cur, call.line);
    } else if (fn.value == "getlength" && args.length == 0) {
      return MK_NUMBER(cur.values.length);
    }
  }
  panic(`${JSON.stringify(fn)} is not a function. So we can't call it!`, call.line);
}
function makeKeysToCall(expr, env) {
  if (expr.object.kind == "MemberExpression") {
    const last = makeKeysToCall(expr.object, env);
    if (expr.prop.kind == "Identifier") {
      last.push(expr.prop.symbol);
    } else if (expr.prop.kind == "StringLiteral") {
      last.push(expr.prop.value);
    }
    return last;
  }
  if (expr.object.kind == "Identifier") {
    const ident = expr.object;
    const prop = expr.prop;
    if (prop.kind == "Identifier") {
      const val = env.getVariable(prop.symbol, expr.line);
      if (val.type != "string") {
        panic("Only string computed is supported", expr.line);
      }
      return [
      ident.symbol,
      val.value];

    }
    return expr.prop.kind == "Identifier" ? [
    ident.symbol,
    expr.prop.symbol] :
    [
    ident.symbol,
    expr.prop.value];

  }
  panic(`Other kinds for objects are not supported yet
 Given: ${expr.object}`, expr.line);
}
async function evalMemberExpression(expr, env) {
  if (expr.prop.kind == "NumericLiteral") {
    const arr = env.getVariable(expr.object.symbol, expr.line);
    if (arr.values == void 0) {
      panic("This syntax is supported by arrays only", expr.line);
    }
    const index = expr.prop;
    if (index.value >= arr.values.length) {
      panic("Index out of bounds", expr.line);
    }
    return arr.values[index.value];
  } else if (expr.prop.kind == "Identifier" && expr.object.kind == "Identifier") {
    const symbol = expr.prop.symbol;
    if (symbol == "qosh") {
      return MK_STR("push");
    } else if (symbol == "chop") {
      return MK_STR("pop");
    } else if (symbol == "sur") {
      return MK_STR("shift");
    } else if (symbol == "yuqot") {
      return MK_STR("clear");
    } else if (symbol == "razmer") {
      return MK_STR("getlength");
    }
  }
  if (expr.prop.kind == "BinaryExpression" && expr.object.kind == "Identifier") {
    const binexpr = expr.prop;
    const index = await evalBinaryExpression(binexpr, env);
    const arr = env.getVariable(expr.object.symbol, expr.line);
    if (arr.values == void 0) {
      panic("This syntax is supported by arrays only", expr.line);
    }
    if (index.value >= arr.values.length) {
      panic("Index out of bounds", expr.line);
    }
    return arr.values[index.value];
  }
  if (expr.computed && expr.prop.kind == "Identifier") {
    const symbol = expr.object.symbol;
    const index = env.getVariable(expr.prop.symbol, expr.line);
    const arr = env.getVariable(symbol, expr.line);
    if (arr.values != void 0) {
      if (index.value >= arr.values.length) {
        panic("Index out of bounds", expr.line);
      }
      return arr.values[index.value];
    }
  }
  const keys = makeKeysToCall(expr, env);
  let variable = env.getVariable(keys[0], expr.line);
  for (let i = 1; i < keys.length; i++) {
    variable = variable.props.get(keys[i]);
  }
  return variable;
}

// runtime/evaluate/statements.ts
async function evalProgram(program, env) {
  let lastInterpreted = MK_NULL();
  for (const statement of program.body) {
    lastInterpreted = await interpret(statement, env);
  }
  return lastInterpreted;
}
async function evalVarDeclaration(declaration, env) {
  const value = declaration.value ? await interpret(declaration.value, env) : MK_NULL();
  return env.declareVariable(declaration.identifier, value, declaration.isConst, declaration.line);
}
function evalFnDeclaration(declaration, env) {
  const fn = {
    type: "function",
    name: declaration.name,
    params: declaration.params,
    declarationEnv: env,
    body: declaration.body
  };
  return env.declareVariable(declaration.name, fn, true, declaration.line);
}
async function evalReturnStatement(statement, env) {
  return await interpret(statement.value, env);
}
async function evalNestedReturnStatement(statement, env) {
  const interpretedValue = await interpret(statement, env);
  return MK_FLOW(true, false, true, interpretedValue);
}
async function evalIfStatement(statement, env) {
  const scope = new Environment(env);
  const condition = await interpret(statement.condition, env);
  if (condition.value) {
    for (const stmt of statement.body) {
      if (stmt.kind == "ReturnStatement") {
        return await evalNestedReturnStatement(stmt, scope);
      }
      const val = await interpret(stmt, scope);
      if (val.type == "flow") {
        const flow = val;
        if (flow.skip || flow.stop) {
          return MK_FLOW(true, flow.skip, flow.stop, flow.returnValue);
        }
      }
    }
    return MK_FLOW(true, false, false);
  }
  if (statement.children) {
    for (const child of statement.children) {
      const result = await interpret(child, env);
      if (result.type == "flow") {
        const flow = result;
        if (flow.catched) {
          if (flow.skip || flow.stop) {
            return MK_FLOW(true, flow.skip, flow.stop, flow.returnValue);
          }
          break;
        }
      }
    }
  }
  return MK_FLOW(false, false, false);
}
async function evalElifStatement(statement, env) {
  const scope = new Environment(env);
  const condition = await interpret(statement.condition, env);
  if (condition.value) {
    for (const stmt of statement.body) {
      if (stmt.kind == "ReturnStatement") {
        return await evalNestedReturnStatement(stmt, scope);
      }
      const val = await interpret(stmt, scope);
      if (val.type == "flow") {
        const flow = val;
        if (flow.skip || flow.stop) {
          return MK_FLOW(true, flow.skip, flow.stop, flow.returnValue);
        }
      }
    }
    return MK_FLOW(true, false, false);
  }
  return MK_FLOW(false, false, false);
}
async function evalElseStatement(statement, env) {
  const scope = new Environment(env);
  for (const stmt of statement.body) {
    if (stmt.kind == "ReturnStatement") {
      return await evalNestedReturnStatement(stmt, scope);
    }
    const val = await interpret(stmt, scope);
    if (val.type == "flow") {
      const flow = val;
      if (flow.skip || flow.stop) {
        return MK_FLOW(true, flow.skip, flow.stop, flow.returnValue);
      }
    }
  }
  return MK_FLOW(true, false, false);
}
async function evalWhileStatement(statement, env) {
  const scope = new Environment(env);
  while ((await interpret(statement.condition, env)).value) {
    for (const stmt of statement.body) {
      const val = await interpret(stmt, scope);
      if (val.type == "flow") {
        const flow = val;
        if (flow.skip) {
          break;
        } else if (flow.stop) {
          return flow.returnValue || MK_NULL();
        }
      }
    }
  }
  return MK_NULL();
}

// runtime/interpreter.ts
async function interpret(astNode, env) {
  switch (astNode.kind) {
    case "NumericLiteral":
      return MK_NUMBER(astNode.value);
    case "StringLiteral":
      return MK_STR(astNode.value);
    case "Identifier":
      return evalIdentifier(astNode, env);
    case "BinaryExpression":
      return await evalBinaryExpression(astNode, env);
    case "Program":
      return await evalProgram(astNode, env);
    case "VariableDeclaration":
      return await evalVarDeclaration(astNode, env);
    case "FunctionDeclaration":
      return evalFnDeclaration(astNode, env);
    case "ReturnStatement":
      return await evalReturnStatement(astNode, env);
    case "AssignmentExpression":
      return await evalAssignment(astNode, env);
    case "ObjectLiteral":
      return await evalObjectExpression(astNode, env);
    case "CallExpression":
      return await evalCallExpression(astNode, env);
    case "MemberExpression":
      return await evalMemberExpression(astNode, env);
    case "IfStatement":
      return await evalIfStatement(astNode, env);
    case "ElifStatement":
      return await evalElifStatement(astNode, env);
    case "ElseStatement":
      return await evalElseStatement(astNode, env);
    case "ArrayLiteral":
      return await evalArrayExpression(astNode, env);
    case "WhileStatement":
      return await evalWhileStatement(astNode, env);
    case "ContinueStatement":
      return MK_FLOW(false, true, false);
    case "BreakStatement":
      return MK_FLOW(false, false, true);
    default:
      panic(`Interpreter: AST type not handled yet type: ${astNode}`, astNode.line);
  }
}

// platforms/shared/runner.ts
async function runCode(code) {
  const parser = new Parser();
  const env = createGlobalEnv();
  const program = parser.createAST(code);
  await interpret(program, env);
}
export {
  runCode };