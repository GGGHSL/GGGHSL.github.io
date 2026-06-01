/* cosmos-lang.js — bilingual toggle (CN / EN).
   Wires up any [data-set-lang="en|zh"] button on the page; persists the
   user's choice in localStorage under key 'cosmos_lang'.
   The initial language is set by an inline <script> in <head> so the
   correct language is visible on first paint (no flash). */
(function () {
    var KEY = 'cosmos_lang';

    function apply(l) {
        var h = document.documentElement;
        h.classList.remove('lang-en', 'lang-zh');
        h.classList.add('lang-' + l);
        h.lang = (l === 'zh') ? 'zh-CN' : 'en';

        var btns = document.querySelectorAll('[data-set-lang]');
        for (var i = 0; i < btns.length; i++) {
            var match = btns[i].getAttribute('data-set-lang') === l;
            btns[i].classList.toggle('active', match);
            btns[i].setAttribute('aria-pressed', match ? 'true' : 'false');
        }

        // notify scripts that own JS-generated text (transmitter status, etc.)
        try {
            document.dispatchEvent(new CustomEvent('cosmoslangchange', { detail: { lang: l } }));
        } catch (e) {}
    }

    // read the current language from html class (set by inline head script)
    var current = document.documentElement.classList.contains('lang-zh') ? 'zh' : 'en';
    apply(current);

    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-set-lang]');
        if (!t) return;
        var l = t.getAttribute('data-set-lang');
        try { localStorage.setItem(KEY, l); } catch (err) {}
        apply(l);
    });
})();
