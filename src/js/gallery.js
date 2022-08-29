import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

gallery.on('show.simplelightbox');
