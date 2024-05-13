import './App.css';
import { Task } from './components/Task/Task';
import { TaskForm } from './components/TaskForm/TaskForm';
import { Header } from './components/Header/Header';
import { useStore } from './hooks/useStore';

export const App = () => {
	const {form, events, getLoader, getStatus, setStatus, getList, setNewItem} = useStore();

	return (
		<div className="app">
			<main className="app-main">
				<h1 className="app-title">ToDo List (JSON Server)</h1>
				<div className="app-container">
					<TaskForm
						data={form.getData()}
						setData={form.setData}
						add={events.add}
						search={events.search}
					/>
					<div className={`app-content ${getLoader() ? 'app-content--update' : ''}`}>
						<Header
							searchState={getStatus('search')}
							setSearchState={setStatus('search')}
							sortStatus={getStatus('sort')}
							setSortStatus={setStatus('sort')}
						/>
						{getLoader() && (
							<div className="loader"></div>
						) }
							<ul className="app-list">
								{getList().map(({ id, text }) => (
									<Task
										key={'task-' + id}
										id={id}
										text={text}
										onDelete={events.delete}
										setNewData={setNewItem}
										needUpdate={getStatus('update')}
										setNeedUpdate={setStatus('update')}
									/>
								))}
							</ul>
					</div>
				</div>
			</main>
		</div>
	);
};
