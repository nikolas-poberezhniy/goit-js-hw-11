import { refs } from './refs';

export const observerOptions = {
  root: null,
  rootMargin: `${1}px`,
  threshold: 1,
};

export let observer = new IntersectionObserver(e => {
  e.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(refs.gallery.lastElementChild);

      renderReceivedData();
      gallery.refresh();
      if (NewApiService.hitsLeft() >= NewApiService.per_page) {
        // Notify.info(`There are ${NewApiService.hitsLeft()} hits left`);
      }
    }
  });
}, observerOptions);
