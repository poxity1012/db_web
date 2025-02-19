// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCahP2OkRhkrK6oz-3PF_cGsLFtaWWFI3g",
    authDomain: "self-driving-car-17746.firebaseapp.com",
    databaseURL: "https://self-driving-car-17746-default-rtdb.firebaseio.com",
    projectId: "self-driving-car-17746",
    storageBucket: "self-driving-car-17746.appspot.com",
    messagingSenderId: "485824466507",
    appId: "1:485824466507:web:59ba5b09fa07ee2c92c7ce"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// 點擊按鈕載入所有圖片
document.getElementById('loadImagesBtn').addEventListener('click', () => {
    const imageContainer = document.getElementById('imageContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    imageContainer.innerHTML = ''; // 清空容器
    loadingIndicator.style.display = 'block'; // 顯示加載指示器
    document.getElementById('loadImagesBtn').disabled = true; // 禁用按鈕

    // 指向 Storage 的根目錄
    const storageRef = ref(storage);

    // 列出所有圖片
    listAll(storageRef)
        .then(result => {
            const imagePromises = result.items.map(imageRef => {
                return getDownloadURL(imageRef).then(url => {
                    // 提取圖片名稱中的時間戳
                    const timestamp = parseInt(imageRef.name.split('-')[1]); // 根據名稱格式提取時間戳
                    return { url, timestamp }; // 返回圖片 URL 和時間戳
                });
            });

            // 等待所有圖片的 URL 獲取完成
            return Promise.all(imagePromises);
        })
        .then(images => {
            // 根據時間戳排序
            images.sort((a, b) => a.timestamp - b.timestamp);

            // 顯示圖片
            images.forEach(image => {
                const img = document.createElement('img');
                img.src = image.url;
                imageContainer.appendChild(img); // 將圖片添加到容器
            });
        })
        .catch(error => {
            console.error('載入圖片時出錯:', error);
        })
        .finally(() => {
            loadingIndicator.style.display = 'none'; // 隱藏加載指示器
            document.getElementById('loadImagesBtn').disabled = false; // 重新啟用按鈕
        });
});
