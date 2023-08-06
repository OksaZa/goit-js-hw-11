import './styles.css';
import { searchPhoto } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form');
const galleryImage = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const paramsForNotify = {
  root: null,
  rootMargin: "400px",
  threshold: 1.0
};


const perPage = 40;
let page = 1;
let valueSearchPhoto = '';

btnLoadMore.classList.add('is-hidden');

form.addEventListener('submit', handlerForm)

function handlerForm(evt) {
    evt.preventDefault()
    galleryImage.innerHTML = '';
    page = 1;
    const { searchQuery } = evt.currentTarget.elements;
    valueSearchPhoto = searchQuery.value.trim().toLowerCase()
    console.log(valueSearchPhoto)
      if (valueSearchPhoto === '') {
        Notify.info('Enter your request, please!', paramsForNotify);
        return;
    }
 searchPhoto(valueSearchPhoto, page, perPage)
        .then(data => {
         const searchResults = data.hits;
            if (data.totalHits === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.", paramsForNotify);
                btnLoadMore.classList.add('is-hidden');
            } else {
                Notify.info(`Hooray! We found ${data.totalHits} images.`, paramsForNotify);
                console.log(searchResults);
                console.log(data.totalHits);
                createMarkup(searchResults);
                lightbox.refresh();
                btnLoadMore.classList.remove('is-hidden');
            };
            if (data.totalHits <= perPage) {
                btnLoadMore.classList.add('is-hidden');
            };
        })
    .catch(onFetchError);
     btnLoadMore.addEventListener('click', handlerLoadMore);
    evt.currentTarget.reset();
}

function createMarkup(searchResults) {
    const arrPhotos = searchResults.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
            <a class="gallery_link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
            </a>
        <div class="info">
            <p class="info-item">
            <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
            <b>Views: ${views}</b>
            </p>
            <p class="info-item">
            <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads: ${downloads}</b>
            </p>
        </div>
        </div>`
    });
    galleryImage.insertAdjacentHTML("beforeend", arrPhotos.join(''));
};
function handlerLoadMore() {
    page += 1;
    searchPhoto(valueSearchPhoto, page, perPage)
        .then(data => {
            const searchResults = data.hits;
            const numberOfPage = Math.ceil(data.totalHits / perPage);
            
            createMarkup(searchResults);
            if (page === numberOfPage) {
                btnLoadMore.classList.add('is-hidden');
                Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
                btnLoadMore.removeEventListener('click', handlerLoadMore);
            };
            lightbox.refresh();
        })
        .catch(onFetchError);
};
function onFetchError() {
    Notify.failure("Oops... Try again!', paramsForNotify");
};

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250
  });

  function showLoadMorePage() {
    if (checkIfEndOfPage()) {
        handlerLoadMore();
    };
};

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}