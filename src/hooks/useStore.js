import {
	ERRORS,
	INITIAL_FORM_STATE,
	SORT_INDEX,
} from '../utils/constants';
import { useState, useEffect } from 'react';

export const useStore = () => {
	const [formData, setFormData] = useState(INITIAL_FORM_STATE);
	const [todoList, setTodoList] = useState([]);
	const [searchState, setSearchState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [updatedItem, setUpdatedItem] = useState({});
	const [needUpdate, setNeedUpdate] = useState(false);
	const [isCreated, setIsCreated] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const [isUpdated, setIsUpdated] = useState(false);
	const [sortStatus, setSortStatus] = useState('DEFAULT');

	const sortList = (list, index) => {
		list.sort((a, b) => (a.text < b.text ? index : index * -1));
		return list;
	};

	const loaderStatus = () => {
		return isLoading || isCreated || isDeleted || isUpdated;
	};

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
					console.log(sortStatus);
					loadedTodos = sortList(loadedTodos, SORT_INDEX[sortStatus]);
				}
				if (searchState) {
					searchTask(formData.task, loadedTodos);
				}
				else {
					setTodoList(loadedTodos);
				}
			})
			.catch((error) => {
				console.error(error);
				console.log('для запуска сервера выполните команду - json-server --watch ./src/db.json --port 3005');
			})
			.finally(() => {
				setIsLoading(false);
				setIsCreated(false);
			});
	}, [refreshTodoListFlag, sortStatus, searchState]);

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
		if (!result.length) {
			setFormData({ ...formData, error: ERRORS.NO_RESULT });
		}
		else {
			setSearchState(true);
			setTodoList(result);
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

	return {
		form: {
			getData: () => formData,
			setData: setFormData,
		},
		events: {
			add: addTask,
			search: onSearch,
			delete: deleteData,
		},
		getList: () => todoList,
		getStatus: (name) => {
			switch (name) {
				case 'search': return searchState;
				case 'sort': return sortStatus;
				case 'update': return needUpdate;
				default:
					return false;
			}
		},
		setNewItem: setUpdatedItem,
		setStatus: (name) => {
			switch (name) {
				case 'search': return setSearchState;
				case 'sort': return setSortStatus;
				case 'update': return setNeedUpdate;
				default:
					return undefined;
			}
		},
		getLoader: loaderStatus,
	};
};
