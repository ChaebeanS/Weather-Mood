const loadScrap = async function () {
    const res = await fetch('./js/codi.json');
    const data = await res.json();

    // 로컬스토리지 데이터 가져오기
    let scrapId = JSON.parse(localStorage.getItem('scrapList')) || [];
    let scrapGender = localStorage.getItem('gender') || 'man'; // 기본값 설정
    
    const scrapItem = document.querySelector('.scrapItem');
    const empty = document.querySelector('.empty');
    let dataFilter = [];

    // 스크랩된 ID와 일치하는 아이템 추출
    scrapId.forEach(ss => {
        for (let style in data[scrapGender]) {
            for (let season in data[scrapGender][style]) {
                data[scrapGender][style][season].forEach(item => {
                    if (String(ss) === String(item.id)) {
                        dataFilter.push(item);
                    }
                });
            }
        }
    });

    
    scrapItem.innerHTML = '';
    
    if (dataFilter.length > 0) {
        
        dataFilter.forEach(v => {
            scrapItem.innerHTML += `
                <img src="${v.src}" alt="" 
                     data-id="${v.id}"
                     data-top="${v.top}" 
                     data-bottom="${v.bottom}">`;
        });
    } else {
        scrapItem.style.display = 'none';
        empty.style.display = 'block';
        empty.innerHTML = `<span>보관함이 비어 있습니다.</span>`;
    }
};

// 페이지 로드 시 즉시 실행
loadScrap();

// 모달 팝업 =========================
const el_Img = document.querySelector('.scrapItem');
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal img');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.close');
const starBtn = document.querySelector('.star-btn');

el_Img.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG') {
        const img = e.target;
        modalImg.src = img.src;
        modalImg.dataset.id = img.dataset.id;

        // 모달 텍스트 업데이트
        document.getElementById("modalTop").innerText = `상의: ${img.dataset.top}`;
        document.getElementById("modalBottom").innerText = `하의: ${img.dataset.bottom}`;

        overlay.classList.add('active');
        modal.classList.add('active');
        
        // 보관함에 있는 상태이므로 별 활성화
        starBtn.classList.add('active');
        starBtn.innerHTML = `<img src="./image/codi/Vector.svg" alt="star filled">`;
    }
});

// ================ 별 누르면 보관함에서 삭제 ===================
starBtn.addEventListener('click', function () {
    const imgId = modalImg.dataset.id;
    let scrapList = JSON.parse(localStorage.getItem("scrapList")) || [];

    // 삭제 로직
    scrapList = scrapList.filter(v => String(v) !== String(imgId));
    localStorage.setItem("scrapList", JSON.stringify(scrapList));
    
    // 모달 닫고 목록 새로고침
    closeModal();
});

// 모달 닫기 함수
function closeModal() {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    // 삭제 반영을 위해 목록 다시 불러오기
    loadScrap();
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);