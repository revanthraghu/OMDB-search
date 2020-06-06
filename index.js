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

// //function to genrate card of result items
// function displayResultItems(result_items_div, result_items) {
// // display results as divs with paras
// // from data extract full_name, html_url, description, language, license.name, pushed_at
//     result_items.forEach(function (item) {
//         var div = document.createElement('div')
//         div.setAttribute('style', 'border: 1px solid lightgrey; margin: 1% 0px 1% 0px; padding: 0% 0% 2% 3%; border-radius: 8px; background-color: white')
//         var name_p = document.createElement('p')
//         var link = document.createElement('a')
//         link.textContent = item.full_name
//         link.setAttribute('href', item.html_url)
//         link.setAttribute('target', "_blank")
//         name_p.append(link) 
//         var description_p = document.createElement('p')
//         description_p.style.fontWeight = 'bold'
//         description_p.textContent = item.description
//         var info_div = document.createElement('div')
//         info_div.setAttribute('style', 'display: flex; font-size: small')
//         var language_p = document.createElement('div')
//         var lang_snap = document.createElement('snap')
//         lang_snap.textContent = "Lang: "
//         lang_snap.setAttribute('style', 'font-weight: bold')
//         language_p.innerText = item.language
//         language_p.prepend(lang_snap)
//         var license_p = document.createElement('div')
//         license_p.style.marginLeft = '2%'
//         if(item.license !== null) {
//             var lic_snap = document.createElement('snap')
//             lic_snap.textContent = "Lic: "
//             lic_snap.setAttribute('style', 'font-weight: bold')
//             license_p.innerText = item.license.name 
//             license_p.prepend(lic_snap)
              
//         }
//         var updated_on_p = document.createElement('div')
//         updated_on_p.style.marginLeft = '2%'
//         var date = new Date(item.pushed_at)
//         date = date.toDateString().split(' ')
//         updated_on_p.textContent = "Updated on " +" "+ date[2] +" "+ date[1] +" "+ date[3]
//         info_div.append(language_p, license_p, updated_on_p)
//         div.append(name_p, description_p, info_div)
//         result_items_div.append(div)
        
//     })
// }

function displayResults(response_time, search_results) {

    //get results div from DOM
    var results_div = document.querySelector('.results')

    //remove all results from previous search
    if(results_div.children.length !== 0) {
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
        result_count.style.color = 'gray'
        var hr = document.createElement('hr')
        results_div.append(result_count, hr)
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