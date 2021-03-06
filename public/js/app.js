import React, { Component } from 'react';
import ToDoItem from './todoitem.js';

class App extends Component {


        initial(){
            var ENTER_KEY = 13;
        }

        getInitialState() {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: ''
			};
		}

		componentDidMount() {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});
			router.init('/');
		}

		handleChange(event) {
			this.setState({newTodo: event.target.value});
		}

		handleNewTodoKeyDown(event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.props.model.addTodo(val);
				this.setState({newTodo: ''});
			}
		}

		toggleAll(event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		}

		toggle(todoToToggle) {
			this.props.model.toggle(todoToToggle);
		}

		destroy(todo) {
			this.props.model.destroy(todo);
		}

		edit(todo) {
			this.setState({editing: todo.id});
		}

		save(todoToSave, text) {
			this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		}

		cancel() {
			this.setState({editing: null});
		}

		clearCompleted() {
			this.props.model.clearCompleted();
		}

		render() {
			var footer;
			var main;
			var todos = this.props.model.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (todos.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
					
				);
			}

			return (
				<div>
					<header className="header">
						<h1>Welcome to the TO-DO App</h1>
						<input
							className="new-todo"
							placeholder="Add new task"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
					</header>
					{main}
					<input class="logoutButton" name="logoutSubmit" type="submit" id="submitButtonLogout" value="Logout"/>
				</div>
				
			);
		}


}

export default App;