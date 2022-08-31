import { pixabayApi } from './api';

const API_KEY = '29483810-e73a753bafa1cfe0ffde3d090';
const HITS_LIMIT = 500;
const PER_PAGE = 40;
export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.currentPage = 0;
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
    this.currentPage++;

    const params = {
      dimage_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: `${this.searchQuery}`,
      per_page: 40,
      page: `${this.currentPage}`,
    };

    const a = await pixabayApi.get('', { params });
    this.receivedData = a.data;

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
