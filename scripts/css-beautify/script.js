let input = document.querySelector("#input");
let minifyBtn = document.querySelector("#minify");
let output = document.querySelector("#output");
let indentSize = document.querySelector("#indent");
let loadFile = document.querySelector("#loadfile");
let loadurl = document.querySelector("#loadfile");
let options = {
    indent_size: 2
}
const config = {
        styleActiveLine: !0,
        lineNumbers: !0,
        tabSize: 4,
        mode: "css"
    },
    editorInput = CodeMirror.fromTextArea(document.getElementById("input"), config),
    editorOutput = CodeMirror.fromTextArea(document.getElementById("output"), config);
let filename = "styles"

function getOptions() {
    options.indent_size = indentSize.value;
    return options;
}

function beautify(data, options) {
    return css_beautify(data, options)
}

function minify(data) {
    const Clean = new CleanCSS({});
    const output = Clean.minify(editorInput.getValue());
    return output.styles;
}

function onSaveClicked() {
    let url = "data:x-application/text," + escape(editorOutput.getValue());
    dl.href = url;
    dl.download = filename;
    dl.click();
}

function onCopyClicked() {
    navigator.clipboard.writeText(editorOutput.getValue());
}

function getFilenameFromUrl(url) {
    const pathname = new URL(url).pathname;
    const index = pathname.lastIndexOf('/');
    return pathname.substring(index + 1)
}

function onLoadFromUrlClicked() {
    let url = document.getElementById("url-input").value;
    console.log(url)
    if (url == null || url == "") {
        return;
    }
    fetch(url)
        .then((response) => response.text())
        .then((data) => editorInput.setValue(data))
        .catch((e) => alert("Couldn't send request!"));
    filename = `${getFilenameFromUrl(url).split('.').slice(0, -1).join('.')}`;
}

function onLoadFromFileClicked() {
    var reader = new FileReader();
    reader.readAsText(loadFile.files[0], "UTF-8");
    reader.onload = function (evt) {
        editorInput.setValue(evt.target.result);
    }
    reader.onerror = function (evt) {
        alert("Couldn't read the file");
    }
    filename = `${loadFile.files[0].name.split('.').slice(0, -1).join('.')}`;
}

function onBeautifyClicked() {
    const newOptions = getOptions();
    const beautified = beautify(editorInput.getValue(), newOptions);
    editorOutput.setValue(beautified);
    filename += "-beautified.css";
}

function onMinifyClicked() {
    const minified = minify(editorInput.getValue());
    editorOutput.setValue(minified);
    filename += "-minified.css";
}
