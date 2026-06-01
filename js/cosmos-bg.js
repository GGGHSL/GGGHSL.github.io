/* cosmos-bg.js — generates the twinkling starfield.
   expects a container with id="starfield" already in the DOM. */
(function () {
    var field = document.getElementById('starfield');
    if (!field) return;

    var n = window.innerWidth < 600 ? 60 : 110;
    for (var i = 0; i < n; i++) {
        var s = document.createElement('span');
        var r = Math.random();
        s.className = 'star ' + (r < 0.65 ? 's' : r < 0.92 ? 'm' : 'l');
        s.style.left = (Math.random() * 100) + '%';
        s.style.top = (Math.random() * 100) + '%';
        s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
        s.style.animationDuration = (2 + Math.random() * 5).toFixed(2) + 's';
        field.appendChild(s);
    }
})();
