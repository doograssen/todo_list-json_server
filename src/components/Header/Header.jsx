
import { SortBtn } from '../buttons/sortbtn/SortBtn';
import resetImage from '../../images/icon-reset.svg';
import { SORT_STATUS } from '../utils/constants';
import './Header.css';
export const Header = ({sortList, searchLength, setResult, sortStatus, setSortStatus}) => {

	const resetList = () => {
		setResult([]);
	};
	const onSort = () => {
		let index = SORT_STATUS.indexOf(sortStatus);
		if (index !== SORT_STATUS.length - 1) {
			index++;
		}
		else {
			index = 0;
		}
		setSortStatus(SORT_STATUS[index]);
	};
	return (
		<div className="header">
			<h3 className="header__caption">Tasks</h3>
			<SortBtn clickHandler={onSort} status={sortStatus}/>
			{Boolean(searchLength) && (
				<button
					className="header__btn header__btn--reset"
					title="Сбросить"
					onClick={resetList}>
					<img src={resetImage} alt="Reset" />
				</button>
			)}
		</div>
	);
};
