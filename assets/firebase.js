(function(){
    // Firebase compat SDKs are loaded via script tags in HTML
    const firebaseConfig = {
        apiKey: "AIzaSyCxfqwIP7sv2Q0557JKJ6-i_1-4tjM9QKc",
        authDomain: "nstumechatronicsclub.firebaseapp.com",
        projectId: "nstumechatronicsclub",
        storageBucket: "nstumechatronicsclub.firebasestorage.app",
        messagingSenderId: "823201944058",
        appId: "1:823201944058:web:df2e6c2c5d181c8cc39443",
        measurementId: "G-6QN9BWZBE8"
    };
    if (!window.firebaseApp) {
        const app = firebase.initializeApp(firebaseConfig);
        try { firebase.analytics(); } catch {}
        window.firebaseApp = app;
        window.db = firebase.firestore();
    }
})();


