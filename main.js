let todoItems = [];

function renderTodo(todo) {
	localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));
	const list = document.querySelector(".js-todo-list");
	const item = document.querySelector(`[data-key='${todo.id}']`);

	if (todo.deleted) {
		item.remove();
		if (todoItems.length === 0) list.innerHTML = "";
		return;
	}

	const isChecked = todo.checked ? "done" : "";
	const node = document.createElement("li");
	node.setAttribute("class", `todo-item ${isChecked}`);
	node.setAttribute("data-key", todo.id);
	node.innerHTML = `
		<input id="${todo.id}" type="checkbox"/>
		<label for="${todo.id}" class="tick js-tick"></label>
		<span>${todo.text}</span>
		<button class="delete-todo js-delete-todo">
		<svg><use href="#delete-icon"></use></svg>
		</button>
	`;

	if (item) {
		list.replaceChild(node, item);
	} else {
		list.append(node);
	}
}

function addTodo(text) {
	const todo = {
		text,
		checked: false,
		id: Date.now(),
	};

	todoItems.push(todo);
	renderTodo(todo);
}

// Select the form element
const form = document.querySelector(".js-form");
// Add a submit event listener
form.addEventListener("submit", (event) => {
	// Prevent page refresh on form submission
	event.preventDefault();
	// select the text input
	const input = document.querySelector(".js-todo-input");

	// Get the value of the input and remove whitespace
	const text = input.value.trim();
	if (text !== "") {
		addTodo(text);
		input.value = "";
		input.focus();
	}
});

// Select the entire list
const list = document.querySelector(".js-todo-list");
// Add a click event listener to the list and its children
list.addEventListener("click", (event) => {
	if (event.target.classList.contains("js-tick")) {
		const itemKey = event.target.parentElement.dataset.key;
		toggleDone(itemKey);
	}

	if (event.target.classList.contains("js-delete-todo")) {
		const itemKey = event.target.parentElement.dataset.key;
		deleteTodo(itemKey);
	}
});

function toggleDone(key) {
	// findIndex is an array method that returns the position of an element
	// in the array.
	const index = todoItems.findIndex((item) => item.id === Number(key));
	todoItems[index].checked = !todoItems[index].checked;
	renderTodo(todoItems[index]);
}

function deleteTodo(key) {
	const index = todoItems.findIndex((item) => item.id === Number(key));
	const todo = {
		deleted: true,
		...todoItems[index],
	};

	todoItems = todoItems.filter((item) => item.id !== Number(key));
	renderTodo(todo);
}

document.addEventListener("DOMContentLoaded", () => {
	const ref = localStorage.getItem("todoItemsRef");
	if (ref) {
		todoItems = JSON.parse(ref);
		todoItems.forEach((t) => {
			renderTodo(t);
		});
	}
});
