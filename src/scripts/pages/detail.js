import { hideLoadingElement, showLoadingElement } from '../components/loading'
import { GET_RESTAURANT_DETAIL_API, GET_RESTAURANT_IMAGE_API } from '../config'
import { favActions, FavoriteDB, initFavoriteButton } from '../utils/indexeddb'
import { q } from '../utils/query-selector'

const template = restaurant => /* html */ `
  <h1>${restaurant.name} (${restaurant.rating}⭐)</h1>
  <button id="add-or-remove-fav">fav button</button>
  <img
    src="${GET_RESTAURANT_IMAGE_API}/large/${restaurant.pictureId}"
    alt="${restaurant.name} image"
  />
  <p>City: ${restaurant.city}</p>
  <p>Address: ${restaurant.address}</p>
  <p>Description: ${restaurant.description}</p>
  <p>Categories: ${restaurant.categories.map(v => v.name).join(', ')}</p>
  <h1>Menu Minuman</h1>
  <ul>
    ${restaurant.menus.drinks.map(v => '<li>' + v.name + '</li>').join('')}
  </ul>
  <h1>Menu Makanan</h1>
  <ul>
    ${restaurant.menus.foods.map(v => '<li>' + v.name + '</li>').join('')}
  </ul>
  <h1>Review</h1>
  <ul>
    ${restaurant.customerReviews
      .map(v => `<li>${v.name}: ${v.review} (${v.date})</li>`)
      .join('')}
  </ul>
`

export async function renderDetailPage (id) {
  showLoadingElement()

  const appContainer = q('#app')
  const restaurantDetail = await fetchDetail(id)

  appContainer.innerHTML = template(restaurantDetail)

  const favBtn = document.querySelector('#add-or-remove-fav')
  const isFav = await favActions.get(id)
  favBtn.textContent = isFav ? 'Remove from favorite' : 'Add to favorite'
  favBtn.addEventListener('click', async () => {
    const isFav = await favActions.get(id)
    if (isFav) {
      await favActions.delete(id)
      favBtn.textContent = 'Add to favorite'
    } else {
      await favActions.put(restaurantDetail)
      favBtn.textContent = 'Remove from favorite'
    }
  })

  hideLoadingElement()
}

async function fetchDetail (id) {
  const { restaurant } = await fetch(GET_RESTAURANT_DETAIL_API + '/' + id).then(
    res => res.json()
  )
  return restaurant
}
