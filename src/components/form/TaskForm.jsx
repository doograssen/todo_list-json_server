import plusImage from '../../images/icon-plus.svg';
import searchImage from '../../images/icon-search.svg';
import './TaskForm.css';

export const TaskForm = ({data, setData, add, search}) => {

	const changeHandler = ({ target }) => {
		setData({...data, task: target.value});
	};

	const clearError = () => {
		setData({...data, error: false});
	}

	return (
		<form className="task-form">
			<input
				id="task-input"
				className="task-form__input"
				type="text"
				name="task"
				placeholder="Введите задачу/текст для поиска"
				onFocus={clearError}
				value={data.task}
				onChange={changeHandler}
			/>
			{data.error && (
				<div className="task-form__error">{data.error}</div>
			)}
			<button
				className="task-form__submit"
				type="submit"
				// disabled={!isValid || isCreated}
				aria-label="Добавить"
				onClick={add}
			>
				<img src={plusImage} alt="Добавить" />
			</button>
			<button
				className="task-form__search"
				type="submit"
				// disabled={!isValid || isCreated}
				aria-label="Поиск"
				onClick={search}
			>
				<img src={searchImage} alt="Найти" />
			</button>
		</form>
	);
};
