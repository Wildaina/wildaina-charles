(() => {
  const section = document.getElementById('koneksyonAmbassador');
  if (!section) return;

  const copy = {
    en: {
      tag: 'KONEKSYON AMBASSADOR',
      title: 'Where culture meets connection.',
      body: 'As a Koneksyon ambassador, Wildaïna represents a Caribbean-inspired social platform built for friendship, community, creators, entrepreneurs, events, opportunities, culture and meaningful connection. Koneksyon is open to everyone and helps people connect with more purpose, more context and more trust.',
      quote: 'Caribbean-inspired. Open to everyone.',
      cta: 'Discover Koneksyon on Instagram ↗',
      credit: 'Ambassador partnership · Koneksyon'
    },
    fr: {
      tag: 'AMBASSADRICE KONEKSYON',
      title: 'Là où la culture rencontre la connexion.',
      body: 'En tant qu’ambassadrice de Koneksyon, Wildaïna représente une plateforme sociale inspirée des Caraïbes, conçue pour l’amitié, la communauté, les créateurs, les entrepreneurs, les événements, les opportunités, la culture et les connexions qui ont du sens. Koneksyon est ouverte à tous et favorise des liens avec plus d’intention, de contexte et de confiance.',
      quote: 'Inspirée des Caraïbes. Ouverte à tous.',
      cta: 'Découvrir Koneksyon sur Instagram ↗',
      credit: 'Partenariat ambassadrice · Koneksyon'
    },
    ht: {
      tag: 'ANBASADRÈS KONEKSYON',
      title: 'Kote kilti rankontre koneksyon.',
      body: 'Kòm anbasadrès Koneksyon, Wildaïna reprezante yon platfòm sosyal ki enspire pa Karayib la pou amitye, kominote, kreyatè, antreprenè, evènman, opòtinite, kilti ak koneksyon ki gen sans. Koneksyon ouvè pou tout moun epi li ede moun konekte ak plis objektif, plis kontèks ak plis konfyans.',
      quote: 'Enspire pa Karayib la. Ouvè pou tout moun.',
      cta: 'Dekouvri Koneksyon sou Instagram ↗',
      credit: 'Patenarya anbasadrès · Koneksyon'
    }
  };

  const fields = {
    tag: section.querySelector('[data-kx="tag"]'),
    title: section.querySelector('[data-kx="title"]'),
    body: section.querySelector('[data-kx="body"]'),
    quote: section.querySelector('[data-kx="quote"]'),
    cta: section.querySelector('[data-kx="cta"]'),
    credit: section.querySelector('[data-kx="credit"]')
  };

  function render(lang) {
    const c = copy[lang] || copy.en;
    Object.keys(fields).forEach(key => {
      if (fields[key]) fields[key].textContent = c[key];
    });
  }

  const language = document.getElementById('language');
  const initial = (language && language.value) || localStorage.getItem('wildaina_lang') || 'en';
  render(initial);
  if (language) language.addEventListener('change', e => render(e.target.value));
})();
