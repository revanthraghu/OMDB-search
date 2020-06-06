//function to add api request parameters to url
function setUrlParams(search_term) {

    //exrtact the search type radio button value
    var search_type_form = new FormData(document.querySelector('.search-types'))
    var search_type;
    for(var value of search_type_form.values()) {
        search_type = value
    }

    //create new URL object instance and add params to url
    var url  = new URL("http://www.omdbapi.com/?apikey=edccade0")
    if(search_type !== 'title') {
        url.searchParams.append("s", search_term)
    } else {
        url.searchParams.append("t", search_term)
    }
    if(search_type == 'movie' || search_type == 'series') {
        url.searchParams.append("type", search_type)
    }
    return url
}

//function to genrate card of result items
function displayResultItems(result_items, result_div) {

    result_items.forEach(function (item) {
        var div = document.createElement('div')
        div.setAttribute('style', 'border: 1px solid lightgrey; margin: 1% 2% 1% 2%; padding: 0%; background-color: white; display: flex; flex-direction: column')
        var poster = document.createElement('img')
        poster.setAttribute('src', item.Poster)
        poster.setAttribute('alt', 'Poster')
        poster.setAttribute('style', 'width: 200px; min-width: 150px')
        var info_div = document.createElement('div')
        info_div.setAttribute('style', 'margin-left: 3%')
        var imdb_link = document.createElement('a')
        imdb_link.setAttribute('href', "https://www.imdb.com/title/" + item.imdbID)
        imdb_link.setAttribute('target', '_blank')
        imdb_link.style.textDecoration = 'none'
        var title_h4 = document.createElement('h4')
        title_h4.setAttribute('style', 'margin-bottom: 2px; margin-top: 5px')
        title_h4.textContent = item.Title
        imdb_link.append(title_h4)
        var year_div = document.createElement('div')
        year_div.textContent = "Year: "
        year_div.innerHTML = "<strong>" + item.Year + "</strong>"
        info_div.append(imdb_link, year_div)
        div.append(poster, info_div)
        result_div.append(div)
        
    })
}

function displayResults(response_time, search_results) {

    //get results div from DOM
    var results_div = document.querySelector('.results')

    //remove all results from previous search
    if(results_div.children.length !== 0) {
        document.getElementById('result-count').remove()
        while (results_div.children.length > 0) {
            results_div.removeChild(results_div.lastChild)
        }
    }

    //Check if results obtained from API and display response
    if(search_results.Response === 'False') {
        var error_msg = document.createElement('h2')
        error_msg.textContent = search_results.Error + ' Try another name.'
        error_msg.style.textAlign = 'center'
        results_div.appendChild(error_msg)
    }
    else {
        var result_count = document.createElement('div')
        result_count.textContent = 'Found ' + search_results.totalResults + ' results in ' + response_time + 's'
        result_count.id = "result-count"
        result_count.setAttribute('style', 'color: gray; text-align: center; padding: 10px')
        document.querySelector('body').insertBefore(result_count, document.querySelector('.results'))
        displayResultItems(search_results.Search, results_div)
    }

}

//main function that runs on submitting search term
function getSearchResults(search_term) {
    var url = setUrlParams(search_term)
    var results = new XMLHttpRequest()
    results.open("GET", url)
    results.send()
    var request_time = (new Date()).getTime()
    results.onload = function() {
        var search_results = JSON.parse(results.response)
        var response_time = ((new Date()).getTime() - request_time)/1000
        displayResults(response_time, search_results)
        //per page 10 items displayed...do pagination
    }
}

//Submit event listener for the search-bar form
document.querySelector('form').addEventListener('submit', function (submit_event) {

    //prevent default action of submit button
    submit_event.preventDefault();

    //get the search string from search bar
    var search_term = document.querySelector('#search').value;

    //Change the webpage title to show the search term
    document.querySelector('title').textContent = "Search - " + search_term

    //display results for the seearch term
    getSearchResults(search_term)
})