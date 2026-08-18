// Minimal JS for navigation transitions and simple gallery handling
document.addEventListener('DOMContentLoaded', ()=>{
  // Give homepage tab labels and every page brand the per-letter color treatment.
  document.querySelectorAll('.nav-label, .site-header .brand').forEach(el=>{
    const text = el.textContent;
    el.replaceChildren(...Array.from(text, char=>{
      if(/\s/.test(char)) return document.createTextNode(char);
      const letter = document.createElement('span');
      letter.className = 'color-letter';
      letter.textContent = char;
      return letter;
    }));
  });

  // Fill each letter of the Collages title with artwork from the gallery on hover.
  const collageTitle = document.querySelector('.collage-page .page > h1');
  if(collageTitle){
    const images = Array.from(document.querySelectorAll('.gallery [data-src]'), item=>item.dataset.src);
    const backdrops = ['#168aad','#52b788','#f26b4a','#9b5de5','#e9a820','#ef476f'];
    if(images.length){
      const text = collageTitle.textContent;
      collageTitle.replaceChildren(...Array.from(text, (char, index)=>{
        if(/\s/.test(char)) return document.createTextNode(char);
        const letter = document.createElement('span');
        letter.className = 'image-letter';
        letter.textContent = char;
        letter.style.backgroundImage = `url("${images[index % images.length]}")`;
        letter.style.setProperty('--letter-backdrop', backdrops[index % backdrops.length]);
        return letter;
      }));
    }
  }

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
