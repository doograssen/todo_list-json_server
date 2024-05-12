import { useState, useEffect } from 'react';
import './App.css';
import { Task } from './components/Task/Task';
import { TaskForm } from './components/TaskForm/TaskForm';
import { Header } from './components/Header/Header';
import {
	ERRORS,
	INITIAL_FORM_STATE,
	SORT_INDEX,
} from './components/utils/constants';

export const App = () => {
	const [formData, setFormData] = useState(INITIAL_FORM_STATE);
	const [todoList, setTodoList] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [updatedItem, setUpdatedItem] = useState({});
	const [needUpdate, setNeedUpdate] = useState(false);
	const [isCreated, setIsCreated] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const [isUpdated, setIsUpdated] = useState(false);
	const [sortStatus, setSortStatus] = useState('DEFAULT');

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
		fetch('http://localhost:3005/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				if (loadedTodos) {
					loadedTodos = sortList(loadedTodos, SORT_INDEX[sortStatus]);
				}
				setTodoList(loadedTodos);
				if (searchResult.length) {
					searchTask(formData.task, loadedTodos);
				}
			})
			.finally(() => {
				setIsLoading(false);
				setIsCreated(false);
			});
	}, [refreshTodoListFlag, sortStatus]);

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
			})
			.finally(() => {
				setIsUpdated(false);
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

	const searchTask = (text, list) => {
		const result = list.filter((element) => {
			return element.text.includes(text);
		});
		setSearchResult(result);
		if (!result.length) {
			setFormData({ ...formData, error: ERRORS.NO_RESULT });
		}
	};

	const onSearch = (event) => {
		event.preventDefault();
		const currentState = { ...formData };
		if (!currentState.task.length) {
			currentState.error = ERRORS.EMPTY;
		}
		setFormData(currentState);
		if (!currentState.error) {
			searchTask(currentState.task, todoList);
		}
	};

	const sortList = (list, index) => {
		list.sort((a, b) => (a.text < b.text ? index : index * -1));
		return list;
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
						search={onSearch}
					/>
					<Header
						sortList={sortList}
						searchLength={searchResult.length}
						setResult={setSearchResult}
						sortStatus={sortStatus}
						setSortStatus={setSortStatus}
					/>
					{isLoading || isCreated || isDeleted || isUpdated ? (
						<div className="loader"></div>
					) : (
						<ul className="app-list">
							{searchResult.length
								? searchResult.map(({ id, text }) => (
										<Task
											key={'task-' + id}
											id={id}
											text={text}
											onDelete={deleteData}
											setNewData={setUpdatedItem}
											needUpdate={needUpdate}
											setNeedUpdate={setNeedUpdate}
										/>
									))
								: todoList.map(({ id, text }) => (
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
