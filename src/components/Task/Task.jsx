import editImage from '../../images/icon-edit.svg';
import deleteImage from '../../images/icon-delete.svg';
import './Task.css';
import { useState, useRef } from 'react';

export const Task = ({id, text, onDelete, setNewData, needUpdate, setNeedUpdate})  => {
	const [taskText, setTaskText] = useState(text);
	const [isEdited, setIsEdited] = useState(false);
	const inputRef = useRef(null);
	const onEditHandler = () => {
		let newState = !isEdited;
		if (newState) {
			inputRef.current.focus();
		}
		else {
			setNewData({id: id, text: taskText});
			setNeedUpdate(()=>!needUpdate);
		}
		setIsEdited(newState);
	};
	const onBlurHandler = (evt) => {
		if (!evt.relatedTarget || evt.relatedTarget.value != id) {
			setTaskText(text);
			setIsEdited(false);
		}
	};
	return (
		<li className="task-item" key={'key_' + id}>
			<button className="task-item__button" aria-label="Кнопка"></button>
			<input
				id="edit-task"
				className="task-item__input"
				value={taskText} type="text"
				onChange={({target}) => setTaskText(target.value)}
				onBlur={onBlurHandler}
				readOnly={!isEdited}
				ref={inputRef} />
			<div className="task-item__burger">
				<span className="task-item__dot"></span>
				<span className="task-item__dot"></span>
				<span className="task-item__dot"></span>
			</div>
			<div className="task-item__panel">
				<button
					className="task-item__edit"
					aria-label="Редактировать"
					value={id}
					onClick={onEditHandler}>
					<img src={editImage} alt="Edit" />
				</button>
				<button className="task-item__delete" aria-label="Удалить" onClick={() => onDelete(id)}>
					<img src={deleteImage} alt="Delete" />
				</button>
			</div>
		</li>
	);
};
