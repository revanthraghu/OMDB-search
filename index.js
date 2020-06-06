function setUrlParams(sort_option) {

    //included this so if search term is changed but submit is not pressed 
    //and the sort option is changed then search term is reset to current search term
    document.querySelector('#search-options').value = search_term

    //reset the search params in url and append search term
    url.search = ''
    url.searchParams.append("apikey", "edccade0")
    url.searchParams.append("s", search_term)

    //append sort type and order
    if(sort_option === "desc-stars") {
        url.searchParams.append("order", "desc")
        url.searchParams.append("sort", "stars")
    }
    else if(sort_option === "asc-stars") {
        url.searchParams.append("order", "asc")
        url.searchParams.append("sort", "stars")
    }
    else if (sort_option === "desc-forks") {
        url.searchParams.append("order", "desc")
        url.searchParams.append("sort", "forks")
    }
    else if (sort_option === "asc-forks") {
        url.searchParams.append("order", "asc")
        url.searchParams.append("sort", "forks")
    }
    else if (sort_option === "help-wanted") {
        url.searchParams.append("sort", "help-wanted-issues")
    }
    else if (sort_option === "recently-update") {
        url.searchParams.append("order", "desc")
        url.searchParams.append("sort", "updated")
    }
    else if (sort_option === "least-recently-update") {
        url.searchParams.append("order", "asc")
        url.searchParams.append("sort", "updated")
    }
}

//function to genrate divs of result items
function displayResultItems(result_items_div, result_items) {
// display results as divs with paras
// from data extract full_name, html_url, description, language, license.name, pushed_at
    result_items.forEach(function (item) {
        var div = document.createElement('div')
        div.setAttribute('style', 'border: 1px solid lightgrey; margin: 1% 0px 1% 0px; padding: 0% 0% 2% 3%; border-radius: 8px; background-color: white')
        var name_p = document.createElement('p')
        var link = document.createElement('a')
        link.textContent = item.full_name
        link.setAttribute('href', item.html_url)
        link.setAttribute('target', "_blank")
        name_p.append(link) 
        var description_p = document.createElement('p')
        description_p.style.fontWeight = 'bold'
        description_p.textContent = item.description
        var info_div = document.createElement('div')
        info_div.setAttribute('style', 'display: flex; font-size: small')
        var language_p = document.createElement('div')
        var lang_snap = document.createElement('snap')
        lang_snap.textContent = "Lang: "
        lang_snap.setAttribute('style', 'font-weight: bold')
        language_p.innerText = item.language
        language_p.prepend(lang_snap)
        var license_p = document.createElement('div')
        license_p.style.marginLeft = '2%'
        if(item.license !== null) {
            var lic_snap = document.createElement('snap')
            lic_snap.textContent = "Lic: "
            lic_snap.setAttribute('style', 'font-weight: bold')
            license_p.innerText = item.license.name 
            license_p.prepend(lic_snap)
              
        }
        var updated_on_p = document.createElement('div')
        updated_on_p.style.marginLeft = '2%'
        var date = new Date(item.pushed_at)
        date = date.toDateString().split(' ')
        updated_on_p.textContent = "Updated on " +" "+ date[2] +" "+ date[1] +" "+ date[3]
        info_div.append(language_p, license_p, updated_on_p)
        div.append(name_p, description_p, info_div)
        result_items_div.append(div)
        
    })
}

function displayResults(search_results) {
    var results_div = document.querySelector('.results')
    if(results_div.children.length !== 0 && url.searchParams.has("sort")) {
        while (results_div.children.length > 1) {
            results_div.removeChild(results_div.lastChild)
        }
    document.querySelector(".head > h2").textContent = search_results.total_count + " repository results"    
    }
    else {
        while (results_div.children.length > 0) {
            results_div.removeChild(results_div.lastChild)
        }
    }
    var result_items_div = document.createElement('div')
    result_items_div.setAttribute('style', 'display: flex; margin: 2% 20% 2% 20%; flex-direction: column')
    //call function to generate cards
    displayResultItems(result_items_div, search_results.items)
    results_div.append(result_items_div)

}
// url variable stores the github api url

// search term is global
var search_term = ''
function getSearchResults(url) {
    var results = new XMLHttpRequest()
    results.open("GET", url)
    results.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    results.send()
    results.onload = function() {
        var search_results = JSON.parse(results.response)
        displayResults(search_results)
    }
}

document.querySelector('form').addEventListener('submit', function (submit_event) {
    submit_event.preventDefault();
    var search_term = document.querySelector('#search').value
    var url  = new URL("http://www.omdbapi.com/")
        document.querySelector('title').textContent = "Search - " + search_term
        url.searchParams.append("q", search_term)
        getSearchResults(url)
    }

  })