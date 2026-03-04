
// ===========================코디 스타일 버튼===========================
const el_styleBtn = document.querySelectorAll('.styleBtn p');

el_styleBtn.forEach(function (btn, k) {
    btn.addEventListener('click', function () {
        el_styleBtn.forEach(function (ee, i) {
            ee.classList.remove('active')
        })
        btn.classList.add('active')
    });
});

// ===============코디 스크랩한 id값 가져와서 보관함에 넣기====================
// codi.json 전체 코디 데이터 불러옴
let loadScrap = async function (t) {
    const res = await fetch('./js/codi.json')
    const data = await res.json();

    const scrapId = JSON.parse(localStorage.getItem('scrapList')) || [];
    const scrapGender = JSON.parse(localStorage.getItem('gender')) || '';
    const scrapItem = document.querySelector('.scrapItem')
    const empty = document.querySelector('.empty')
    let dataFilter = [];

    // 저장함수
    let saveIdFun = function () {
        scrapId.forEach(function (ss, i) {
            for (let key in data) {
                for (let k in data[key]) {
                    data[key][k].forEach(function (v, i) {
                        ss == v.id ? dataFilter.push(v) : '';
                    })
                }
            }
        })
    }
    saveIdFun();

    // 출력함수
    let printImgFun = function (a) {/* 코디 보관함 빈공간일때 */

        dataFilter.forEach(function (v, i) {
            if (v.src.includes(scrapGender == 'm' ? '남성' : '여성')) {
                if (v.src.includes(a)) {
                    empty.style.display = 'none'
                    scrapItem.innerHTML += `<img src="${v.src}" alt="">`
                } else {
                    scrapItem.style.display = 'none'
                    empty.innerHTML = `<span>선택한 스타일에 맞는 코디가 없어요!</span>`
                }
            }
        })
    }
    printImgFun(t);
}
const activeBtn=document.querySelector('.styleBtn .active') 
loadScrap(activeBtn.innerText);
