
tokens =[];
operators = ["+", "-", "*", "/",  "==","=", "!=", "&&", "||"];

function analizadorlexico() {
  tokens=[]
  document.getElementById("R").innerHTML = "";
  valueText = document.getElementById("valueText").value; 
  primerCaracter = valueText.charAt(0);

  u = 0;
  str = ""; 
  while (u <= valueText.length - 1) {  
    l = u;
    u = validateKeyword(u);
    u = validateId(u);
    u = validateReal(u);
    u = validateInteger(u);   
    u = validateCaracter(u); //!No works.
    u = validateSpecialSymbol(u);
    u = validateOperator(u);
    if (l == u) {
      if(valueText[u] !== " "){
        document.getElementById("R").innerHTML = 
        document.getElementById("R").innerHTML + "<br>" + "TKN_NO_IDENTIFICADO (" + valueText[u] + ")";
      }
      u++;
    }
  }
  if(/^[a-zA-Z0-9\s]*=?[a-zA-Z0-9\s]*[;\s]*$/.test(valueText) && valueText){
    syntaxAnalyzer(valueText,1);
    return;
  }
  if(/^\s*\w*\s*\([^)]*\)\s*\{?\s*[^}]*\}?\s*/g.test(valueText)){
    syntaxAnalyzer(valueText,2)
    return;
  }
  if (operators.includes(primerCaracter)){
     return console.error(`Sintáxis Error: La expresión comienza con un operador no válido '${primerCaracter}'.`)
  }
  if(/^\s*\d+(\.\d+)?\s*[-+*\/]\s*\d+(\.\d+)?\s*$/.test(valueText)){
     syntaxAnalyzer(valueText,3);
     return;
  }
  
}

function validateKeyword(j) {
  const valueText = document.getElementById("valueText").value;
  const reservedWords = /\b(int|char|float|double|void|do|while|if|else|switch|signed|unsigned|return)\b/g;
  let i = j;
  reservedWords.lastIndex = i;
  const match = reservedWords.exec(valueText);
  if (match && match.index === i) {
    const word = match[0];
    document.getElementById("R").innerHTML +=
      "<br>TKN_PALABRA_RESERVADA '" + word + "'";
    i += word.length;
    tokens.push({tkn_id:'tkn_keyword', value:word})
    return i;
  }
  return i;
}
function validateId(j) {
  valueText = document.getElementById("valueText").value;
  check = document.getElementById("cbox").checked;
  patternSpanish = /[áéíóúÁÉÍÓÚÜüñÑa-zA-Z]/;
  patternEnglish = /[a-zA-Z]/;
  patternNumbers= /[0-9]/;
  A = [[], [2, -5, 2], [2, 2, 2]];
  i = j;
  statei = 1;
  statef = 2;
  state = statei;
  c = 0;
  while ((i < (valueText.length)) && (c != -1) && state != -5) {
    c = -1;
    if ((check && patternSpanish.test(valueText[i])) || patternEnglish.test(valueText[i]) ) {
      c = 0;
    }
    if (patternNumbers.test(valueText[i])) {
      c = 1;
    }
    if (valueText[i] == '_') {
      c = 2;
    }
    if (c == -1) {
    } else {
      state = A[state][c];
      i = i + 1;
    }
  }
  if (state == statef) {
    document.getElementById("R").innerHTML =
      document.getElementById("R").innerHTML + "<br>" + "TKN_IDENTIFICADOR (" + valueText.substr(j, i - j) + ")";
      tokens.push({tkn_id:'tkn_id',value:valueText.substr(j, i - j)})
    return i;
  }
  return j;
} 



function validateInteger(j) {
  valueText = document.getElementById("valueText").value;
  A = [[], [2, 2, 3], [3], [3]]; 
  i = j;
  statei = 1;
  statef = 3;
  state = statei;
  c = 0;
  patternNumbers= /[0-9]/;
  while (i < (valueText.length) && (c != -1)) {
    c = -1;
    if (valueText[i] == '-' && i==0 ) { 
      c = 0;
    }
    
    if (patternNumbers.test(valueText[i])) { 
      c = 2;
    }
    if (c == -1) {
      // state=-1;
    } else {
      state = (A[state, c]);
      i = i + 1;
    }
  }
  if (state == statef) {
    document.getElementById("R").innerHTML =
      document.getElementById("R").innerHTML + "<br>" + "TKN_ENTERO (" + valueText.substr(j, i - j) + ")";
      tokens.push({tkn_id:'tkn_integer',value: parseInt(valueText.substr(j, i - j))})
    
    return i;
  }
  return j;
}


function validateReal(j) {
  valueText = document.getElementById("valueText").value;
  patternNumbers= /[0-9]/;

  A = [[], [2, 3, -5], [-5, 3, -5], [-5, 3, 4], [-5, 5, -5], [-5, 5, -5]];
  i = j;
  statei = 1;
  statef = 5;
  state = statei;
  c = 0;
  while ((i < (valueText.length)) && (c != -1) && state != -5) {
    c = -1;
    if (valueText[i] == '-') {
      c = 0;
    }
    if (patternNumbers.test(valueText[i])) {
      c = 1;
    }
    if (valueText[i] == '.') {
      c = 2;
    }
    if (c == -1) {
      // state=-5;  
    } else {
      state = A[state][c];
      i = i + 1;
    }
  }
  if (state == statef) {
    document.getElementById("R").innerHTML =
      document.getElementById("R").innerHTML + "<br>" + "TKN_REAL (" + valueText.substr(j, i - j) + ")";
      tokens.push({tkn_id:'tkn_real', value:valueText.substr(j, i - j)})
    return i;
  }
  return j;
}
function validateCaracter(j) {
  num = document.getElementById("valueText").value;
  patternNumbers= /[0-9]/;
  patternAlpha= /[a-zA-Z]/;
  A = [[], [2, -5, -5], [-5, 3, 4], [-5, -5, 4], [5, -5, -5], [-5, -5, -5]];
  i = j;
  statei = 1;
  statef = 5;
  state = statei;
  c = 0;
  while ((i < (num.length) && (c != -1)) && state != -5) {
    c = -1;
    if (num[i] == '\'') {
      c = 0;
    }
    if (num[i] == '\\') {
      c = 1;
    }
    if (patternNumbers.test(valueText[i]) || patternAlpha.test(valueText[i]) ) {
      c = 2;
    }

    if (c == -1) {
      // state=-5;  
    } else {
      state = A[state][c];
      i = i + 1;
    }
  }
  if (state == statef) {
    document.getElementById("R").innerHTML =
      document.getElementById("R").innerHTML + "<br>" + "TKN_CARACTER (" + num.substr(j, i - j) + ")";
      tokens.push({tkn_id:'tkn_caracter', value:num.substr(j, i - j)})
    return i;
  }
  return j;
}

function validateOperator(j) {
  const valueText = document.getElementById("valueText").value;
  let i = j;

  for (const operator of operators) {
    if (valueText.startsWith(operator, i)) {
      document.getElementById("R").innerHTML +=
        "<br>TKN_OPERADOR '" + valueText.substr(i, operator.length) + "'";
        tokens.push({tkn_id:'tkn_operator', value:valueText.substr(i, operator.length)})
      i += operator.length;
      return i;
    }
  }
  return j;
}
function validateSpecialSymbol(j) {
  valueText = document.getElementById("valueText").value;
  keyword = ["\{", "\}", "\[", "\]", "\(", "\)", "\;", "\,"];
  A = [[], [2, 2, 3], [3], [3]]; 
  i = j;
  statei = 1;
  statef = 3;
  state = statei;
  c = 0;
  while (i < (valueText.length) && (c != -1)) {
    c = -1;
    if (keyword.includes(valueText[i])) {
      c = 2;
    }
    if (c == -1) {
      // state=-1;
    } else {
      state = (A[state, c]);
      i = i + 1;
    }
  }
  if (state == statef) {
    document.getElementById("R").innerHTML =
      document.getElementById("R").innerHTML + "<br>" + "TKN_SIMBOLO_ESPECIAL ' " + valueText.substr(j, i - j) +" '";
      tokens.push({tkn_id:'tkn_special_symbol', value: valueText.substr(j, i - j)})
    return i;
  }
  return j;
}
function syntaxAnalyzer(valueText, type){
  switch (type) {
    case 1:
      variableDeclaration(valueText);
      break;
    case 2:
      validateFunctions(valueText);
    case 3:
      analyzeExpression(valueText)
    default:
      break;
  }
}
/*Data para demostración
Case:1
int variable = 0; //*CORRECTO
case:2
integer variable = 0; //!ERROR
case:3
int variabl32&e = 0; //!ERROR
case:4
int variabl = **; //!ERROR No me muestra
case:5
int variable = 1
*/
function variableDeclaration(valueText){
  regex = /^\s*(var|let|const|int)\s+[a-zA-Z_]\w*\s*=\s*[a-zA-Z0-9]\w*;\s*$/;
  if (!(/^(int|var|let|const)\s+/.test(valueText))) {
    return console.error("Sintáxis Error: Tipo de variable inválido");
  }

  if (!/^\w+\s+[a-zA-Z_]\w*\s*=\s*\S/.test(valueText)) {
    return console.error("Sintáxis Error: Nombre o asignación de variable inválido");
  }

  if (!/=\s*([a-zA-Z0-9\s]*)\s*/.test(valueText)) {
    return console.error("Sintáxis Error: Valor de variable inválido");
  }
  if(!/\s*;$/.test(valueText)){
    return console.error('Sintáxis Error: se esperaba ;');
  }
  return console.warn("Sintáxis correcta")
}
/**
 * Data para demostración
 * case 1:
 * if (true) { console.log('Hola, mundo!')); }} //!ERROR
 * 
 * 
 * case correcta:
 * for (let i = 0; i < 10; i++) { console.log(i); } //*CORRECTO
 * for (let i = 0; i < 10; i++ { console.log(i); } //!ERROR
 * 
 * case if:
 * if (valor != valor2){} //*CORRECTO
 * if (valo'¿sr != valor2){} //!ERROR
 * 
 */
function validateFunctions(valueText) {
  const values= valueText.split(" ");
  const regexByFunction= values[0]==='for' ? /for\s*\(\s*([^;]+)\s*;\s*([^;]+)\s*;\s*([^)]+)\)/ :/\(\s*(?:[a-zA-Z0-9]+\s*(?:[=!<>]=?\s*[a-zA-Z0-9]+)?|![a-zA-Z0-9]+)\s*\)/;
  validateBracesAndParentheses(valueText)
  if (!/^(if|while|for|switch)\s*\([^)]*\)\s*\{[^}]*\}$/.test(valueText)) {
   return console.error(" Sintáxis Error:  Tipo de estructura inválido");
  }
  if (!regexByFunction.test(valueText)) {
    return console.error("Sintáxis Error: Expresión entre paréntesis inválida");
  }
  if (!/\{[^}]*\}/.test(valueText)) {
    return console.error("Sintáxis Error: Bloque de código inválido");
  }
    return console.warn("Sintáxis correcta")
}

function validateBracesAndParentheses(valueText) {
  const stack = []
  for (const caracter of valueText) {
    if (/[([{]/.test(caracter)) {
      stack.push(caracter);
    } else if (/[)\]}]/.test(caracter)) {
      const lastOpen = stack.pop();
      if (
        (lastOpen === '(' && caracter !== ')') ||
        (lastOpen === '{' && caracter !== '}') ||
        (lastOpen === '[' && caracter !== ']')
      ) {
        return console.error("Sintáxis Error: Paréntesis o llaves no balanceados.");
      }
    }
  }
  if (stack.length > 0) {
    return console.error("Sintáxis Error: Paréntesis o llaves no balanceados.");
  }
}

/**
 * Data demostración
 * 
 * 1 / 1.1 //*CORRECTO  (+,-,*,/)
 * 1 / valor //!INCORRECTO
 * 
 */
function analyzeExpression(valueText) {
  if(!/\s*\d+(\.\d+)?\s*[\+\-\*\/]\s*\d+(\.\d+)?\s*/.test(valueText)){
    return console.error("Sintáxis Error: solo se permiten operaciones con numeros enteros o reales")
  }
  return console.warn("Sintáxis correcta");
}