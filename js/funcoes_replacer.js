function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
};

function clearVars() {
  $('#sqlVariables option').remove('');
}

function remove_first_and_last(str) {
  return str.substr(1, str.length - 2)
}

function replaceVars() {
  var jsInput = $('#JSONInput').val();
  var sqlInput = $('#sqlInput').val();
  var sqlOutput = '';
  jsInput = replaceAll(jsInput, '\\n', '');
  jsInput = replaceAll(jsInput, '\\"', '"');
  jsInput = replaceAll(jsInput, '\n', ' ');
  jsInput = replaceAll(jsInput, '","', '",\n"');
  if (jsInput.startsWith('"\{') && jsInput.endsWith('\}"')) {
    jsInput = remove_first_and_last(jsInput);
  }
  $('#JSONInput').val(jsInput);
  try {
    jsInput = JSON.parse(jsInput);
  } catch (err) {
    alert('Your JSON is invalid! Check its value at : ' + err.message);
  }
  var outputIsEmpty = 0;
  for (key in jsInput) {
    if (jsInput[key] == "") {
      jsInput[key] = "''";
    }
    var value;
    value = isNaN(jsInput[key]) ? jsInput[key] == "''" ? jsInput[key] : "'" + jsInput[key] + "'" : jsInput[key];
    if (value.startsWith("',")) {
      value = replaceAll(value, "'", '')
      value = '0' + replaceAll(value, ',', '.');
    }
    if (key.startsWith('dt_')) {
      value = "to_date(" + value + ", 'dd/mm/yyyy hh24:mi:ss')";
    }
    if (!outputIsEmpty) {
      sqlOutput = replaceAll(sqlInput, key, value);
      outputIsEmpty++;
    } else {
      sqlOutput = replaceAll(sqlOutput, key, value);
    }
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