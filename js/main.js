// Minimal JS for navigation transitions and simple gallery handling
document.addEventListener('DOMContentLoaded', ()=>{
  // simple page transition: fade out then navigate
  document.querySelectorAll('[data-nav]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      const href = el.getAttribute('data-href');
      if(!href) return;
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){
        window.location = href; return;
      }
      document.documentElement.style.transition = 'opacity .28s ease';
      document.documentElement.style.opacity = '0';
      setTimeout(()=> window.location = href, 260);
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

  // reveal animations
  requestAnimationFrame(()=>document.documentElement.style.opacity='1')
})
