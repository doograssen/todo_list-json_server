import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './App.css';

const ERRORS = {
	EMPTY: 'Поле обязательно для заполнения',
	MIN_LENGTH: 'слишком короткое описание',
	MAX_LENGTH: 'слишком длинное описание задачи',
};

const EditScheme = yup.object().shape({
	edit: yup
		.string()
		.required(ERRORS.EMPTY)
		.min(8, ERRORS.MIN_LENGTH)
		.max(30, ERRORS.MAX_LENGTH),
});

export const App = () => {
	const [TodoList, setTodoList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);

	// Form.

	const onSubmit = (formData) => {
		console.log(formData);
	};

	const {
		register,
		handleSubmit,
		formState: { touchedFields, isValid, errors },
	} = useForm({
		defaultValues: {
			edit: '',
		},
		resolver: yupResolver(EditScheme),
		mode: 'onTouched',
	});



	// End of form

	useEffect(() => {
		setIsLoading(true);
		fetch('http://localhost:3005/todos')
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
				<h1 className="app-title">Team ToDo Example</h1>
				<div className="app-container">
					<form className="app-form" onSubmit={handleSubmit(onSubmit)}>
						<input
							id="edit"
							className="app-form-input"
							type="text"
							placeholder="Введите задачу"
							{...register('edit')}
						/>
						{errors.edit && <div className="form-error">{errors.edit?.message}</div>}
						<button className="app-form-submit" type="submit" disabled={!isValid}>Добавить</button>
					</form>
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
