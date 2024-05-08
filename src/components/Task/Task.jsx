import editImage from '../../images/icon-edit.svg';
import deleteImage from '../../images/icon-delete.svg';

export const Task = ({id, text})  => {
	return (
		<li className="app-item" key={'key_' + id}>
			<button className="app-button" aria-label="Кнопка"></button>
			{text}
			<button className="app-burger" aria-label="Контекстное меню">
				<span className="app-dot"></span>
				<span className="app-dot"></span>
				<span className="app-dot"></span>
			</button>
			<div className="app-panel">
				<button className="app-edit" aria-label="Редактировать">
					<img src={editImage} alt="Edit" />
				</button>
				<button className="app-delete" aria-label="Удалить">
					<img src={deleteImage} alt="Delete" />
				</button>
			</div>
		</li>
	);
};
