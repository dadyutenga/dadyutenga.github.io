
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      const target = document.querySelector(this.getAttribute('href'));
  
      target.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
 
  const sections = document.querySelectorAll('section');
  
  const isInViewport = el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
  
  const showSections = () => {
    sections.forEach(section => {
      if (isInViewport(section)) {
        section.classList.add('show');
      }
    });
  };
  
  
  window.addEventListener('load', showSections);
   window.addEventListener('scroll', showSections);
  