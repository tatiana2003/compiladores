
tokens =[];
operators = ["+", "-", "*", "/",  "==","=", "!=", "&&", "||"];

function analizadorlexico() {
  tokens=[]
  document.getElementById("R").innerHTML = "";
  valueText = document.getElementById("valueText").value; 
  primerCaracter = valueText.charAt(0);
  document.getElementById("result").innerHTML = '';
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
  semanticAnalyzer(tokens);
  if(/^\s*\w*\s*\([^)]*\)\s*\{?\s*[^}]*\}?\s*/g.test(valueText)){
    syntaxAnalyzer(valueText,2)
    return;
  }
  if(/^\s*([^=]+)\s*=\s*([^=]+)\s*$/.test(valueText) && valueText){
    syntaxAnalyzer(valueText,1);
    return;
  }
  if (operators.includes(primerCaracter)){
     console.error(`Sintáxis Error: La expresión comienza con un operador no válido '${primerCaracter}'.`);
     return;
  }
  if(/^\s*[a-zA-Z0-9\s]*\s*[/*+-]\s*[a-zA-Z0-9\s]*\s*$/.test(valueText)){
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
      break;
    case 3:
      analyzeExpression(valueText)
      break;
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
int variabl = **; //!ERROR //Analizador
case:5
int variable = 1
*/

/**
 * 
 * int variable = ola; //!ERROR
 * int variable = 1;  //*CORRECTO
 * 
 * let variable = ola; //*CORRECTO
 * let variable = 1; //!ERROR
 * 
 */
function variableDeclaration(valueText){
  let regexValue = '';
  let variableType;
  if (!(/^(int|var|let|const)\s+/.test(valueText))) {
    setError('Sintáxis Error: Tipo de variable inválido'); 
    return console.error("Sintáxis Error: Tipo de variable inválido");
  }

  if((/^(int|var|let|const)\s+/.test(valueText))){
    let match = valueText.match(/^(int|var|let|const)\s+/);
     variableType = match[1];
    if(variableType === 'int'){
      regexValue = /=\s*([0-9_]+)\s*;*$/
    }else{
      regexValue = /=\s*([a-zA-Z]+)\s*;*$/;
    }
  }
  if (!/^\w+\s+[a-zA-Z_]\w*\s*=\s*\S/.test(valueText)) {
    setError('Sintáxis Error: Nombre o asignación de variable inválido'); 
    return console.error("Sintáxis Error: Nombre o asignación de variable inválido");
  }

  if (!regexValue.test(valueText)) {
    setError(`Error: Valor de variable inválido para el tipo: ${variableType}`); 
    return console.error(`Error: Valor de variable inválido para el tipo: ${variableType}`);
  }
  if(!/\s*;$/.test(valueText)){
    setError('Sintáxis Error: se esperaba ;'); 
    return console.error('Sintáxis Error: se esperaba ;');
  }
  setSuccess("Sintáxis correcta");
  document.getElementById("result").innerHTML = `Resultado : ${valueText}`;
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
 * if (valor != ?){} // ERRROR //?Analizador semántico
 * 
 */
function validateFunctions(valueText) {
  const values= valueText.split(" ");
  const regexByFunction= values[0]==='for' ? /for\s*\(\s*([^;]+)\s*;\s*([^;]+)\s*;\s*([^)]+)\)/ :/\(\s*(?:[a-zA-Z0-9]+\s*(?:[=!<>]=?\s*[a-zA-Z0-9]+)?|![a-zA-Z0-9]+)\s*\)/;
  validateBracesAndParentheses(valueText)
  if (!/^(if|while|for|switch)\s*\([^)]*\)\s*\{[^}]*\}$/.test(valueText)) {
   setError('Sintáxis Error:  Tipo de estructura inválido'); 
   return console.error(" Sintáxis Error:  Tipo de estructura inválido");
  }
  if (!regexByFunction.test(valueText)) {
    setError('Expresión entre paréntesis inválida'); //?Analizador semántico
    return console.error("Sintáxis Error: Expresión entre paréntesis inválida");
  }
  if (!/\{[^}]*\}/.test(valueText)) {
    setError('Sintáxis Error: Bloque de código inválido'); 
    return console.error("Sintáxis Error: Bloque de código inválido");
  }
  document.getElementById("contentError").style.background = "green"
  setSuccess("Sintáxis correcta");
  return console.warn("Sintáxis correcta");
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
        setError('Sintáxis Error: Paréntesis o llaves no balanceados.'); 
        return console.error("Sintáxis Error: Paréntesis o llaves no balanceados.");
      }
    }
  }
  if (stack.length > 0) {
    setError('Sintáxis Error: Paréntesis o llaves no balanceados.'); 
    return console.error("Sintáxis Error: Paréntesis o llaves no balanceados.");
  }
}

/**
 * Data demostración
 * 
 * 1 + 1.1 //*CORRECTO  (+,-,*,/)
 * 1 + valor //!INCORRECTO
 * 
 */
function analyzeExpression(valueText) {
  try {
    if (!/\s*\d+(\.\d+)?\s*[\+\-\*\/]\s*\d+(\.\d+)?\s*/.test(valueText)) {
      setError('Sintáxis Error: solo se permiten operaciones con números enteros o reales.');
      document.getElementById("result").innerHTML = ''; // Limpia el resultado si hay un error
      console.error('Sintáxis Error: solo se permiten operaciones con números enteros o reales');
    } else {
      const result = eval(valueText); // Evalúa la expresión
      if (isNaN(result)) {
        setError('Error semántico: La expresión no es válida');
        document.getElementById("result").innerHTML = ''; // Limpia el resultado si hay un error semántico
        console.error('Error semántico: La expresión no es válida');
      } else {
        setSuccess('Sintáxis correcta');
        // No mostramos el resultado aquí
        console.warn('Sintáxis correcta');
        document.getElementById("result").innerHTML = `Resultado: ${result}`;
      }
    }
  } catch (error) {
    setError('Error semántico: La expresión no es válida');
    document.getElementById("result").innerHTML = ''; // Limpia el resultado si hay un error
    console.error('Error semántico: La expresión no es válida');
  }
}

function semanticAnalyzer(tokens) {
  let variable = {};
  for (const token of tokens) {
     if (token.tkn_id === 'tkn_operator' && token.value === '=') {
      // Asignación de variable
      const variableToken = tokens.shift(); // Extraer el token de la variable
      const operadorToken = tokens.shift(); // Extraer el token del operador '='
      const valorToken = tokens.shift(); // Extraer el token del valor asignado
      if (variableToken && variableToken.tkn_id === 'tkn_id' && operadorToken && operadorToken.tkn_id === 'tkn_operator' && operadorToken.value === '=' && valorToken) {
        if (valorToken.tkn_id === 'tkn_integer' || valorToken.tkn_id === 'tkn_real') {
          variable[variableToken.value] = valorToken.value;
        } else if (valorToken.tkn_id === 'tkn_id' && valorToken.value in variable) {
          variable[variableToken.value] = variables[valorToken.value];
        } else {
          console.error('Error semántico: Valor de asignación no válido.');
          return;
        }
      } 
    }
  }
  
  verifyDeclaredVariable(variable);
}
/**
 * 
 *  m = 5; y = x - 5;  //!ERROR
 * x = 5; y = x - 5; //*CORRECTO
 */
function verifyDeclaredVariable(variable) {
  codigo = document.getElementById("valueText").value; 
  const lineas = codigo.split(';');
  if(lineas.length >= 2){
    const secondPart = lineas[1]?.split('=');
    const letrasEncontradas = secondPart[1]?.match(/[a-zA-Z]+/g);
    letrasEncontradas?.forEach(letra => {
      if (!variable.hasOwnProperty(letra)) {
        setError("La variable " + letra + " no ha sido declarada");
        console.error("La variable " + letra + " no ha sido declarada");
      }else{
        const operation = secondPart[1].split(' '); 
        const valueVariable = variable[letra];
        const secondValue = parseInt(operation[3]);
        switch (operation[2]) {
          case '+':
            setSuccess('Sintáxis correcta');
            document.getElementById("result").innerHTML = ` Resultado: ${valueVariable + secondValue}`;            
            break;
            case '-':
              setSuccess('Sintáxis correcta');
            document.getElementById("result").innerHTML = ` Resultado: ${valueVariable - secondValue}`;
            break
          case '*':
            setSuccess('Sintáxis correcta');
            document.getElementById("result").innerHTML = ` Resultado: ${valueVariable * secondValue}`;
            break;
          case '/':
            setSuccess('Sintáxis correcta');
            document.getElementById("result").innerHTML = ` Resultado: ${valueVariable / secondValue}`;
            break
          default:
            console.error("Operador no válido")
            break;
        }
      }
    });
  }
 }
function validateTypeVariable() {

 }
function setError(message){
  document.getElementById("contentError").style.display = "none";
  setTimeout(() => { 
    document.getElementById("contentError").style.display = "block"
    document.getElementById("error").innerHTML = message;
    document.getElementById("contentError").style.color = "#ffa09b"
    document.getElementById("contentError").style.background = "rgba(255, 0, 0, 0.383)"
    document.getElementById("icon").className= "fa fa-times-circle"
    document.getElementById("error").style.color = "#f9c4c1";
  }, 100);
}
function setSuccess(message){
  document.getElementById("contentError").style.display = "none";
  setTimeout(() => {   
    document.getElementById("contentError").style.display = "block"
    document.getElementById("contentError").style.color = "#beffe1"
    document.getElementById("contentError").style.background = "#13481399"
    document.getElementById("icon").className= "fa fa-check-circle"
    document.getElementById("error").innerHTML = message;
    document.getElementById("error").style.color = "#beffe1";
  }, 100);
}
