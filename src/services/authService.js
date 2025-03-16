const authService = {
    login: async () => {
        console.warn('Auth service login is being transitioned to Keycloak');
        // Return success response
        return {
            success: true,
            message: 'Login operation disabled during Keycloak transition',
            data: {
                token: 'placeholder-token',
            }
        };
    },

    register: async () => {
        console.warn('Auth service register is being transitioned to Keycloak');
        // Return success response
        return {
            success: true,
            message: 'Registration operation disabled during Keycloak transition'
        };
    },

    logout: async () => {
        console.warn('Auth service logout is being transitioned to Keycloak');
        // Return success response
        return {
            success: true,
            message: 'Logout operation disabled during Keycloak transition'
        };
    },

    getUser: async () => {
        console.warn('Auth service getUser is being transitioned to Keycloak');
        // Return a placeholder user
        return {
            success: true,
            data: {
                id: 'placeholder',
                name: 'Temporary User',
                email: 'placeholder@example.com',
                username: 'placeholder',
                roles: ['Admin']
            }
        };
    },
};

export default authService;