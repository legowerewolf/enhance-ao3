function testDeps(){
    if (typeof JSZip !== "function") { 
        console.error("The download-zip lib requires JSZip. Include the following line in your userscript metadata block: \n \
        // @require https://raw.githubusercontent.com/Stuk/jszip/master/dist/jszip.min.js");
    }
}
testDeps();

function saveAs(blob, name) {
    var url = URL.createObjectURL(blob);

    var element = document.createElement('a');
    element.setAttribute("href", url);
    element.setAttribute('download', name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    URL.revokeObjectURL(url);
}

function fetchAsBlob(href) {
    return Promise.resolve(
        fetch(href).then((response) => {
            return response.blob();
        })
    );
}

function zipFromHrefArray(hrefArray, title) {
    var zip = new JSZip();

    hrefArray.forEach((element) => {
            zip.file(element.substring(element.lastIndexOf("/") + 1), fetchAsBlob(element))
        });

    zip.generateAsync({type: "blob"}).then((content) => {saveAs(content, title)});
}

