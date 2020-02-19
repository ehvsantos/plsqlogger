function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
};

function clearVars() {
  $('#sqlVariables option').remove('');
}

function prepareMassReplace(str) {
  try {
    JSON.parse(str);
    if (str.startsWith('{')) {
      str = '['+str;
    }
    if (str.endsWith('}')) {
      str = str+']';
    }
    return str;
  } catch (error) {
    if (str.startsWith('"\{')) {
      str = str.substr(1, str.length - 1);
    }
    if (str.endsWith('\}"')) {
      str = str.substr(0, str.length - 2);
    }
    str = str;
    str_ = str.split('');
    outstr = '';
    openBracket = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] == '{') {
        openBracket = true;
      }
      if (str[i] == '}') {
        openBracket = false;
        outstr += str[i];
        outstr += ',\n';
        continue;
      }
      if (openBracket) {
        outstr += str[i];
      }
    }
    outstr = '[' + outstr + '}]';
    return outstr;
  }
}

function replaceVars() {
  var jsInput = $('#JSONInput').val();
  var sqlInput = $('#sqlInput').val();
  var sqlOutput = '';
  jsInput = replaceAll(jsInput, '\\n', '');
  jsInput = replaceAll(jsInput, '\\"', '"');
  jsInput = replaceAll(jsInput, '\n', ' ');
  jsInput = replaceAll(jsInput, '","', '",\n"');
  jsInput = prepareMassReplace(jsInput);
  $('#JSONInput').val(jsInput);
  try {
    jsInput = JSON.parse(jsInput);
  } catch (err) {
    alert('Your JSON is invalid! Check its value at : ' + err.message);
  }
  for (logIndex in jsInput) {
    logJSON = jsInput[logIndex];
    logOutputN = '';
    var outputIsEmpty = 0;
    for (key in logJSON) {
      if (logJSON[key] == "") {
        logJSON[key] = "''";
      }
      var value;
      value = isNaN(logJSON[key]) ? logJSON[key] == "''" ? logJSON[key] : "'" + logJSON[key] + "'" : logJSON[key];
      if (value.startsWith("',")) {
        value = replaceAll(value, "'", '')
        value = '0' + replaceAll(value, ',', '.');
      }
      if (key.startsWith('dt_') || key.startsWith('sysdate')) {
        value = "to_date(" + value + ", 'dd/mm/yyyy hh24:mi:ss')";
      }
      if (!outputIsEmpty) {
        logOutputN = replaceAll(sqlInput, key, value);
        outputIsEmpty++;
      } else {
        logOutputN = replaceAll(logOutputN, key, value);
      }
    }
    var strgfy = replaceAll(JSON.stringify(logJSON), '","', '",\n"');
    logOutputN = '/*####### __LOG__:' + logIndex + '\n\n' + strgfy + '\n\n*/\n\n' + logOutputN;
    sqlOutput += logOutputN + (jsInput.length-1 == logIndex? '':'\n\n\n\n\n\n');
  }
  $('#sqlOutput').val(sqlOutput);
}

function setCookie(str) {
  document.cookie = '';
  document.cookie = str;
}

function getCookie() {
  return document.cookie
}

/*
var urlGetInput = getCookie();
urlGetInput = urlGetInput.split('=');
urlGetInput.shift();
urlGetInput = urlGetInput.join('=');
if (urlGetInput) {
  $('#sqlInput').val(decodeURI(urlGetInput));
}*/