const {
    API_KEY = "AIzaSyBX4kPsgykhByyWsRkEntjNvn7N1a1spsQ",
    AUTH_DOMAIN = "portfolioimagestorage.firebaseapp.com",
    PROJECT_ID = "portfolioimagestorage",
    STORAGE_BUCKET = "portfolioimagestorage.appspot.com",
    MESSAGING_SENDER_ID = "451051630944",
    APP_ID = '1:451051630944:web:3ff7632d86f08bfb32ae05',
} = process.env;
module.exports = {
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
    }
}