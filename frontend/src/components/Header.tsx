import { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../app/UserContext';
import { LoginButton, LogoutButton } from './LoginLogoutButtons';

const Header = () => {
    const { isAuthenticated, isLoading } = useContext(UserContext);

    return (
        <Wrapper>
            <div>Cobbler</div>
            <div>My recipes</div>
            {isAuthenticated ? (
                <>
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
