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

  // Unlock audio on the visitor's first interaction, then let each homepage
  // or header letter ring with its own warm steel-drum note on hover.
  const toneLetters = Array.from(document.querySelectorAll('.landing-page .name .letter, .site-header .brand .color-letter'));
  if(toneLetters.length){
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const notes = [130.81,146.83,164.81,196,220,174.61,196,220,261.63,293.66,246.94,196];
    let audioContext;
    let ambienceStarted = false;
    let ambienceAudio;

    const unlockAudio = ()=>{
      if(!AudioContext) return Promise.resolve();
      audioContext ||= new AudioContext();
      return audioContext.state === 'suspended' ? audioContext.resume() : Promise.resolve();
    };

    const startAmbience = ()=>{
      if(!audioContext || ambienceStarted) return;
      ambienceStarted = true;

      const script = document.querySelector('script[src*="js/main.js"]');
      const audioRoot = new URL('../assets/audio/',script.src);
      let filename = 'eggs.mp3';
      if(document.body.classList.contains('professional-page') || location.pathname.includes('/professional/')) filename = 'city-sound.mp3';
      else if(document.body.classList.contains('collage-page')) filename = 'forest-sound.mp3';
      else if(document.body.classList.contains('about-page')) filename = 'dinner-ambiance.mp3';

      ambienceAudio = new Audio(new URL(filename,audioRoot).href);
      ambienceAudio.loop = true;
      ambienceAudio.volume = .18;
      ambienceAudio.play().catch(()=>{ ambienceStarted = false; });
    };

    const playChime = index=>{
      if(!audioContext || audioContext.state !== 'running') return;
      const now = audioContext.currentTime;
      const master = audioContext.createGain();
      const fundamentalGain = audioContext.createGain();
      const overtoneGain = audioContext.createGain();
      const warmth = audioContext.createBiquadFilter();
      const fundamental = audioContext.createOscillator();
      const overtone = audioContext.createOscillator();

      fundamental.type = 'triangle';
      fundamental.frequency.setValueAtTime(notes[index % notes.length], now);
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(notes[index % notes.length] * 2.02, now);
      fundamental.frequency.exponentialRampToValueAtTime(notes[index % notes.length] * .992, now + .22);
      warmth.type = 'lowpass';
      warmth.frequency.setValueAtTime(1050, now);
      warmth.Q.setValueAtTime(.7, now);
      fundamentalGain.gain.setValueAtTime(1, now);
      overtoneGain.gain.setValueAtTime(.16, now);
      master.gain.setValueAtTime(.0001, now);
      master.gain.exponentialRampToValueAtTime(.07, now + .028);
      master.gain.exponentialRampToValueAtTime(.022, now + .38);
      master.gain.exponentialRampToValueAtTime(.0001, now + 1.65);

      fundamental.connect(fundamentalGain).connect(warmth);
      overtone.connect(overtoneGain).connect(warmth);
      warmth.connect(master).connect(audioContext.destination);
      fundamental.start(now);
      overtone.start(now);
      fundamental.stop(now + 1.7);
      overtone.stop(now + 1.7);
    };

    document.addEventListener('pointerdown', event=>{
      const letter = event.target.closest('.landing-page .name .letter, .site-header .brand .color-letter');
      unlockAudio().then(()=>{
        startAmbience();
        if(letter) playChime(toneLetters.indexOf(letter));
      });
    },{capture:true,once:true});

    toneLetters.forEach((letter,index)=>{
      letter.addEventListener('mouseenter',()=> playChime(index));
    });
  }

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
