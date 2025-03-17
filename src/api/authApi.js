export const fakeLoginApi = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'test@example.com' && password === '123456') {
                resolve({
                    user: { id: 1, name: 'John Doe', username: 'test@example.com' },
                    token: 'fake-jwt-token-123',
                });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000); // Simulates network delay
    });
};
