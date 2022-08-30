import ApiService from './js/receivingData';
import cardTemplate from './partials/imgCardTemplate.hbs';
import { Notify } from 'notiflix';
import { gallery } from './js/gallery';
import { refs } from './js/refs';
import throttle from 'lodash.throttle';
import _debounce from 'debounce';

const NewApiService = new ApiService();

const observerOptions = {
  root: null,
  rootMargin: `${1}px`,
  threshold: 1,
};

let observer = new IntersectionObserver(e => {
  e.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(refs.gallery.lastElementChild);

      renderReceivedData();
      gallery.refresh();
      throttle(NewApiService.hitsLeft, 1000);
      if (NewApiService.hitsLeft() >= NewApiService.per_page) {
        Notify.success(`There are ${NewApiService.hitsLeft()} images left`);
      }
    }
  });
}, observerOptions);

refs.form.addEventListener('submit', e => formSubmit(e));

function formSubmit(e) {
  e.preventDefault();
  if (e.currentTarget.searchQuery.value) {
    refs.gallery.innerHTML = '';
    NewApiService.query = e.currentTarget.searchQuery.value;
    refs.form.reset();
    renderReceivedData();
    return;
  }
  Notify.failure('Введите запрос');
}

async function renderReceivedData() {
  try {
    const a = await NewApiService.fetchCards();

    if (!a.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (NewApiService.currentPage == 2) {
      Notify.info(`Hooray! We found ${NewApiService.totalHits()} images.`);
    }
    if (document.querySelectorAll('.photo-card').length > 0) {
      scroll();
    }
    render(a.hits);
    gallery.refresh();

    if (a.hits.length < NewApiService.per_page) {
      throw new Error('Уупс!');
    }
  } catch (e) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );

    observer.unobserve(refs.gallery.lastElementChild);
    return;
  }

  observer.observe(refs.gallery.lastElementChild);
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .lastElementChild.getBoundingClientRect();

  // window.scrollBy(0, window.innerHeight);
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function render(a) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(a));
}
