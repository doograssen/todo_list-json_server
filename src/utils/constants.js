export const INITIAL_FORM_STATE = {
	task: '',
	error: '',
};

export const ERRORS = {
	EMPTY: 'Поле обязательно для заполнения',
	MIN_LENGTH: 'слишком короткое описание',
	MAX_LENGTH: 'слишком длинное описание задачи',
	NO_RESULT: 'нет результатов по запросу',
};

export const SORT_STATUS = ['DEFAULT', 'ASC', 'DESC'];

export const SORT_INDEX = {
	DEFAULT: 0,
	ASC: -1,
	DESC: 1,
};
