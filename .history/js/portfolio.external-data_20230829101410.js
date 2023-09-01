document.addEventListener("DOMContentLoaded", () => {

    const tableDataset = document.getElementById("info-table");

    // GetImagesData();




    (async () => {
        const informationData = await FetchDataFromDatabase();
        DisplayInformationTable(informationData);

    })();

    function DisplayInformationTable(informationData) {
        for (const item of informationData) {
            const tr = tableDataset.insertRow();

            tr.id = item.info_id;
            const imageCell = tr.insertCell(0);
            var image_ = document.createElement("img");
            image_.src = item.image_url;
            image_.width = 30;
            image_.height = 30;

            image_.style.margin = "auto";
            image_.alt = "Alternate text.";
            imageCell.className = "image-id-cell";
            imageCell.appendChild(image_);


            const idCell = tr.insertCell(1);
            idCell.className = "image-id-cell";
            idCell.textContent = item.info_id;

            const titleCell = tr.insertCell(2);
            titleCell.textContent = item.image_title;
            titleCell.style.width = '40%'

            const urlCell = tr.insertCell(3);
            urlCell.className = "url-cell";
            urlCell.style.width = '36%';
            urlCell.textContent = item.image_url;

            const deleteCell = tr.insertCell(4);
            deleteCell.style.width = '4%';
            var imageDelete = document.createElement("img");
            imageDelete.src = "res/ic_delete_red.png";
            imageDelete.width = 30;
            imageDelete.height = 30;
            imageDelete.style.margin = "auto";
            imageDelete.alt = "DELETE";
            imageDelete.className = "delete-info-item";
            imageDelete.addEventListener('click', (event) => {
                DeleteItemWithId(tr.id);
            })
            

            deleteCell.appendChild(imageDelete);

            urlCell.onclick = function () {
                window.open(item.image_url);
            };

        }
    }

    async function FetchDataFromDatabase() {
        
        try {
            const response = await fetch('http://localhost:3000/api/getInformationData');
            if (!response.ok) {
                throw new Error('Request failed');
            }
            const result = await response.json();
            return result;
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    async function DeleteItemWithId(id){

        console.log("Delete information item:  ", id);

        fetch(`http://localhost:3000/api/deleteInformationItem/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Delete request failed');
              }
              console.log('Item deleted successfully');

              const selectedRow = document.getElementById(id);
              selectedRow.remove();
            //   tableDataset.removeChild(selectedRow);

              
            })
            .catch(error => {
              console.error('Error:', error);
            });

    }


    async function AddingDataInTable(recievedData) {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recievedData),
        };

        fetch('http://localhost:3000/api/addInformationData', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(result => {
                console.log('Information items added successfully:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    function GetImagesData() {
        fetch('https://jsonplaceholder.typicode.com/photos?albumId=1')
            .then((response) => response.json())
            .then((json) => {


                const recievedData = json;

                AddingDataInTable(recievedData);

            });
    }



})