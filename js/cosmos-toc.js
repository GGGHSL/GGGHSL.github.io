/* cosmos-toc.js — floating left-side table of contents for long posts.
   Self-populating: scans the *visible* language article's headings
   (h2 / h3 + the collapsible afterword titles), rebuilds itself when the
   reader switches language, smooth-scrolls to a target (opening a collapsed
   <details> first if needed), and highlights the current section on scroll.
   No-ops gracefully if there is no #toc element or no headings. */
(function () {
    var nav = document.getElementById('toc');
    if (!nav) return;

    var spy = null;     // IntersectionObserver for scroll-spy
    var links = [];     // [{ a: <a>, target: heading }]

    function activeArticle() {
        var lang = document.documentElement.classList.contains('lang-zh') ? 'zh' : 'en';
        return { lang: lang, el: document.querySelector('.post-body[data-lang="' + lang + '"]') };
    }

    // strip the " >>> ... <<< " decoration some h3 titles use
    function label(el) {
        return el.textContent.replace(/[<>]+/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function build() {
        var ctx = activeArticle();
        if (!ctx.el) { nav.hidden = true; return; }

        var nodes = ctx.el.querySelectorAll('h2, h3, summary.postscript-title');
        if (!nodes.length) { nav.hidden = true; return; }

        if (spy) { spy.disconnect(); spy = null; }
        links = [];

        var ul = document.createElement('ul');
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var level = (node.tagName === 'H3') ? 3 : 2;
            if (!node.id) node.id = 'toc-' + ctx.lang + '-' + i;

            var li = document.createElement('li');
            li.className = 'toc-l' + level;
            var a = document.createElement('a');
            a.href = '#' + node.id;
            a.textContent = label(node);
            li.appendChild(a);
            ul.appendChild(li);
            links.push({ a: a, target: node });
        }

        nav.innerHTML = '';
        var head = document.createElement('div');
        head.className = 'toc-head';
        head.textContent = (ctx.lang === 'zh') ? '// 目录' : '// contents';
        nav.appendChild(head);
        nav.appendChild(ul);
        nav.hidden = false;

        wireClicks();
        wireSpy();
    }

    function wireClicks() {
        links.forEach(function (link) {
            link.a.addEventListener('click', function (e) {
                e.preventDefault();
                // if the target lives inside a collapsed afterword, open it first
                var d = link.target.closest('details');
                if (d && !d.open) d.open = true;
                link.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                try { history.replaceState(null, '', '#' + link.target.id); } catch (err) {}
            });
        });
    }

    function setActive(id) {
        links.forEach(function (link) {
            link.a.classList.toggle('active', link.target.id === id);
        });
    }

    function wireSpy() {
        if (!('IntersectionObserver' in window)) return;
        spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-80px 0px -75% 0px', threshold: 0 });
        links.forEach(function (link) { spy.observe(link.target); });
    }

    build();
    document.addEventListener('cosmoslangchange', build);
})();
