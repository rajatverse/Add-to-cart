import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-f63e5-default-rtdb.asia-southeast1.firebasedatabase.app"
}

// initialize the database connection
const app = initializeApp(appSettings);

const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

let inputFieldEl = document.getElementById('input-field');
let addButtonEl = document.getElementById('add-button');
let shoppingListEl = document.getElementById('shopping-list');

addButtonEl.addEventListener('click', function() {
    let inputValue = inputFieldEl.value;

    push(shoppingListInDB, inputValue);

    console.log(`${inputValue} added to database`);

    clearInputFieldEl();
})

onValue(shoppingListInDB, function(snapshot) {

    if(snapshot.exists(true)){

    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
        let currentItem = itemsArray[i];
        let currentItemID = currentItem[0];
        let currentItemValue = currentItem[1];

        appendItemToShoppingListEl(currentItem);
    }
} else {
    shoppingListEl.innerHTML = "No Items available..."
}
})

function clearInputFieldEl(){
    inputFieldEl.value = "";
}

function clearShoppingListEl(){
    shoppingListEl.innerHTML = "";
}

function appendItemToShoppingListEl(item){
    // shoppingListEl.innerHTML += `<li>${itemValue}</li>`;

    let itemId = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");

    newEl.textContent = itemValue;

    newEl.addEventListener("dblclick", function(){
        // console.log(itemId);

        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);

        remove(exactLocationOfItemInDB);
        
    })

    shoppingListEl.append(newEl);
}