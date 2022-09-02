import { pixabayApi } from './api';

export async function getImages(params) {
  const a = await pixabayApi.get('', { params });
  return a;
}
