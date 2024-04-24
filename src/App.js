// import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';

export const App = () => {
	const [TodoList, setTodoList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		fetch('https://jsonplaceholder.typicode.com/todos')
		.then((loadedData) => loadedData.json())
		.then((loadedTodos) => {
			setTodoList(loadedTodos);
		})
		.finally(() => {
			setIsLoading(false);
			setRefreshTodoListFlag(false)
		});
	}, [refreshTodoListFlag]);

	return (
		<div className="app">
			<main className="app-main">
				<h1 class="app-title">Team ToDo Example</h1>
				<div className="app-container">
					<h3 className="app-caption">
						Everyone
					</h3>
					{ isLoading
						? <div className="loader"></div>
						: <ul className="app-list">
							{
							TodoList.map(({userId, id, title}) =>  (
								<li className="app-item" key={ userId + '_' + id }>
									<button className="app-button" aria-label="Кнопка"></button>
									{ title }
								</li>
							))
							}
						</ul>
					}
				</div>
			</main>
		</div>
	);
};
