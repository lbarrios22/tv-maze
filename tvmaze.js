const $form = $('#search-form');
const $showsList = $('#shows-list')
const $episodesList = $('#episode-list')

async function getAllShows(show) {
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${show}`);
  const { data } = res;
  const showDetails = data.map((results) => {
    const shows = results.show;
    return {
      id: shows.id,
      name: shows.name,
      summary: shows.summary,
      img: shows.image.medium,
    };
  });
  return showDetails;
}

async function previewAllShows(shows) {
  const showList = $('#shows-list');
  for (let show of await shows) {
    let showings = `
      <div class="col-md-6 col-lg-3 shows" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.img}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id='episodes-list' class="btn btn-primary" data-bs-toggle='modal' data-bs-target='#show-episodes'>Episodes</button>
           </div>
         </div>  
       </div>`;
    showList.append(showings);
  }
}


$form.on('submit', async (e) => {
  e.preventDefault();
  const $formInput = $('#search-query').val();

  previewAllShows(getAllShows($formInput));
});


$showsList.on('click', '#episodes-list', async (e) => {
  const id = $(e.target).closest('.shows').data('show-id')
  allEpisodes(getEpisodes(id))
  $('h2').css({
    display: 'block',
    'margin-top': '2em'
  })
})

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const { data } = res;
  const allEpisodes = data.map((episodes) => {
    return {
      name: episodes.name,
      season: episodes.season,
      episode: episodes.number,
    };
  });
  return allEpisodes;
}

async function allEpisodes(episodes){
    for(let episode of await episodes){
      let $episodeList = $(
        `<li>
      Episode Name: ${ episode.name }( Season: ${ episode.season }, Episode Number: ${ episode.episode})
        </li>))`)
        $episodesList.append($episodeList)
    }
}
