var tabId = chrome.devtools.inspectedWindow.tabId;
var editor = ace.edit("editor");

editor.setTheme("ace/theme/textmate");
editor.session.setMode("ace/mode/javascript");
editor.getSession().setUseWorker(false);
editor.setShowPrintMargin(false);
editor.setDisplayIndentGuides(true);
editor.session.setUseSoftTabs(true);

function execute() {
  chrome.devtools.inspectedWindow.eval(
    editor.session.getValue(),
    function(result, isException) {
    });
}

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
