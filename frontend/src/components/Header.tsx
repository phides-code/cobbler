import { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../app/UserContext';
import { LoginButton, LogoutButton } from './LoginLogoutButtons';
import { Link } from 'react-router-dom';

const Header = () => {
    const { isAuthenticated, isLoading, user, myId } = useContext(UserContext);

    return (
        <HeaderContainer>
            <LogoLink to='/'>Cobbler</LogoLink>

            {isAuthenticated ? (
                <Navigation>
                    <NavLink to='/create'>Create a recipe</NavLink>
                    <NavLink to={`/user/${myId}`}>{user?.nickname}</NavLink>
                    <LogoutButton />
                </Navigation>
            ) : (
                <>{!isLoading && <LoginButton />}</>
            )}
        </HeaderContainer>
    );
};

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    background-color: #333;
    color: #fff;
`;

const LogoLink = styled(Link)`
    font-size: 24px;
    text-decoration: none;
    color: #fff;
`;

const Navigation = styled.nav`
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    gap: 16px;
`;

const NavLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    font-size: 14px;

    &:hover {
        opacity: 0.8;
    }
`;

export default Header;
