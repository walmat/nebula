import prefixer from '../../../utils/reducerPrefixer';

const prefix = '@@News';
const newsTypesList = ['ADD'];

export const newsActions = newsTypesList.map(t => `${prefix}/${t}`);
export const newsActionTypes = prefixer(prefix, newsTypesList);

export const addNews = news => {
  return {
    type: newsActionTypes.ADD,
    payload: news
  };
};
