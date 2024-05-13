import editImage from '../../images/icon-edit.svg';
import deleteImage from '../../images/icon-delete.svg';
import acceptImage from '../../images/icon-check.svg';
import declineImage from '../../images/icon-cancel.svg';
import './Task.css';
import { useState, useRef } from 'react';
import {
	ERRORS
} from '../../utils/constants';

export const Task = ({id, text, onDelete, setNewData, needUpdate, setNeedUpdate})  => {
	const [taskText, setTaskText] = useState(text);
	const [isEdited, setIsEdited] = useState(false);
	const [editError, setEditError] = useState(false);
	const inputRef = useRef(null);
	const onEditHandler = () => {
		inputRef.current.focus();
		setIsEdited(true);
	};
	const onSave = () => {
		let error = false;
		if (!taskText) {
			error = ERRORS.EMPTY;
		} else if (taskText.length <= 3) {
			error = ERRORS.MIN_LENGTH;
		} else if (taskText.length > 30) {
			error = ERRORS.MAX_LENGTH;
		}
		if (!error) {
			setNewData({id: id, text: taskText});
			setNeedUpdate(()=>!needUpdate);
			setIsEdited(false);
		} else {
			setEditError(error);
		}
	};
	const onBlurHandler = (evt) => {
		if (!evt.relatedTarget || evt.relatedTarget.value !== String(id)) {
			setTaskText(text);
			setIsEdited(false);
		}
	};
	const onDecline = () => {
		setEditError(false);
		setTaskText(text);
		setIsEdited(false);
	};
	const chengeHandler = ({target}) => {
		setEditError(false);
		setTaskText(target.value);
	};
	return (
		<li className="task-item" key={'key_' + id}>
			<button className="task-item__status" aria-label="Кнопка"></button>
			<input
				id="edit-task"
				className="task-item__input"
				value={taskText} type="text"
				onChange={chengeHandler}
				onBlur={onBlurHandler}
				readOnly={!isEdited}
				ref={inputRef} />
			{ editError && (<div className="task-item__error">{editError}</div>)}
			<div className="task-item__burger">
				<span className="task-item__dot"></span>
				<span className="task-item__dot"></span>
				<span className="task-item__dot"></span>
			</div>
			<div className="task-item__panel">
				<button
					className="task-item__btn task-item__btn--edit"
					aria-label="Редактировать"
					title="Редактировать"
					onClick={onEditHandler}>
					<img src={editImage} alt="Edit" />
				</button>
				<button
					className="task-item__btn task-item__btn--delete"
					aria-label="Удалить"
					title="Удалить"
					onClick={() => onDelete(id)}>
					<img src={deleteImage} alt="Delete" />
				</button>
			</div>
			<div className={`task-item__panel task-item__panel--edit ${ isEdited ? 'show' : '' }`}>
				<button
					className="task-item__btn task-item__btn--accept"
					aria-label="Сохранить"
					title="Сохранить"
					value={id}
					onClick={onSave}>
					<img src={acceptImage} alt="Сохранить" />
				</button>
				<button
					className="task-item__btn task-item__btn--decline"
					aria-label="Отменить"
					title="Отменить"
					value={id}
					onClick={onDecline}>
					<img src={declineImage} alt="Отменить"/>
				</button>
			</div>
		</li>
	);
};
