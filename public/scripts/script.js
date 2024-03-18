window.addEventListener('load', () => {
  const ham = document.querySelector('.header__icon');
  const nav = document.querySelector('.header__nav');

  ham.addEventListener('click', () => {
      nav.classList.toggle('header__nav--visible');
  });
});