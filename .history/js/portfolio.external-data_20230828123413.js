document.addEventListener("DOMContentLoaded", () => {

    const tableDataset = document.getElementById("info-table");

    GetImagesData();
    function GetImagesData() {
        fetch('https://jsonplaceholder.typicode.com/photos?albumId=1')
            .then((response) => response.json())
            .then((json) => {
                

                const recievedData = json;
                // console.log(recievedData);
                for (const item of recievedData) {
                    const tr = tableDataset.insertRow();

                    const imageCell = tr.insertCell(0);
                    var image_ = document.createElement("img");
                    image_.src = item.thumbnailUrl;
                    image_.width = 30;
                    image_.height = 30;
                    image_.style.margin = "10px";
                    image_.alt = "Alternate text.";
                    imageCell.className = "image-id-cell";
                    imageCell.appendChild(image_);


                    const idCell = tr.insertCell(1);
                    idCell.className = "image-id-cell";
                    idCell.textContent = item.id;

                    const titleCell = tr.insertCell(2);
                    titleCell.textContent = item.title;
                    titleCell.style.width = '40%'

                    const urlCell = tr.insertCell(3);
                    // var urlLink = document.createElement("a");
                    // urlLink.href = item.url;
                    // console.log("url is : "+item.url);
                    // urlLink.target = "_blank";
                    urlCell.className = "url-cell";
                    urlCell.style.width = '40%';
                    urlCell.textContent = item.url;
                    urlCell.onclick = function() {
                        window.open(item.url);
                      };
                    // urlCell.appendChild(urlLink);
                   

                }

            });
    }
})