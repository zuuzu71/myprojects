const dateElement = document.getElementById('date');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filters = document.querySelectorAll('.filter-btn');
const itemsLeft = document.getElementById('items-left');
const clearCompleted = document.getElementById('clear-completed');
const emptyState = document.getElementById('empty-state');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString('en-US', options);
}

function renderTodos() {
  todoList.innerHTML = '';

  let filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    filteredTodos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.classList.toggle('completed', todo.completed);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.style.accentColor = todo.completed ? 'green' : 'gray';
      checkbox.addEventListener('change', () => toggleTodo(index));

      const span = document.createElement('span');
      span.textContent = todo.text;

      const actions = document.createElement('div');
      actions.classList.add('actions');

      const delBtn = document.createElement('button');
      delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      delBtn.addEventListener('click', () => deleteTodo(index));

      actions.appendChild(delBtn);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(actions);
      todoList.appendChild(li);
    });
  }

  updateItemsLeft();
}

function updateItemsLeft() {
  const count = todos.filter(todo => !todo.completed).length;
  itemsLeft.textContent = `${count} item${count !== 1 ? 's' : ''} left`;
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text !== '') {
    todos.push({ text, completed: false });
    saveTodos();
    todoInput.value = '';
    renderTodos();
  }
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

updateDate();
renderTodos();
