import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';

export const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <StyledButton onClick={() => loginWithRedirect()}>Log In</StyledButton>
    );
};

export const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <StyledButton
            onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
            }
        >
            Log Out
        </StyledButton>
    );
};

export const SignupButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <StyledButton
            onClick={() =>
                loginWithRedirect({
                    authorizationParams: {
                        screen_hint: 'signup',
                    },
                })
            }
        >
            Sign up
        </StyledButton>
    );
};

const Button = styled.button`
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        opacity: 0.9;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 0.13rem #007bff;
    }
`;

const StyledButton = styled(Button)`
    background-color: #007bff;

    &:hover {
        background-color: #0056b3;
    }

    &:focus {
        box-shadow: 0 0 0 0.13rem #007bff;
    }
`;
