import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA9rpqqyGwiqxSmCSfTm86fFbWMSSdvp5I",
    authDomain: "web-restaurant-9f53b.firebaseapp.com",
    databaseURL: "https://web-restaurant-9f53b-default-rtdb.firebaseio.com",
    projectId: "web-restaurant-9f53b",
    storageBucket: "web-restaurant-9f53b.firebasestorage.app",
    messagingSenderId: "1063059140928",
    appId: "1:1063059140928:web:cdec204038f44aaw95da4aa5",
    measurementId: "G-TZ0KT4GBJ3"
};
const app = initializeApp(firebaseConfig); 
const analytics = getAnalytics (app);
const db = getDatabase(app)
const storage = getStorage(app)
const ZakazRef=ref(db,"Zakaz")
const ZakazSnapshot = await get(ZakazRef);
const ZakazData = [];
ZakazSnapshot.forEach((childSnapshot) => {
const IDRef = ref(db, `Client/${childSnapshot.key}/ID_Client`); 
const Date1Ref = ref(db, `Client/${childSnapshot.key}/DateofBirth`);
const NameRef = ref(db, `Client/${childSnapshot.key}/Name`);
const SurenameRef = ref(db, `Client/${childSnapshot.key}/Surname`);
ZakazData.push({
IDRef,NameRef,Date1Ref,SurenameRef
});
});
async function  createZakazBlock(data){
    try{
        const ZakazList=document.getElementById('List');
        const ZakazBlock = document.createElement('tbody');
        createZakazBlock.className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 xl:w-1/3 md:w-1/2";
        ZakazBlock.innerHTML=`
           <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white IDOne" >
           </th>
           <td class="px-6 py-4 Date1One">   
           </td>   
            <td class="px-6 py-4 SurnameOne">   
           </td>     
           <td class="px-6 py-4 NameOne">   
           </td>     
            
`
ZakazList.appendChild(ZakazBlock);
const ID = ZakazBlock.querySelector('.IDOne');
const Date1 = ZakazBlock.querySelector('.Date1One');
const Name=ZakazBlock.querySelector('.NameOne');
const Surname=ZakazBlock.querySelector('.SurnameOne');
if (true) {
    const IDSnapshot=await get(data.IDRef);
    const DateSnapshot=await get(data.Date1Ref);
    const NameSnapshot=await get(data.NameRef);
    const SurenameSnapshot=await get(data.SurenameRef);
    ID.textContent=IDSnapshot.val()
    Date1.textContent=DateSnapshot.val()
    Name.textContent=NameSnapshot.val()
    Surname.textContent=SurenameSnapshot.val()
}
}
catch(error)
{
 console.error("Error download");
}
}
ZakazData.forEach(createZakazBlock);