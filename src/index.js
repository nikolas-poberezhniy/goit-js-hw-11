import ApiService from './js/receivingData';
import cardTemplate from './partials/imgCardTemplate.hbs';
import { Notify } from 'notiflix';
import { gallery } from './js/gallery';
import { refs } from './js/refs';
import debounce from 'lodash.debounce';

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
      if (NewApiService.hitsLeft() >= NewApiService.per_page) {
        // Notify.info(`There are ${NewApiService.hitsLeft()} hits left`);
      }
    }
  });
}, observerOptions);

refs.form.addEventListener('submit', e => {
  e.preventDefault();

  refs.gallery.innerHTML = '';
  NewApiService.query = e.currentTarget.searchQuery.value;
  renderReceivedData();
});

async function renderReceivedData() {
  try {
    const a = await NewApiService.fetchCards();
    console.log(a);
    if (NewApiService.currentPage == 2) {
      Notify.info(`Hooray! We found ${a.totalHits} images.`);
    }
    if (!a.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (document.querySelectorAll('.photo-card').length > 0) {
      scroll();
    }
    render(a.hits);
    console.log(a.hits);
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
  console.log(
    `Высота элемента -- ${
      document
        .querySelector('.gallery')
        .lastElementChild.getBoundingClientRect().height
    }`
  );

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function render(a) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(a));
}

// const observerOptions = {
//   root: refs.gallery.lastElementChild,
//   rootMargin: `${
//     2 * refs.gallery.firstElementChild.getBoundingClientRect().height
//   }`,
// };
// const observer = new IntersectionObserver(observerOptions);
