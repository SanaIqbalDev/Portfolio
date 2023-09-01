// const skillsDataset = ["Web development", "Backend Integration", "RESTful API creation"];

document.addEventListener("DOMContentLoaded", function () {

  const skillItems = document.getElementById("skill-items");
  const addNewSkill = document.getElementById("add-skill-label");
  const titleInputField = document.getElementById("add-skill-input");
  const removeitemsList = document.querySelectorAll(".remove-skill");
  const btnAddSkill = document.getElementById("add-skill-btn");
  const ul = document.getElementById("skill-list");


  //populating initial data...
  // for (const item of skillsDataset) {
  //   AddSkillItem(item);
  // }

  // add fetch api here 
  GetSkillsList();


  for (const removeBtn of removeitemsList) {
    removeBtn.addEventListener("click", function (event) {
      RemoveSkillItem(event);
    });

  }



  addNewSkill.addEventListener("click", EnableSkillInput);

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

  btnAddSkill.addEventListener("click", () => {

    if (titleInputField.value.length > 0) {
      AddSkillItem([titleInputField.value]);
    }
    addNewSkill.style.display = "flex";
    titleInputField.value = ""
    titleInputField.style.display = "none"
  });

  function showSkill(skill) {

    const newSkillElement = document.createElement('div');

    const labelSkillName = document.createElement('label');
    labelSkillName.className = "title-skill";
    labelSkillName.textContent = skill;


    const imgRemoveSkill = document.createElement('img');
    imgRemoveSkill.className = "remove-skill";
    imgRemoveSkill.src = "res/ic_close.png";
    imgRemoveSkill.width = "30px";
    imgRemoveSkill.height = "30px";
    imgRemoveSkill.addEventListener("click", function (event) {

      // RemoveSkillItem(event);

    });

    newSkillElement.appendChild(labelSkillName);
    newSkillElement.appendChild(imgRemoveSkill);

    const li = document.createElement('li');
    li.style.listStyle = 'none';
    li.appendChild(newSkillElement)

    ul.appendChild(li);

  }

  function AddSkillItem(skill) {

    showSkill(skill);

    addSkill(skill);

    // if (skillsDataset.includes(skillsArr[item]) === false) { skillsDataset.push(skillsArr[item]); }

    // console.log(skillsDataset);
    // }

  }


  function RemoveSkillItem(event) {

    const childNode = event.target;
    const parentNode = childNode.parentNode.parentNode.parentNode;
    var index = Array.prototype.indexOf.call(parentNode.children, childNode.parentNode.parentNode);


    ul.removeChild(ul.children[index]);


    if (index === 0) { skillsDataset.shift() }//removes first list item.
    else if (index === (skillsDataset.length - 1)) { skillsDataset.pop() } //removes last list item.
    else { console.log(skillsDataset.splice(index, 1)); } // removes item from any random location selected by user in the list.


    // console.log(skillsDataset);

  }


  async function GetSkillsList() {

    fetch(`http://localhost:3000/api/getSkills`, {
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
          for (const skill of data) {
            showSkill(skill.skill_name);
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }



  // Function to add a new skill
  async function addSkill(skillName) {
    const data = { skill_name: skillName };

    try {
      const response = await fetch('http://localhost:3000/api/addSkill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const newSkill = await response.json();
      console.log('Skill added:', newSkill);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Function to delete a skill by ID
  async function deleteSkill(skillId) {
    try {
      const response = await fetch(`http://localhost:3000/api/deleteSkill/${skillId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const deletedSkill = await response.json();
      console.log('Skill deleted:', deletedSkill);
    } catch (error) {
      console.error('Error:', error);
    }
  }



  // addSkill('JavaScript');
  // deleteSkill(1); 




});



