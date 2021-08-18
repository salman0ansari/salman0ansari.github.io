const button = document.getElementById("button")
const list = document.getElementById("tableBody");
const table = document.getElementById("wholeTable")
const error = document.getElementById("error")

// const loader = document.getElementById("loader")

button.addEventListener("click", event => {

    const inputData = document.getElementById('input')

    let regEx = new RegExp("^https?:\\/\\/(www\\.)?youtube\\.com\\/(channel\\/UC[\\w-]{21}[AQgw]|(c\\/|user\\/)?[\w-]+)$")
    if (regEx.test(inputData.value)) {
        error.innerHTML = ""
        let chanlIdRegex = new RegExp("youtube.com\\/channel\\/([^#\\&\\?]*).*")
        chnlId = inputData.value.match(chanlIdRegex)[1]

    } else {
        console.log("Error: Invaild Url or Format")
        error.innerHTML = `<span class="text-red-800 p-5" id="error">Invalid URL</span>`
    }
    list.innerHTML = "";
    table.style.removeProperty('display');

    const getdata = (channel) => {
        // table.insertAdjacentHTML("beforebegin", `<img src="./loader.gif" class="mx-auto w-10" id="loader" alt="Channel Thumbnail">`)
        new Promise((resolve, reject) => {
            getSubscription(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,contentDetails&channelId=${channel}&key=AIzaSyBi7MpbMPNGR4oOuTYBUHTvcd4prUdiMBE&maxResults=50`, [], resolve, reject)
        }).then(response => {
            response.forEach(item => {
                let date = new Date(Date.parse(item.snippet.publishedAt))

                const tableBody = document.createElement("tr");
                tableBody.innerHTML = `
                  <th><div class="avatar">
                    <div class="w-12 h-12 mask mask-squircle">
                      <img src="${item.snippet.thumbnails.default.url}" alt="Channel Thumbnail">
                    </div></th> 
                  <td><a href="https://www.youtube.com/channel/${item.snippet.resourceId.channelId}">${item.snippet.title}</a></td> 
                  <td>${date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td> 
                  <td>${item.contentDetails.totalItemCount}</td> 
                  `;

                list.append(tableBody);

            })
        })
    }
    getdata(chnlId)

    event.preventDefault();

})



const getSubscription = function (url, user, resolve, reject) {
    axios.get(url)
        .then(response => {
            const retrivedUserData = user.concat(response.data.items)
            if (response.data.nextPageToken) {
                getSubscription(url + "&pageToken=" + response.data.nextPageToken, retrivedUserData, resolve, reject)

            } else {
                resolve(retrivedUserData)
            }
        })
        .catch(error => {
            console.log(error)
            reject('Something wrong. Channel Private or API limit Reached Please try again.')
        })
}


const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr));
})))
