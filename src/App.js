import { useState, useEffect } from 'react';
import './App.css';
import { Task } from './components/Task/Task';
import { TaskForm } from './components/form/TaskForm';

const INITIAL_FORM_STATE = {
	task: '',
	error: '',
};

const ERRORS = {
	EMPTY: 'Поле обязательно для заполнения',
	MIN_LENGTH: 'слишком короткое описание',
	MAX_LENGTH: 'слишком длинное описание задачи',
};

export const App = () => {
	const [formData, setFormData] = useState(INITIAL_FORM_STATE);
	const [TodoList, setTodoList] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [updatedItem, setUpdatedItem] = useState({});
	const [needUpdate, setNeedUpdate] = useState(false);
	const [isCreated, setIsCreated] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const [isUpdated, setIsUpdated] = useState(false);

	const postData = (data) => {
		setIsCreated(true);
		fetch('http://localhost:3005/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				text: data,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				updatingList();
			});
	};

	const deleteData = (id) => {
		setIsDeleted(true);
		fetch('http://localhost:3005/todos/' + id, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				updatingList();
			})
			.finally(() => setIsDeleted(false));
	};

	const updatingList = () => setRefreshTodoListFlag(!refreshTodoListFlag);

	useEffect(() => {
		setIsLoading(true);
		console.log('start');
		fetch('http://localhost:3005/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodoList(loadedTodos);
			})
			.finally(() => {
				setIsLoading(false);
				setIsCreated(false);
			});
	}, [refreshTodoListFlag]);

	useEffect(() => {
		if (!updatedItem.id) return;
		setIsUpdated(true);
		fetch('http://localhost:3005/todos/' + updatedItem.id, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				text: updatedItem.text,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				updatingList();
			});
	}, [needUpdate]);

	const addTask = (event) => {
		event.preventDefault();
		const currentState = { ...formData };
		if (!currentState.task.length) {
			currentState.error = ERRORS.EMPTY;
		} else if (currentState.task.length <= 3) {
			currentState.error = ERRORS.MIN_LENGTH;
		} else if (currentState.task.length > 30) {
			currentState.error = ERRORS.MAX_LENGTH;
		}
		if (!currentState.error) {
			setFormData({ ...currentState, task: '' });
			postData(currentState.task);
		} else {
			setFormData(currentState);
		}
	};

	const searchTask = (event) => {
		event.preventDefault();
		const currentState = { ...formData };
		if (!currentState.task.length) {
			currentState.error = ERRORS.EMPTY;
		}
		setFormData(currentState);
	};

	return (
		<div className="app">
			<main className="app-main">
				<h1 className="app-title">ToDo List (JSON Server)</h1>
				<div className="app-container">
					<TaskForm
						data={formData}
						setData={setFormData}
						add={addTask}
						search={searchTask}
					/>
					<h3 className="app-caption">Tasks</h3>
					{isLoading ? (
						<div className="loader"></div>
					) : (
						<ul className="app-list">
							{TodoList.map(({ id, text }) => (
								<Task
									key={'task-' + id}
									id={id}
									text={text}
									onDelete={deleteData}
									setNewData={setUpdatedItem}
									needUpdate={needUpdate}
									setNeedUpdate={setNeedUpdate}
								/>
							))}
						</ul>
					)}
				</div>
			</main>
		</div>
	);
};
