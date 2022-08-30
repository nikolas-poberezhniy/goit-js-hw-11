import axios from 'axios';

const API_KEY = '29483810-e73a753bafa1cfe0ffde3d090';
const HITS_LIMIT = 500;
const PER_PAGE = 40;
export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.per_page = PER_PAGE;
    this.receivedData = [];
  }

  totalHits() {
    if (
      //меньше чем "500"
      HITS_LIMIT > this.receivedData.total
    ) {
      return this.receivedData.totalHits;
    }
    if (
      //больше чем "520"
      this.receivedData.total >
      Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE
    ) {
      return Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE;
    }
  }

  hitsLeft() {
    if (
      //меньше чем "500"
      HITS_LIMIT > this.receivedData.total
    ) {
      return (
        this.receivedData.totalHits - this.per_page * (this.currentPage - 1)
      );
    }
    if (
      //меньше чем "520"
      Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE >
      this.receivedData.total
    ) {
      return (
        this.receivedData.totalHits - this.per_page * (this.currentPage - 1)
      );
    }

    if (
      //больше чем "520"
      this.receivedData.total >
      Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE
    ) {
      return (
        Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE -
        this.per_page * this.currentPage
      );
    }
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

    const a = await pixabayQuery.get();
    this.receivedData = a.data;
    this.currentPage += 1;

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
