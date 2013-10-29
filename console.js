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
