$(document).ready(function() {
  $(document).ready(fetchItems);
  $('.submit').on('click', sumbitItem)
})

const fetchItems = async () => {
  const response = await fetch('/api/v1/items');
  const items = await response.json();
  await items.forEach(item => {
    prependItems(item)
  })
}

const prependItems = item => {
  $('.items-container').prepend(`
    <div class="item">
      <h2 class="item-name">${item.name}</h2>
      <button class="delete-item">Delete</button>
      <input type="checkbox" name="packed" id="packed">
      <label for="packed">Packed</label>
    </div>
  `)
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

  prependItems(item);
}