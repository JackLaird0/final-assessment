$(document).ready(function() {
  $(document).ready(fetchItems)
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