import axios from 'axios';

const API_KEY = '29483810-e73a753bafa1cfe0ffde3d090';
const HITS_LIMIT = 500;
const PER_PAGE = 40;
export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.per_page = PER_PAGE;
  }

  totalHits() {
    return Math.floor(HITS_LIMIT / PER_PAGE) * PER_PAGE + PER_PAGE;
  }

  hitsLeft() {
    return this.totalHits() - this.currentPage * this.per_page;
  }
  async fetchCards() {
    const pixabayQuery = axios.create({
      baseURL: 'https://pixabay.com/api/',
      params: {
        key: `${API_KEY}`,
        per_page: `${this.per_page}`,
        page: `${this.currentPage}`,
        image_type: 'photo',
      },
    });

    pixabayQuery.defaults.params['q'] = this.searchQuery;
    pixabayQuery.defaults.params['page'] = this.currentPage;
    // hitsLeft();
    const a = await pixabayQuery.get();

    this.currentPage += 1;
    // this.hitsCounter();

    // console.log(a.data.totalHits);
    return a.data;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
    this.currentPage = 1;
  }
  get query() {
    return this.searchQuery;
  }
}
