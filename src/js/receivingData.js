import { getImages } from '../api/getImages';

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
      return this.receivedData.totalHits - this.per_page * (this.currentPage - 1);
    }
    if (
      //меньше чем "520"
      Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE >
      this.receivedData.total
    ) {
      return this.receivedData.totalHits - this.per_page * (this.currentPage - 1);
    }

    if (
      //больше чем "520"
      this.receivedData.total >
      Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE
    ) {
      return Math.ceil(this.receivedData.totalHits / PER_PAGE) * PER_PAGE - this.per_page * this.currentPage;
    }
  }

  async fetchCards() {
    const params = {
      dimage_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: this.searchQuery,
      per_page: 40,
      page: this.currentPage,
    };
    const a = await getImages(params);

    this.receivedData = a.data;
    return a.data;
  }

  resetPage() {
    this.currentPage = 1;
  }

  incrementPage() {
    this.currentPage++;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  get query() {
    return this.searchQuery;
  }
}
