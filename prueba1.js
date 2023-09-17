
tokens =[];
function analizadorlexico() {
  tokens=[]
  document.getElementById("R").innerHTML = "";
  valueText = document.getElementById("valueText").value; 
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
      document.getElementById("R").innerHTML = 
      document.getElementById("R").innerHTML + "<br>" + "TKN_NO_IDENTIFICADO (" + valueText[u] + ")";
      u++;
    }
  }
  if(/^[a-zA-Z0-9\s]*=?[a-zA-Z0-9\s]*[;\s]*$/.test(valueText)){
    analizadorSintactico(1);
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
  const operators = ["+", "-", "*", "/",  "==","=", "!=", "&&", "||"];
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
function analizadorSintactico(valueText, type){
  switch (type) {
    case 1:
      variableDeclaration(valueText);
      break;
  
    default:
      break;
  }
}
function variableDeclaration(valueText){
  regex = /^\s*(var|let|const|int)\s+[a-zA-Z_]\w*\s*=\s*[a-zA-Z0-9]\w*;\s*$/;
  if (!(/^\s*(var|let|const|int)/.test(valueText))) {
    console.error("Sintáxis Error: Tipo de variable inválido");
    return;
  }

  if (!/^\w+\s+[a-zA-Z_]\w*\s*=\s*\S/.test(valueText)) {
    console.error("Sintáxis Error: Nombre o asignación de variable inválido, se espera =");
    return;
  }

  if (!/=\s*([a-zA-Z0-9]\w*)/.test(valueText)) {
    console.error("Sintáxis Error: Valor de variable inválido");
    return;
  }
  if(!/.*;$/.test(valueText)){
    console.error('Sintáxis Error: se esperaba ;');
    return
  }
}
