//Clear cell svg
function clearCell() {
    var svg = document.getElementById("cell");
    if (svg.childNodes[0])
        svg.removeChild(svg.childNodes[0]);
}