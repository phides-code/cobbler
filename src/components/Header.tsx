import { Link, useNavigate } from 'react-router';

const Header = () => {
    const navigate = useNavigate();

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
                            <input type='checkbox' />
                            <div className='slider round'></div>
                        </label>
                        <span className='theme-switch-icon'>🌙</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
