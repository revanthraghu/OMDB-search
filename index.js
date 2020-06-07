//function to add api request parameters to url
function setUrlParams(page_num) {
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
    url.searchParams.append("page", page_num)
    return url
}

//function to genrate card of result items
function displayResultItems(search_results, result_div) {
    var result_items = search_results.Search
    if(result_items === undefined) {
        var div = document.createElement('div')
        div.setAttribute('style', 'overflow: hidden; border: 1px solid lightgrey; margin: 1% 2% 1% 2%; padding: 0%; background-color: white; display: flex; flex-direction: column')
        var poster = document.createElement('img')
        poster.setAttribute('src', search_results.Poster)
        poster.setAttribute('alt', 'Poster')
        poster.setAttribute('style', 'width: 200px; min-height: 200px')
        var info_div = document.createElement('div')
        info_div.setAttribute('style', 'margin-left: 3%')
        var imdb_link = document.createElement('a')
        imdb_link.setAttribute('href', "https://www.imdb.com/title/" + search_results.imdbID)
        imdb_link.setAttribute('target', '_blank')
        imdb_link.style.textDecoration = 'none'
        var title_h4 = document.createElement('h4')
        title_h4.setAttribute('style', 'margin-bottom: 2px; margin-top: 5px')
        title_h4.textContent = search_results.Title
        imdb_link.append(title_h4)
        var year_div = document.createElement('div')
        year_div.textContent = "Year: "
        year_div.innerHTML = "<strong>" + search_results.Year + "</strong>"
        info_div.append(imdb_link, year_div)
        div.append(poster, info_div)
        result_div.append(div)
    }
    else {
        result_items.forEach(function (item) {
            var div = document.createElement('div')
            div.setAttribute('style', 'overflow: hidden; border: 1px solid lightgrey; margin: 1% 2% 1% 2%; padding: 0%; background-color: white; display: flex; flex-direction: column')
            var poster = document.createElement('img')
            poster.setAttribute('src', item.Poster)
            poster.setAttribute('alt', 'Poster')
            poster.setAttribute('style', 'width: 200px; min-height: 280px')
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

}

function displayResults(response_time, search_results) {

    //get results div from DOM
    var results_div = document.querySelector('.results')

    //remove all results from previous search
    if(results_div.children.length !== 0) {
        document.getElementById('result-count').remove()
        document.querySelector('#pages').remove()
        while (results_div.children.length > 0) {
            results_div.removeChild(results_div.lastChild)
        }
    }
    else if(document.querySelector('h2')) {
        document.querySelector('h2').remove()
    }

    //Check if results obtained from API and display response
    if(search_results.Response === 'False') {
        var error_msg = document.createElement('h2')
        error_msg.textContent = search_results.Error + ' Try another name.'
        error_msg.setAttribute('style', 'text-align: center; color: white')
        document.querySelector('body').insertBefore(error_msg, document.querySelector('.results'))
    }
    else {
        var error_msg = document.querySelector('h2')
        if(error_msg) {
            error_msg.remove()
        }
        var result_count = document.createElement('div')
        if(search_results.totalResults === undefined) {
            result_count.textContent = 'Found result in ' + response_time + 's'
        }
        else {
            result_count.textContent = 'Found ' + search_results.totalResults + ' results in ' + response_time + 's'
        }
        result_count.id = "result-count"
        result_count.setAttribute('style', 'color: gray; text-align: center; padding: 10px')
        document.querySelector('body').insertBefore(result_count, document.querySelector('.results'))
        displayResultItems(search_results, results_div)

        //create page selectors
        var pages_div = document.createElement('div')
        pages_div.id = "pages"
        pages_div.setAttribute('style', 'margin: 0px 10% 30px 10%; display: flex; flex-wrap: wrap; justify-content: center')
        for(var page = 0; page < Math.ceil(search_results.totalResults/10); page++) {
            var page_number = document.createElement('div')
            page_number.textContent = page+1
            page_number.id = page+1
            page_number.setAttribute('style', 'padding: 3px 7px 3px 7px; background-color: white; margin-left: 10px; margin-top: 10px; cursor: pointer')
            pages_div.appendChild(page_number)
        }
        document.querySelector('body').insertBefore(pages_div, document.querySelector('script'))
        pages_div.addEventListener('click', function (event) {
            if(event.target.id !== 'pages'){
               getSearchResults(event.target.textContent)
            }
            })
    }
}

//main function that runs on submitting search term
function getSearchResults(page_num = 1) {
    var url = setUrlParams(page_num)
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
var search_term;

//input change event listener for live search
document.querySelector('form').addEventListener('input', function(event){

    //Debouncer to wait for user to stop typing
    if(this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(function(){
                        search_term = event.target.value
                        if(search_term) {
                            getSearchResults()
                        }
                    }, 500)
})

//Submit event listener for the search-bar form
document.querySelector('form').addEventListener('submit', function (submit_event) {

    //prevent default action of submit button
    submit_event.preventDefault();

    //get the search string from search bar
    search_term = document.querySelector('#search').value;

    //Change the webpage title to show the search term
    document.querySelector('title').textContent = "Search - " + search_term

    //display results for the seearch term
    getSearchResults()
})
