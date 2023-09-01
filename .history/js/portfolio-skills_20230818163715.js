const skillsDataset = ["Web development", "Backend Integration", "RESTful API creation"];

document.addEventListener("DOMContentLoaded", function () {

  const skillItems = document.getElementById("skill-items");
  const addNewSkill = document.getElementById("add-skill-label");
  const titleInputField = document.getElementById("add-skill-input");
  const removeitemsList = document.querySelectorAll(".remove-skill");
  const ul = document.getElementById("skill-list");


  //populating initial data...
  AddSkillItem(skillsDataset);


  for (const removeBtn of removeitemsList) {
    removeBtn.addEventListener("click", function (event) {
      RemoveSkillItem(event);
    });

  }



  addNewSkill.addEventListener("click", EnableSkillInput)
  function EnableSkillInput() {

    addNewSkill.style.display = "none";
    titleInputField.style.display = "flex"
    titleInputField.focus()


    titleInputField.addEventListener("keyup", function (event) {

      if (event.key === "Escape") {
        addNewSkill.style.display = "flex";
        titleInputField.value = ""
        titleInputField.style.display = "none"
      }
      if (event.key === "Enter") {

        if (titleInputField.value.length > 0) {
          AddSkillItem([titleInputField.value]);
        }
        addNewSkill.style.display = "flex";
        titleInputField.value = ""
        titleInputField.style.display = "none"
      }
    });
  }

  function AddSkillItem(skillsArr) {

    for (item in skillsArr) {
      const newSkillElement = document.createElement('div');

      const labelSkillName = document.createElement('label');
      labelSkillName.className = "title-skill";
      labelSkillName.textContent = skillsArr[item];


      const imgRemoveSkill = document.createElement('img');
      imgRemoveSkill.className = "remove-skill";
      imgRemoveSkill.src = "res/ic_close.png";
      imgRemoveSkill.width = "30px";
      imgRemoveSkill.height = "30px";
      imgRemoveSkill.addEventListener("click", function (event) {


        RemoveSkillItem(event);

      });

      newSkillElement.appendChild(labelSkillName);
      newSkillElement.appendChild(imgRemoveSkill);

      const li = document.createElement('li');
      li.appendChild(newSkillElement)

      ul.appendChild(li);

      if (skillsDataset.includes(skillsArr[item]) === false) { skillsDataset.push(skillsArr[item]); }

      console.log(skillsDataset);
    }

  }


  function RemoveSkillItem(event) {

    const childNode = event.target;
    const parentNode = childNode.parentNode.parentNode.parentNode;
    var index = Array.prototype.indexOf.call(parentNode.children, childNode.parentNode.parentNode);


    ul.removeChild(ul.children[index]);


    if (index === 0) { skillsDataset.shift() }//removes first list item.
    else if (index === (skillsDataset.length-1)) { skillsDataset.pop() } //removes last list item.
    else { console.log(skillsDataset.splice(index, 1)); } // removes item from any random location selected by user in the list.


    console.log(skillsDataset);

  }

});



