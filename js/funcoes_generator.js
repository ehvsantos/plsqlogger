function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
};

function clearVars() {
  $('#sqlVariables option').remove('');
}

function removeComments(str) {
  ;
  s = '';
  codeComment = null
  for (let i = 0; i <= str.length; i++) {
    if (i + 1 < str.length) {
      if (str[i] + str[i + 1] === '/*') {
        codeComment = '/*';
      } else if (str[i] + str[i + 1] === '--') {
        codeComment = '--';
      } else if (codeComment == '/*' && str[i - 1] + str[i] == '*/') {
        codeComment = null;
      } else if (codeComment == '--' && str[i - 1] == '\n') {
        codeComment = null;
      }
      if (!codeComment) {
        s += str[i];
      }
    }
  }
  s += str[str.length - 1];
  return s;
}

function scan(str, filterSide, search) {
  str = replaceAll(str, '(', '( ');
  str = replaceAll(str, ')', ' ) ');
  str = replaceAll(str, ',', ' ');
  str = replaceAll(str, ';', ' ');
  str = replaceAll(str, '\t', ' ');
  str = removeComments(str);
  str = replaceAll(str, '\n', ' ');
  var words = str.split(' ');
  var sqlVars = [];
  if (search) {
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 0) {
        if (filterSide == 'starts') {
          if (words[i].toLowerCase().startsWith(search.toLowerCase())
            && words[i].indexOf('(') < 0
            && words[i].indexOf(')') < 0
            && !sqlVars.includes(words[i])) {
            sqlVars.push(words[i])
          }
        } else {
          if (words[i].toLowerCase().endsWith(search.toLowerCase())
            && words[i].indexOf('(') < 0
            && words[i].indexOf(')') < 0
            && !sqlVars.includes(words[i])) {
            sqlVars.push(words[i])
          }
        }
      }
    }
  }
  for (let i = 0; i < sqlVars.length; i++) {
    if (!sqlVars[i].startsWith('.') && sqlVars[i].length > 3) {
      $('#sqlVariables').append('<option value=\'' + sqlVars[i] + '\'>' + sqlVars[i] + '</option>');
    }
  }
}

function generate() {
  var variables = [];
  $.each($('#sqlVariables option:selected'), function () {
    variables.push($(this).val());
  });
  var logString = '\'{\'||chr(10)||\n';
  variables.sort()
  for (let i = 0; i < variables.length; i++) {
    var variable = ''
    if (variables[i].startsWith('dt_')) {
      variable = "to_char(" + variables[i] + ", 'dd/mm/yyyy hh24:mi:ss')";
    } else {
      variable = variables[i];
    }
    logString += '\'"' + variables[i] + '" : "\'||' + variable + '';
    if (i != variables.length - 1) {
      logString += '||\'",\'||chr(10)||\n';
    }
  }
  logString += '||\'"}\'';
  $('#log_string').val('');
  $('#log_string').val(logString);
}

function btnScan() {
  var str = $('#sqlInput').val();
  var filterSide = $('#filterSide:checked').val();
  var search = $('#searchFor').val();
  if (!search) {
    filterSide = 'ends'
    search = '_';
    let str_aux = '';
    for (let i = 0; i < 20; i++) {
      str_aux += 'p'
      scan(str, filterSide, search + str_aux);
    }
    str_aux = '';
    for (let i = 0; i < 20; i++) {
      str_aux += 'w'
      scan(str, filterSide, search + str_aux);
    }
    filterSide = 'starts'
    search = 'get';
    scan(str, filterSide, search);
    filterSide = 'starts'
    search = ':';
    scan(str, filterSide, search);
  } else {
    scan(str, filterSide, search);
  }
}

function setCookie(str) {
  document.cookie = '';
  document.cookie = str;
}

function getCookie() {
  return document.cookie
}

function checkAllVars() {
  $('#sqlVariables').find('option').attr("selected", "true");
}

/*
var urlGetInput = getCookie();
urlGetInput = urlGetInput.split('=');
urlGetInput.shift();
urlGetInput = urlGetInput.join('=');
if (urlGetInput) {
  $('#sqlInput').val(decodeURI(urlGetInput));
}*/

$('#searchFor').keyup(function (e) {
  var code = e.which;
  if (code == 13) e.preventDefault();
  if (code == 32 || code == 13 || code == 188 || code == 186) {
    btnScan();
  }
  checkAllVars();
  generate();
});
/*
$('#sqlInput').keydown(function(e){
  var code = e.which;
  if(code==13)e.preventDefault();
  if(code==32||code==13||code==188||code==186){
    btnScan();
  }
  checkAllVars();
  generate();
});*/