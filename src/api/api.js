import axios from 'axios';

export const pixabayApi = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: `29483810-e73a753bafa1cfe0ffde3d090`,
  },
});
