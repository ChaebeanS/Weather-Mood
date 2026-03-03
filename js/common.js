// ====================하단 네비바 클릭하여 이동==============================
        const el_navBarP=document.querySelectorAll('.navBar p')
        const currentPath=location.pathname;

        el_navBarP.forEach(function(ss,i){
            ss.addEventListener('click',function(){
                location.href = this.dataset.url;
               el_navBarP.forEach(function(aa,i){
                aa.classList.remove('active')
               })
               ss.classList.add('active')
            });
            if(ss.dataset.url == currentPath){
                ss.classList.add('active')
            }
        });

// ===========================뒤로가기 버튼================================
        const el_backBtn=document.querySelector('.txt span')

        el_backBtn.addEventListener('click',function(){
            history.back();
        });