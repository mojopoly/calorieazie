// Storage Controller
const StorageCtrl = (function() {

  return {
   storeItem: function(item) {
    let items;

    if(localStorage.getItem('items') === null) {
      items = []
      items.push(item)
      localStorage.setItem('items', JSON.stringify(items))

    } else {
      items = JSON.parse(localStorage.getItem('items'));
      items.push(item)
      localStorage.setItem('items', JSON.stringify(items))
    }
   },
   deleteItemFromStorage: function(id) {
    let items = JSON.parse(localStorage.getItem('items'))
    items.forEach((item, index) => {
      if(item.id === id) {
        items.splice(index, 1)
      }
    })
    localStorage.setItem('items', JSON.stringify(items))
   },
   updateItemInStorage: function(itemToUpdate) {
    let items = JSON.parse(localStorage.getItem('items'))
    items.forEach((item, index) => {
      if(item.id === itemToUpdate.id) {
        // item.name = itemToUpdate.name,
        // item.calories = itemToUpdate.calories
        items.splice(index, 1, itemToUpdate)
      }
    })
    localStorage.setItem('items', JSON.stringify(items))
   },
   clearAllFromLocalStorage: function() {
    localStorage.removeItem('items')
   },
   getItemsFromStorage: function() {
     let items;
     if(localStorage.getItem('items') === null) {
      items = []
     } else {
       items = JSON.parse(localStorage.getItem('items'))
     }
     return items
   } 
  }
})()

// Item Controller
const ItemCtrl = (function() {

  //Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name= name;
    this.calories = calories;
  }

  // Data structure / State
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }


  //Public mthods
  return {
    getItems: function() {
      return data.items
    },
    addItem: function(name, calories) {
      // Create ID
      let ID;
      
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0
      }
      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories)

      // Add to Items array
      data.items.push(newItem)

      return newItem
    },

    getTotalCalories: function() {
      let total = 0;

      data.items.forEach(item => {
        total += item.calories
      })

      // Set total cal in data structure
      data.totalCalories = total;

      return data.totalCalories
    },
    getItemById: function(id) {
      let found = null;
      // found = data.items.filter(item => item.id === id)
      data.items.forEach(item => {
        if(item.id === id) found = item;
      })
      return found
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories)
      let found = null;
      data.items.forEach(item => {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        } 
      })
      return found
    },
    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map(item => {
        return item.id
      })
      // Get index
      const index = ids.indexOf(id)
      
      // Remove the item
      data.items.splice(index, 1)

    },
    deleteAll: function() {
      data.items = []
    },
    logData: function() {
      return data;
    }
  }
})()




// UI Controller
const UICtrl = (function() {
  
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clrAll: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  }



  //Public methods
  return{
    populateItemList: function(items) {
      let html = '';

      items.forEach((item) => {
        html += `
            <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `
      })
      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // Create li element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id=`item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);  
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState()
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      // Turn Node list into array
      listItems = Array.from(listItems)

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id')
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`
        }
      })
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID)
      item.remove()
    },
    deleteAllListItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems)

      listItems.forEach(listItem => {
        listItem.remove()
      })
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function() {
      return UISelectors
    }
  }
})()



 

// App Controller
const App = (function(ItemCtrl,StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // DIsable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault()
        return false
      }
    })

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState())


    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

    // Clear all event
    document.querySelector(UISelectors.clrAll).addEventListener('click', itemClearAllSubmit)

  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput()


    // Check for name and calorie input
    if(input.name && input.calories) {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      // Add item to UI list
      UICtrl.addListItem(newItem)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      //Add total cal to UI
      UICtrl.showTotalCalories(totalCalories)

      //Store in localStorage
      StorageCtrl.storeItem(newItem)

      // Clear fields
      UICtrl.clearInput()
    }

    e.preventDefault()
  }

  // Click edit item
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      const listId = e.target.parentElement.parentElement.id;

      //Break into an array
      const listIdArr = listId.split('-')

      // Get the actual id
      const id = parseInt(listIdArr[1])

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id)
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit)

      // Show edit state
      UICtrl.addItemToForm()
    }
    e.preventDefault()
  }



  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
    
    // Update UI
    UICtrl.updateListItem(updatedItem)

    // Update Local Storage
    StorageCtrl.updateItemInStorage(updatedItem)


    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    //Add total cal to UI
    UICtrl.showTotalCalories(totalCalories)

    UICtrl.clearEditState()

    e.preventDefault()
  }

  // Delete button event
  const itemDeleteSubmit = function(e) {

    // Get curret item
    const currentItem = ItemCtrl.getCurrentItem()

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id)

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id)

    // Delete from Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    //Add total cal to UI
    UICtrl.showTotalCalories(totalCalories)

    UICtrl.clearEditState()

    e.preventDefault()
  }


  // Clear ALL button
  const itemClearAllSubmit = function(e) {

    ItemCtrl.deleteAll()

    UICtrl.deleteAllListItems()

    StorageCtrl.clearAllFromLocalStorage()

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    //Add total cal to UI
    UICtrl.showTotalCalories(totalCalories)

    UICtrl.clearEditState()

    UICtrl.hideList()

    e.preventDefault()
  }





  // Public methods
  return {
    init: function() {
      // Clear edit state / set initial set
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();


      // Check if any items
      if(!items.length){
        UICtrl.hideList()
      }else {
        // Populate list with items
        UICtrl.populateItemList(items)
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //Add total cal to UI
        UICtrl.showTotalCalories(totalCalories)
      }

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl)


//Init App
App.init()