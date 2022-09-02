import ApiService from './js/receivingData';
import cardTemplate from './template/imgCardTemplate.hbs';
import { Notify } from 'notiflix';
import { simpleLightboxExample } from './js/gallery';
import { refs } from './js/refs';

export let newApiService = new ApiService();

const observerOptions = {
  root: null,
  rootMargin: `1px`,
  threshold: 1,
};

let observer = new IntersectionObserver(e => {
  e.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(refs.gallery.lastElementChild);

      renderReceivedData();
      simpleLightboxExample.refresh();

      if (newApiService.hitsLeft() >= newApiService.per_page) {
        Notify.success(`There are ${newApiService.hitsLeft()} images left`);
      }
    }
  });
}, observerOptions);

refs.form.addEventListener('submit', e => formSubmit(e));

function formSubmit(e) {
  e.preventDefault();

  if (e.currentTarget.searchQuery.value === newApiService.query) {
    Notify.info(`Вы продублировали запрос ${newApiService.query}. Слава сказал, что так нельзя`);
    return;
  }

  if (e.currentTarget.searchQuery.value) {
    newApiService.resetPage();
    refs.gallery.innerHTML = '';
    newApiService.query = e.currentTarget.searchQuery.value;
    refs.form.reset();
    renderReceivedData();
    return;
  }
  Notify.failure('Введите запрос');
}

async function renderReceivedData() {
  try {
    const a = await fetchCards();

    if (!a.hits.length) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    if (currentPage === 1) {
      Notify.info(`Hooray! We found ${totalHits()} images.`);
    }
    if (document.querySelectorAll('.photo-card').length > 0) {
      scroll();
    }

    incrementPage();
    render(a.hits);
    simpleLightboxExample.refresh();

    if (a.hits.length === per_page) {
      observer.observe(refs.gallery.lastElementChild);
    }
  } catch (e) {
    console.log(e);
    Notify.warning("We're sorry, but you've reached the end of search results.");

    observer.unobserve(refs.gallery.lastElementChild);
    return;
  }
}

function scroll() {
  const { height: cardHeight } = document.querySelector('.gallery').lastElementChild.getBoundingClientRect();

  // window.scrollBy(0, window.innerHeight);
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function render(a) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(a));
}
