// ================맨처음 성별선택 온보딩 & 기록있으면 바로 메인===================
        const onboarding=document.querySelector('.onboarding');
        const main=document.querySelector('.main')
        
        // 로컬스토리지안에 gender값을 가져와라
        const savedGender=localStorage.getItem('gender')
        
        if(savedGender){/* 가져올수있다면->한번 선택한적 있음->바로 메인으로 */
          onboarding.style.display='none'
          main.style.display='block'
        }else{/* 가져올수없다면->null->처음 방문->온보딩 */
          onboarding.style.display='block'
          main.style.display='none'
        }
        
        // 로컬스토리지안에 성별선택값 저장 과정
        const el_input=document.querySelectorAll('.genderOption input')
        const el_button=document.querySelector('.onboarding button')

        let selectedGender=null;/* 나중에 남/녀 고르면 값이 들어가는 자리 */
              
        el_input.forEach(function(ee,i){
          ee.addEventListener('change',function(){
              selectedGender=this.value;/* 둘중 선택한 버튼(this)의 값(value)를 selectedGender에 저장 */
              el_button.classList.add('active') 
              });
            });
          
        el_button.addEventListener('click',function(){
          if(!selectedGender) return;/* 확인버튼 눌렀을때 selectedGender값이 없으면 이벤트를 끝내서 넘어가지 못하게 */
          
          // localStorage의 gender(key)를 생성하면서 거기에 남,녀값이 담긴 selectedGender을 저장
          localStorage.setItem('gender',selectedGender)
          
          onboarding.style.display='none'
          main.style.display='block';
        });

// ============================배경색 설정시 메인배경색 바뀌게===============================
    const el_mainBgc=document.querySelector('.main')
    let selectedBgc=localStorage.getItem('bgc')/* set.js에서 배경색 설정 후 저장된 색이름 */

    const gradientBgc={
        gray: 'linear-gradient(to bottom, #EBEBEB 0%, #999999 100%)',
        green: 'linear-gradient(to bottom, #CFFFF1 0%, #00CE93 77%, #12A77C 100%)',
        blue: 'linear-gradient(to bottom, #cbe0ff 0%, #6ea3f3 77%, #458bf5 100%)',
        purple: 'linear-gradient(to bottom, #dbd3ff 0%, #a08bff 77%, #8164ff 100%)',
        yellow: 'linear-gradient(to bottom, #ffeab1 0%, #e4c267 77%, #dbad2c 100%)'
    }

    el_mainBgc.style.background=gradientBgc[selectedBgc]


// ====================뒷 날씨 렌더링아이콘(비)======================
        const container=document.querySelector('.rain_drop-container')

        for(let i=0; i<5; i++){/* 9번 반복 */
            const drop=document.createElement('img');/* img태그 생성하는걸 drop으로 정의 */
            drop.setAttribute('src','./image/index/weather/rain_drop.png')/* drop으로 생성한 img태그의 src값 삽입 */
            drop.classList.add('drop');/* drop으로 생성한 img태그에 class='drop'추가 */

            drop.style.width='20px'
            drop.style.left=(i*9)+'%';
            drop.style.animationDuration = 1.5 + Math.random()*0.2 + 's';
            drop.style.animationDelay = Math.random()*2 + 's';

            container.append(drop)/* '.rain_drop-container'의 맨앞에 img태그 생성 */
            };

//  =================세팅 아이콘 누르면 set.html로=========================
        const el_mainSetting=document.querySelector('.mainSetting span')

        el_mainSetting.addEventListener('click',function(){
          location.href='./set.html'
        })