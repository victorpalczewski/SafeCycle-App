function fadeIn() {
    if (!window.AnimationEvent) { return; }
    var fader = document.getElementById('fader');
    fader.classList.add('fade-out');
}
function fadeOut() {
    if (!window.AnimationEvent) { return; }
    var fader = document.getElementById('fader');
    fader.classList.add('fade-in');
    window.location = "app.html";
}

fadeIn();
window.setTimeout(fadeOut, 4000);
