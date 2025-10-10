// Small IntersectionObserver that toggles `.in-view` on elements with `.animate-in`.
(function(){
  const opts = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 };
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay')||'0',10);
        setTimeout(()=> el.classList.add('in-view'), delay);
        // if you want the animation only once
        io.unobserve(el);
      }
    });
  }, opts);

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.animate-in').forEach(el=> io.observe(el));
  });
})();
