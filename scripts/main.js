import Battlefield from './battlefield.js';

(function (win, doc) {
  const onResize = () => {
      doc.documentElement.style.setProperty('--vw', `${win.innerWidth / 100}px`);
      doc.documentElement.style.setProperty('--vh', `${win.innerHeight / 100}px`);
  };

  const attachListeners = () => {
    addEventListener('resize', onResize);
  };

  const initFns = () => {
    onResize();
    attachListeners();

    new Battlefield(doc.querySelector('.game'), {
        squads: 4,
        soldiers: 6,
    });
  };

doc.readyState === 'complete'
  ? initFns()
  : doc.addEventListener('readystatechange', () => (doc.readyState === 'complete' && initFns()));
})(window, window.document);