$(document).ready(function() {
  $(document).ready(fetchItems);
  $('.submit').on('click', sumbitItem);
  $('.items-container').on('click', '.delete-item', deleteItem)
  $('.items-container').on('click', '.checkbox', toggleStatus)
})

const fetchItems = async () => {
  const response = await fetch('/api/v1/items');
  const items = await response.json();
  await items.forEach(item => {
    prependItems(item)
  })
}

const prependItems = item => {
  console.log(item)
  if (item.status === true) {
    $('.items-container').prepend(`
      <div class="item item-${item.id}">
        <h2 class="item-name">${item.name}</h2>
        <button class="delete-item">Delete</button>
        <input type="checkbox" name="packed" class='checkbox checked-${item.status}' checked>
        <label>Packed</label>
      </div>
    `)
  } else {
    $('.items-container').prepend(`
      <div class="item item-${item.id}">
        <h2 class="item-name">${item.name}</h2>
        <button class="delete-item">Delete</button>
        <input type="checkbox" name="packed" class='checkbox checked-${item.status}'>
        <label>Packed</label>
      </div>
    `)
  }
}

const sumbitItem = async (e) => {
  e.preventDefault();
  const itemName = $('.item-input').val();
  const item = {name: itemName, status: 'false'};
  const response = await fetch('api/v1/items', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ item })
  });
  const itemId = await response.json()
  item.id = itemId.id;
  prependItems(item);
  $('.item-input').val('');
  $('.item-input').focus();
}

const deleteItem = function() {
  const itemId = $(this).closest('.item')[0].classList[1].split('-')[1];
  fetch(`/api/v1/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    }
  })
  $(this).closest('.item')[0].remove();
}

const toggleStatus = function() {
  const itemId = $(this).closest('.item')[0].classList[1].split('-')[1];
  let currentStatus = $(this)[0].classList[1].split('-')[1];
  debugger
  if(currentStatus === false || currentStatus === 'false') {
    currentStatus = 'true'
  } else {
    currentStatus = 'false'
  }
  console.log(currentStatus)
  
  fetch(`/api/v1/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({item: {status: currentStatus}})
  })
 
}