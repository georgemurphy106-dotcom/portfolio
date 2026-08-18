// Minimal JS for navigation transitions and simple gallery handling
document.addEventListener('DOMContentLoaded', ()=>{
  // Landing-page exit transition. Links remain functional without JavaScript.
  document.querySelectorAll('[data-nav]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      const href = el.getAttribute('href');
      const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
      if(!href || isModifiedClick || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      e.preventDefault();
      el.classList.add('is-selected');
      document.body.classList.add('is-leaving');
      setTimeout(()=> window.location.href = href, 380);
    })
  })

  // Lightbox for gallery images (used on collage page)
  const lb = document.getElementById('lightbox');
  if(lb){
    document.querySelectorAll('.js-open').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const src = btn.dataset.src;
        const img = lb.querySelector('img');
        img.src = src; lb.classList.add('open');
        lb.setAttribute('aria-hidden','false');
      })
    })
    lb.addEventListener('click', (e)=>{
      if(e.target === lb || e.target.classList.contains('lightbox-close')){
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden','true');
      }
    })
    // close on ESC
    document.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Escape' && lb.classList.contains('open')){
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden','true');
      }
    })
  }

  // Reveal-on-scroll using IntersectionObserver
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const revealTargets = document.querySelectorAll('.case-study, .piece, .project');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('reveal','in');
          // add stagger classes to children for subtle delay
          const children = entry.target.querySelectorAll('.case-content > *');
          children.forEach((c,i)=> c.classList.add('stagger-'+(i+1)));
          io.unobserve(entry.target);
        }
      })
    },{threshold:0.12});
    revealTargets.forEach(t=> io.observe(t));
  } else {
    // reduced motion: ensure content visible
    document.querySelectorAll('.case-study, .piece, .project').forEach(el=> el.classList.add('in'))
  }
})
