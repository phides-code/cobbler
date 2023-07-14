import { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../app/UserContext';
import { LoginButton, LogoutButton } from './LoginLogoutButtons';
import { Link } from 'react-router-dom';

const Header = () => {
    const { isAuthenticated, isLoading, user, myId } = useContext(UserContext);

    return (
        <Wrapper>
            <Link to='/'>Cobbler</Link>

            {isAuthenticated ? (
                <>
                    <Link to={`/user/${myId}`}>{user?.nickname}</Link>
                    <LogoutButton />
                </>
            ) : (
                <>{!isLoading && <LoginButton />}</>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
`;

export default Header;
