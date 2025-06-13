import { Link, useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import TypeaheadSearch from './TypeaheadSearch';
import TagsList from './TagsList';

const Header = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <header className='app-header'>
            <div className='app-header-content'>
                <div className='app-title-container'>
                    <Link to={'/'} className='app-title'>
                        Cobbler
                    </Link>
                    <div className='app-subtitle'>A Simple Recipe App</div>
                </div>
                <div className='app-header-actions'>
                    <button
                        className='app-add-recipe-btn'
                        onClick={() => navigate('/add-recipe')}
                    >
                        Add a recipe
                    </button>
                    <div className='theme-switch-wrapper'>
                        <label className='theme-switch'>
                            <input
                                type='checkbox'
                                checked={isDarkMode}
                                onChange={toggleDarkMode}
                            />
                            <div className='slider round'></div>
                        </label>
                        <span className='theme-switch-icon'>🌙</span>
                    </div>
                </div>
            </div>

            <TypeaheadSearch />
            <TagsList />
        </header>
    );
};

export default Header;
