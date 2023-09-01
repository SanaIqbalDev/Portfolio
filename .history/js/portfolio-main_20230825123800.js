const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


document.addEventListener("DOMContentLoaded", function () {



  //product modal
  var productModal = document.getElementById("productDesc");
  var productContent = document.getElementById("product-content");
  var service = document.getElementById("services");
  var skills = document.getElementById("skillset");
  var skillsContainer = document.getElementById("skills-div");

  const currentList = [1, 2, 3, 4];


  //Products list
  let sliderItems = document.getElementsByClassName("slider-item");
  let itemsContainer = document.getElementById("products-container");
  let servicesDiv = document.getElementsByClassName("services-div");
  let newItemIndex = sliderItems.length - 1;

  var editInfoModal = document.getElementById("editModal");
  var globalSelectedServiceId = "";


  //Fetching individual information from server...
  FetchPersonInfo();
  FetchIitialServicesData();

  // WriteServicesData();
  FetchUpdatedList();



  //header functions

  service.onclick = function () {
    servicesDiv[0].scrollIntoView({ behavior: "smooth" });
  }
  skills.addEventListener("click", () => {
    skillsContainer.scrollIntoView({ behavior: "smooth" });
  })
  //
  window.onclick = function (event) {
    if (event.target == productModal) {
      productModal.style.display = "none";
    }

  }

  //Editing services information
  const editImg = document.getElementById("edit-img");
  const editTitle = document.getElementById("edit-title")
  const editDesc = document.getElementById("edit-description");
  const ImagePreview = document.getElementById("imagePreview");
  const submitEditInfoForm = document.getElementById("service-info-form");

  submitEditInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    UpdateServiceItem({
      "title": editTitle.value,
      "description": editDesc.value,
      "service_id": globalSelectedServiceId,
      
    });


  });
  editImg.addEventListener("change", () => {
    const imageFile = editImg.files[0];

    if (imageFile.type.startsWith('image/')) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        const fileName = imageFile.name;
        ImagePreview.src = fileReader.result;
        console.log("Source is :", fileName);
      });

      fileReader.readAsDataURL(imageFile);
    } else {
      console.log('File type is not supported.');
    }
  });

  //Displaying service item information for editing
  // const editButtons = document.getElementsByClassName("edit-btn");
  // for (const btn_ of editButtons) {
  //   btn_.addEventListener("click", editItem);
  // }

  async function editItem() {

    const selectedItem = event.target.closest(".slider-bg");
    FetchServiceDetailWithId(selectedItem.id, true);

    globalSelectedServiceId = selectedItem.id;

  }





  document.getElementById("add-item").addEventListener("click", function () {
    addItem("", "", "", "", true);
  });
  const addItemDiv = document.getElementById("add-item-div");


  //Removing services Item
  // const removeButtons = document.getElementsByClassName("remove-btn");
  // for (const btn of removeButtons) {
  //   btn.addEventListener("click", removeItem);
  // }
  function removeItem() {

    const selectedItem = event.target.closest(".slider-bg");
    console.log(selectedItem.id);
    RemoveServiceData(selectedItem, parseInt(selectedItem.id));



    // FetchUpdatedList();

  }



  //Adding new services item dynamically in the list

  function addItem(a, b, c, d, addtoDataSet) {
    const container = document.getElementById("products-container");

    let id_;
    if (a === "") {
      id_ = getRandomNum(1, 10000, currentList);
    }
    else {
      id_ = a;
    }
    const newItem = document.createElement("div");
    newItem.className = "slider-bg";
    newItem.id = id_;



    let imgSrcVal;
    if (c === "") {
      imgSrcVal = "res/ic_new_item.png";
    }
    else {
      imgSrcVal = c;
    }

    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";
    removeButton.addEventListener("click", removeItem);
    const imgRemove = document.createElement("img");
    imgRemove.src = "res/ic_delete.png";
    removeButton.appendChild(imgRemove);

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    const imgEdit = document.createElement("img");
    imgEdit.src = "res/ic_edit.png";
    editButton.appendChild(imgEdit);
    editButton.addEventListener("click", editItem);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "item-options";



    const internalDiv = document.createElement("div");
    internalDiv.className = "slider-item";

    const image = document.createElement("img");
    image.src = imgSrcVal;

    const title = document.createElement("h3");
    title.className = "item-title";
    if (b === "") { title.textContent = "NEW SERVICE " + (newItemIndex + 1); }
    else { title.textContent = b; }

    newItemIndex++;

    optionsDiv.appendChild(removeButton);
    optionsDiv.appendChild(editButton);

    internalDiv.appendChild(image);
    internalDiv.appendChild(title);


    newItem.appendChild(optionsDiv);
    newItem.appendChild(internalDiv);


    container.insertBefore(newItem, addItemDiv);


    let descVal;
    if (d === "") {
      descVal = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    }
    else { descVal = d; }

    if (addtoDataSet) {

      const newService = {
        "service_id": id_,
        "title": title.textContent,
        "description": descVal,
        "image_url": "res/ic_success.png"
      };

      AddServiceData(newService);

    }

    FetchUpdatedList();
    console.log(getAllItems());

  }

  //fetches updated services list after every change
  function FetchUpdatedList() {
    sliderItems = document.getElementsByClassName("slider-item");

    for (const [index, item] of Object.entries(sliderItems)) {
      if (index < sliderItems.length - 1) {
        item.addEventListener("click", function () {

          FetchServiceDetailWithId(parseInt(item.parentElement.id), false)

        });
      }
    }
  }


  //display list with items information
  function displayServiceDetail(serviceItem) {


    let productImage = document.getElementById("product-img");
    let productTitle = document.getElementById("product-title");
    let productDescription = document.getElementById("product-description");

    if (serviceItem) {
      productImage.src = serviceItem.image_url;
      productTitle.textContent = serviceItem.title;
      productDescription.textContent = serviceItem.description;
      productModal.style.display = "block";
      productContent.scrollTo({ top: 0 });
    }
    else {
      productImage.src = "res/ic_new_item.png";
      productTitle.textContent = "Lorem ipsum dolor";
      productDescription.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      productModal.style.display = "block";
      productContent.scrollTo({ top: 0 });
    }

  }

  //Writes initial srvices data
  // function WriteServicesData() {
  //   deleteAll();
  // }

  // function addItemToDataSet(dataItem) {
  //   const existingData = JSON.parse(localStorage.getItem('items')) || [];
  //   if (!existingData.includes(dataItem)) {
  //     existingData.push(dataItem);
  //   }
  //   localStorage.setItem('items', JSON.stringify(existingData));
  // }

  function getAllItems() {
    return JSON.parse(localStorage.getItem('items')) || [];
  }

  // function GetItemById(id) {
  //   const items = getAllItems();
  //   const fetchedItem = items.filter(item => item.id == id);
  //   return fetchedItem;
  // }

  // function getItemByIndex(index) {
  //   const items = getAllItems();

  //   if (index >= 0 && index < items.length) {
  //     return items[index];
  //   }
  //   return null;
  // }


  // function deleteItemById(id) {
  //   const items = getAllItems();
  //   const updatedItems = items.filter(item => item.id !== id);
  //   localStorage.setItem('items', JSON.stringify(updatedItems));
  // }


  // function updateItem(id, updatedItem) {
  //   const items = getAllItems();
  //   const index = items.findIndex(item => item.id === id);
  //   if (index !== -1) {
  //     items[index] = updatedItem;
  //     localStorage.setItem('items', JSON.stringify(items));
  //   }
  // }

  // function deleteAll() {
  //   localStorage.clear();
  // }


  function getRandomNum(min, max, currentList) {
    let randomNumber;

    do {
      randomNumber = getRandomNumber(min, max);
    } while (currentList.includes(randomNumber));

    return randomNumber;
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Dynamic Content Filtering...


  const searchView = document.getElementById("search-view");
  const searchLabel = document.getElementById("search-label");
  const searchInput = document.getElementById("search-input");
  const searchImage = document.getElementById("search-image");
  let isSearchFocused = false;
  let serachText = "";
  let titles = [];

  searchLabel.addEventListener("click", () => {

    EnableSearch();
  });

  searchImage.addEventListener("click", () => {

    DisableSearch();

  });

  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchText = searchInput.value;
      FilterData((searchInput.value).toUpperCase());
    }
  });

  searchInput.addEventListener("click", (e) => {
  })
  function EnableSearch() {
    searchLabel.style.display = "none";
    searchInput.style.display = "flex";
    searchInput.focus();
    searchImage.src = "res/ic_back.png";
    isSearchFocused = true;
  }

  function DisableSearch() {
    if (isSearchFocused) {
      searchLabel.style.display = "flex";
      searchInput.style.display = "none";
      searchInput.value = "";
      searchImage.src = "res/ic_search.png";
      isSearchFocused = false;
      if (searchText.length > 0) {
        FillSliderData();
      }
    }
    else {
      EnableSearch();
    }
  }

  function FilterData(inputData) {

    SearchSliderList(inputData);
  }

  function SearchSliderList(title) {

    // sliderItems = document.getElementsByClassName("slider-item");
    // console.log("slider items are: " , sliderItems);

    // for (const [index, item] of Object.entries(sliderItems)) {
    //   // if (index < sliderItems.length - 1) {


    //     let itemTitle = document.getElementsByClassName("item-title");
    //     console.log("index is : " + index +" And title is " + itemTitle[index]);

    //     if (itemTitle[index].textContent !== title) {

    //       itemsContainer.removeChild(itemTitle[index].parentElement.parentElement);
    //       console.log(getAllItems());
    //       SearchSliderList(title);
    //     }

    //   // }
    // }


    const sliderItems = document.getElementsByClassName("slider-item");

    for (let i = sliderItems.length - 1; i >= 0; i--) {
      const itemTitle = sliderItems[i].getElementsByClassName("item-title")[0];

      if (itemTitle && itemTitle.textContent !== title) {
        sliderItems[i].parentElement.parentElement.removeChild(sliderItems[i].parentElement);
      }
    }

  }

  function FillSliderData() {


    for (const [index, contItem] of Object.entries(itemsContainer.children)) {
      if (index < itemsContainer.children.length - 1) {
        itemsContainer.removeChild(contItem);
        // deleteItemById(contItem.id);
      }
    }

    FetchUpdatedList();
    for (const item of getAllItems()) {
      addItem(item.id, item.title, item.img, item.description.false);
    }

  }

  function FetchPersonInfo() {
    fetch('http://localhost:3000/api/getAllPersons')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the data received from the server
        console.log('Data received:', data);

        // return data;
        DisplayIntroData(data[0]);

        // You can update your webpage with the received data here
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle any errors that occurred during the request
      });

  }
  async function FetchWorkExpInfo() {

    try {
      const response = await fetch('http://localhost:3000/api/getWorkExp');
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
  async function FetchIitialServicesData() {
    try {
      const response = await fetch('http://localhost:3000/api/getServices');
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const result = await response.json();
      // console.log("SERVICES data is :" , result);

      for (const item of result) {
        addItem(item.service_id, item.title, item.image_url, "", false);
      }

      return result;
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  async function AddServiceData(newService) {

    console.log("Service is ", newService);

    const imageFile = await fetchImageAsFile(newService.image_url);

    const formData = new FormData();
    formData.append('service_id',newService.service_id);
    formData.append('title', newService.title);
    formData.append('description', newService.description);

    if (imageFile) {
      formData.append('image_url', imageFile);
    }

    fetch('http://localhost:3000/api/addService', {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      console.log("response is:", response);
      return response.json();
    })
    .then(data => {
      console.log('Service added successfully:', data);
    })
    .catch(error => {
        console.error('Error:', error);
      });

  }

  async function RemoveServiceData(selectedItem, service_id) {
    console.log(service_id);

    fetch(`http://localhost:3000/api/deleteServiceItem/${service_id}`, {
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
        selectedItem.remove();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  async function UpdateServiceItem(serviceObject) {


    const updatedServiceItemData = {
      title: serviceObject.title,
      description: serviceObject.description,
      service_id: parseInt(serviceObject.service_id),
    };

    const updateServiceItemDataUrl = 'http://localhost:3000/api/updateServiceItem';

    const updateServiceItemDataBody = JSON.stringify(updatedServiceItemData);

    console.log("updateServiceItemDataBody", updateServiceItemDataBody);

    const requestOptions = {
      method: 'PUT',
      body: updateServiceItemDataBody,
    };

    fetch(updateServiceItemDataUrl, requestOptions)
      .then(response => {
        editModal.style.display = "none";

        return response.json();
      }
      )
      .then(data => {

        console.log("Updated data is : ", data);

        const selectedSliderItem = document.getElementById(globalSelectedServiceId).getElementsByClassName("slider-item");
        const itemImg = selectedSliderItem[0].querySelector('img')
        itemImg.src = serviceObject.image_url;
        const itemtitle = selectedSliderItem[0].querySelector('h3')
        itemtitle.textContent = serviceObject.title;


        // FetchUpdatedList();
        editModal.style.display = "none";
      })
      .catch(error => {
        // Handle the error.
        editModal.style.display = "none";

        console.log(error);
      });


  }
  async function FetchServiceDetailWithId(service_id, is_edit) {

    console.log("Provided service id is : ", service_id);

    fetch(`http://localhost:3000/api/getServiceItem/${service_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Get request failed');
        }
        return response.json();
      }).then(data => {

        if (data) {
          if (!is_edit) {
            displayServiceDetail(data[0]);
          }
          else {
            ShowEditOption(data[0]);
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function ShowEditOption(serviceItem) {

    if (serviceItem) {
      const title_ = serviceItem.title;
      const description = serviceItem.description;
      const imgSrc_ = serviceItem.image_url;

      ImagePreview.src = imgSrc_;
      editTitle.value = title_;
      editDesc.value = description;


      editModal.style.display = "flex";
    }
  }

  function DisplayIntroData(userData) {
    const introField = document.getElementById("intro-data");
    const contactField = document.getElementById("contact-data");
    const emailField = document.getElementById("email-data");
    const nameField = document.getElementById("name-data");
    const designationField = document.getElementById("heading");
    const personImg = document.getElementById("person");
    const linkedInURL = document.getElementById("linkedin-data");


    introField.textContent = userData.intro;
    contactField.textContent = userData.contact;
    emailField.textContent = userData.email;
    nameField.textContent = userData.name;
    designationField.textContent = userData.designation;
    personImg.src = userData.picture;
    linkedInURL.setAttribute('href', userData.linkedin);

    (async () => {
      const workExp = await FetchWorkExpInfo();
      DisplayWorkExp(workExp);

    })();
  }

  function DisplayWorkExp(workExp) {

    const organizedData = {};
    workExp.forEach(entry => {
      if (!organizedData[entry.project_id]) {
        organizedData[entry.project_id] = {
          project_name: entry.project_name,
          detail_texts: [],
        };
      }
      organizedData[entry.project_id].detail_texts.push(entry.detail_text);
    });

    const workExpContainer = document.getElementById("workexp");
    workExpContainer.style.marginBottom = "-50px";


    for (const project_id in organizedData) {
      if (organizedData.hasOwnProperty(project_id)) {
        const projectData = organizedData[project_id];
        const projectDiv = document.createElement('div');
        projectDiv.innerHTML += `<h4>${project_id}. ${projectData.project_name}</h4>`;

        const ul = document.createElement('ul');
        projectData.detail_texts.forEach(detail_text => {
          const li = document.createElement('li');
          li.textContent = detail_text;
          li.style.marginBottom = "10px";
          ul.appendChild(li);
        });
        projectDiv.style.margin = "50px";

        projectDiv.appendChild(ul);
        workExpContainer.appendChild(projectDiv);
      }
    }




  }

  async function fetchImageAsFile(imagePath) {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();

      // Extract the file name from the image path
      const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);

      // Create a File object with the blob and a filename
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null; // Return null on error
    }
  }


});


