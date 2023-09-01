const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const jsonData = [
  {
    "id": "1slider",
    "title": "DEVELOP",
    "img": "res/ic_develop.png",
    "description": "We are a dedicated and proficient website development service provider, committed to crafting impactful online solutions for businesses across diverse industries. \n\nWith a team of skilled developers, designers, and digital strategists, we offer comprehensive website development services that transcend mere online presence.\n\nOur approach begins by understanding your unique business objectives and target audience. Leveraging cutting-edge technologies and industry best practices, we meticulously design and develop websites that are not only visually stunning but also functionally robust.\n\n From responsive designs that adapt seamlessly to different devices to user-friendly interfaces that enhance engagement, we ensure every element contributes to an exceptional user experience."
  },
  {
    "id": "2slider",
    "title": "TEST",
    "img": "res/ic_test.png",
    "description": "Our website testing services guarantee a flawless digital experience. \n\nOur adept team meticulously examines functionality, usability, compatibility, and security, ensuring your website performs seamlessly across devices and platforms. We identify and rectify glitches, optimize loading speeds, and fortify your site against cyber threats. \n\nDetailed reports and recommendations guide enhancements. \n\nWhether launching or refining a site, our testing ensures your digital presence aligns with your vision, providing users with a reliable, secure, and engaging platform."
  },
  {
    "id": "3slider",
    "title": "DEPLOY",
    "img": "res/ic_deploy.png",
    "description": "Our website deployment service offers a seamless transition from development to the online sphere, ensuring your website goes live flawlessly. \n\nWith a focus on efficiency and precision, we take the complexity out of the deployment process, enabling you to reach your audience without disruptions.Our experienced team leverages industry best practices to guarantee a smooth deployment. \n\nWe meticulously configure servers, databases, and hosting environments, optimizing performance and security. From managing domain configurations to handling SSL certificates, we ensure your website is fully functional and secure.We understand the importance of minimal downtime during deployment. \n\nOur strategies minimize disruption, and thorough testing after deployment guarantees that all components work seamlessly.\n\nWe provide comprehensive post-deployment support, resolving any unforeseen issues promptly."
  },
  {
    "id": "4slider",
    "title": "OPTIMIZE",
    "img": "res/ic_optimize.png",
    "description": "Our website optimization service is designed to enhance your online presence by maximizing performance, user experience, and conversion rates. \n\nWith a strategic blend of technical expertise and data-driven insights, we ensure your website operates at peak efficiency.Our team conducts in-depth performance analysis, identifying bottlenecks that might hinder loading speeds and overall responsiveness. We implement techniques like image compression, browser caching, and code minification to accelerate page loading times, ensuring visitors stay engaged.\n\nUser experience is paramount. We optimize navigation, improve mobile responsiveness, and enhance overall usability, resulting in higher visitor satisfaction.\n\nConversion-focused strategies include optimizing call-to-action placement and streamlining checkout processes for e-commerce sites. \n\nSearch engine visibility is amplified through on-page and technical SEO optimization. Our service also emphasizes security, implementing measures to safeguard user data and protect against cyber threats."
  }
];

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
  let newItemIndex = sliderItems.length - 1;

  var editInfoModal = document.getElementById("editModal");
  var globalSelectedServiceId = "";

  //Fetching initial data
  WriteServicesData();
  FetchUpdatedList();



  //header functions

  service.onclick = function () {
    itemsContainer.parentElement.scrollIntoView({ behavior: "smooth" });
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
    updateItem(globalSelectedServiceId, {
      "id": globalSelectedServiceId,
      "title": editTitle.value,
      "img": ImagePreview.src,
      "description": editDesc.value,
    });

    const selectedSliderItem = document.getElementById(globalSelectedServiceId).getElementsByClassName("slider-item");
    const itemImg = selectedSliderItem[0].querySelector('img')
    itemImg.src = ImagePreview.src;
    const itemtitle = selectedSliderItem[0].querySelector('h3')
    itemtitle.textContent = editTitle.value;


    FetchUpdatedList();
    editModal.style.display = "none";
  })

  editImg.addEventListener("change", () => {
    const imageFile = editImg.files[0];
    const blob = imageFile.slice();
    const reader = new FileReader();

    reader.onload = () => {
      ImagePreview.src = reader.result;
    };

    reader.readAsDataURL(blob);
  });

  //Displaying service item information for editing
  const editButtons = document.getElementsByClassName("edit-btn");
  for (const btn_ of editButtons) {
    btn_.addEventListener("click", editItem);
  }

  function editItem() {

    const selectedItem = event.target.closest(".slider-bg");
    const Item_ = GetItemById(selectedItem.id);
    globalSelectedServiceId = selectedItem.id;

    const title_ = Item_[0].title;
    const description = Item_[0].description;
    const imgSrc_ = Item_[0].img;

    ImagePreview.src = imgSrc_;
    editTitle.value = title_;
    editDesc.value = description;


    editModal.style.display = "flex";
  }





  document.getElementById("add-item").addEventListener("click", function () {
    addItem("", "", "", "");
  });
  const addItemDiv = document.getElementById("add-item-div");


  //Removing services Item
  const removeButtons = document.getElementsByClassName("remove-btn");
  for (const btn of removeButtons) {
    btn.addEventListener("click", removeItem);
  }
  function removeItem() {

    const selectedItem = event.target.closest(".slider-bg");
    deleteItemById(selectedItem.id);
    console.log(getAllItems());

    if (selectedItem) {
      selectedItem.remove();
    }

    FetchUpdatedList();

  }



  //Adding new services item dynamically in the list

  function addItem(a, b, c, d) {
    const container = document.getElementById("products-container");

    let id_;
    if (a === "") {
      id_ = getRandomNum(1, 10000, currentList) + "slider";
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
    addItemToDataSet({
      "id": id_,
      "title": title.textContent,
      "img": imgSrcVal,
      "description": descVal
    });

    FetchUpdatedList();
    console.log(getAllItems());

  }

  //fetches updated services list after every change
  function FetchUpdatedList() {
    sliderItems = document.getElementsByClassName("slider-item");

    for (const [index, item] of Object.entries(sliderItems)) {
      if (index < sliderItems.length - 1) {
        item.addEventListener("click", function () {
          displayData(parseInt(index));
        });
      }
    }
  }


  //display list with items information
  function displayData(itemID) {

    const itemSelected = getItemByIndex(itemID);

    let productImage = document.getElementById("product-img");
    let productTitle = document.getElementById("product-title");
    let productDescription = document.getElementById("product-description");

    if (itemSelected) {
      productImage.src = itemSelected.img;
      productTitle.textContent = itemSelected.title;
      productDescription.textContent = itemSelected.description;
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
  function WriteServicesData() {
    deleteAll();
    addItemToDataSet(jsonData[0]);
    addItemToDataSet(jsonData[1]);
    addItemToDataSet(jsonData[2]);
    addItemToDataSet(jsonData[3]);

  }

  function addItemToDataSet(dataItem) {
    const existingData = JSON.parse(localStorage.getItem('items')) || [];
    existingData.push(dataItem);
    localStorage.setItem('items', JSON.stringify(existingData));
  }

  function getAllItems() {
    return JSON.parse(localStorage.getItem('items')) || [];
  }

  function GetItemById(id) {
    const items = getAllItems();
    const fetchedItem = items.filter(item => item.id == id);
    return fetchedItem;
  }

  function getItemByIndex(index) {
    const items = getAllItems();

    if (index >= 0 && index < items.length) {
      return items[index];
    }
    return null;
  }


  function deleteItemById(id) {
    const items = getAllItems();
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  }


  function updateItem(id, updatedItem) {
    const items = getAllItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = updatedItem;
      localStorage.setItem('items', JSON.stringify(items));
    }
  }

  function deleteAll() {
    localStorage.clear();
  }


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
  // const searchDropdown = document.getElementById("search-dropdown");
  let isSearchFocused = false;
  let titles = [];

  searchLabel.addEventListener("click", () => {

    EnableSearch();
  });

  searchImage.addEventListener("click", () => {

    DisableSearch();

  });

  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {


      FilterData(searchInput.value);

      // Add search functionality here.
    }
  });

  searchInput.addEventListener("click", (e) => {
    // e.preventDefault();
  })
  // searchInput.addEventListener("focusout", () => {
  //   DisableSearch();
  //   // searchDropdown.style.display = "none";
  //   // searchDropdown.removeChild([]);

  // })

  function EnableSearch() {
    searchLabel.style.display = "none";
    searchInput.style.display = "flex";
    searchInput.focus();
    searchImage.src = "res/ic_back.png";
    isSearchFocused = true;
    // FilterData();
  }

  function DisableSearch() {
    if (isSearchFocused) {
      searchLabel.style.display = "flex";
      searchInput.style.display = "none";
      searchInput.value = "";
      searchImage.src = "res/ic_search.png";
      isSearchFocused = false;
      FillSliderData();
    }
    else {
      EnableSearch();
    }
  }

  function FilterData(inputData) {

    SearchSliderList(inputData);

    // GetUpdatedData();

    // FillDataInDropDown(titles);


  }

  function GetUpdatedData() {

    titles = [];
    for (const item of getAllItems()) {
      titles.push(item.title);
    }
    return titles;

  }

  function FillDataInDropDown(titlesList) {

    // searchDropdown.replaceChildren([]);


    for (const title of titlesList) {
      var titleItem = document.createElement('p')
      titleItem.textContent = title;
      titleItem.className = "dropdown-item";
      titleItem.addEventListener("click", () => {
        EnableSearch();
        searchInput.value = title;
        // searchDropdown.style.display = "none";
        // searchDropdown.replaceChildren([]);

        // SearchSliderList(title);
      })
    //   searchDropdown.appendChild(titleItem);
    // }
    // searchDropdown.style.display = "block";

  }
}

  function SearchSliderList(title) {

    sliderItems = document.getElementsByClassName("slider-item");

    for (const [index, item] of Object.entries(sliderItems)) {
      if (index < sliderItems.length - 1) {


        let itemTitle = document.getElementsByClassName("item-title");

        if (itemTitle[index].textContent !== title) {

          // deleteItemById(itemTitle[index].parentElement.parentElement.id);
          itemsContainer.removeChild(itemTitle[index].parentElement.parentElement);
          FetchUpdatedList();
          SearchSliderList(title);
        }

      }
    }
  }

  function FillSliderData() {


    for (const [index, contItem] of Object.entries(itemsContainer.children)) {
      if (index < itemsContainer.children.length - 1) {
        itemsContainer.removeChild(contItem);
        deleteItemById(contItem.id);
      }
    }

    for (const item of getAllItems()) {
      addItem(item.id, item.title, item.img, item.description)
    }

  }


  // searchInput.addEventListener("input", function (event) {
  //   var substring = event.target.value;
  //   titles = GetUpdatedData();
  //   const filteredTitles = titles.filter(function (string) {
  //     return (string.toLowerCase()).includes((substring.toLowerCase()));
  //   });

  //   titles = filteredTitles;
  //   FillDataInDropDown(titles);
  //   // if (!titles.isEmpty()) {
  //   //   searchDropdown.style.display = 'block';
  //   //   FillDataInDropDown(titles);
      
  //   // }
  //   // else { searchDropdown.style.display = 'none'; }
  // });

});


