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
                    <NavLink to='/create'>Create</NavLink>
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
    padding: 0.4rem 0.5rem;
    background-color: #333;
    color: #fff;
`;

const LogoLink = styled(Link)`
    font-size: 1.5rem;
    text-decoration: none;
    color: #fff;
    margin-right: 0.6rem;
`;

const Navigation = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
`;

const NavLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    font-size: 0.9rem;

    &:hover {
        opacity: 0.8;
    }
`;

export default Header;
