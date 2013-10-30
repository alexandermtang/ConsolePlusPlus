var tabId = chrome.devtools.inspectedWindow.tabId;
var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.session.setMode("ace/mode/javascript");
editor.getSession().setUseWorker(false);
editor.setShowPrintMargin(false);
editor.setDisplayIndentGuides(true);
editor.session.setUseSoftTabs(true);

var results = ace.edit("results");
results.session.setMode("ace/mode/asciidoc");
results.setReadOnly(true);
results.getSession().setUseWorker(false);
results.setShowPrintMargin(false);
results.renderer.setShowGutter(false);
results.setHighlightActiveLine(false);

var num_new_messages = 0;

function execute() {
  chrome.devtools.inspectedWindow.eval(
    editor.session.getValue(),
    function(result, isException) {
      if (!isException) {
        chrome.experimental.devtools.console.getMessages(print_new_messages);
      }
    });
}

// TODO how but how do you get anything that gets printed to console?
function print_new_messages(messages) {
  var str, len = messages.length;
  for (var i = num_new_messages; i > 0; i--) {
    var m = messages[len - i];
    str += m.line-1 + ": " + m.text + "\n";
  }
  results.session.setValue(str);
  num_new_messages = 0;
}

chrome.experimental.devtools.console.onMessageAdded.addListener(function(m) {
  num_new_messages++;
});

var executeOptions = {
  name: "execute",
  exec: execute,
  bindKey: "Ctrl-Return|Command-Return"
};

editor.on("change", function(err) {
  localStorage.setItem("state" + tabId, editor.session.getValue());
});

editor.commands.addCommand(executeOptions);
editor.session.setValue(localStorage.getItem("state" + tabId));
