

/// ============================================
// 🔆 일출·일몰 반원
// ============================================

// HHMM → HH:MM
function formatTime(timeStr) {
    if (!timeStr || timeStr.trim() === "----") return "--:--";
    return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}`;
    
}


// 오늘 날짜 YYYYMMDD
function getTodayStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
}

// HHMM → 오늘 날짜 Date 객체
function timeStrToDate(timeStr) {
    const now = new Date();
    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(timeStr.substring(0, 2)),
        parseInt(timeStr.substring(2, 4)),
        0
    );
}

// 진행률 계산
function getProgress(start, end, now) {
    const total = end - start;
    const elapsed = now - start;
    let p = elapsed / total;

    return Math.max(0, Math.min(1, p));
}


// SVG 세팅


const circle = document.querySelector(".progress");
const radius = circle.r.baseVal.value;
const circumference = Math.PI * radius;



circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;



// 진행률 반영
function setProgress(percent) {
    const offset = circumference - percent * circumference;
    circle.style.strokeDashoffset = offset;
}




// 태양 위치
function setSunPosition(percent) {
    const sun = document.querySelector(".sun");
    const angle = percent * 180;
    sun.style.transform = `rotate(${angle}deg) translateX(80px)`;
}

// ---------------------------
// 🌅 API 호출
// ---------------------------

let sunriseDate = null;
let sunsetDate = null;

function fetchRiseSet() {

    const todayStr = getTodayStr();

    const riseSetApiUrl =
        `https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo` +
        `?location=의정부` +
        `&locdate=${todayStr}` +
        `&ServiceKey=0123891d17b0e073ff763a40afc5aed555b9b50358d33ebf729a71244c77c4e0` +
        `&_type=json`;

    fetch(riseSetApiUrl)
        .then(res => res.json())
        .then(data => {

            const items = data.response.body.items.item;
            const item = Array.isArray(items) ? items[0] : items;

            const sunriseStr = item.sunrise.trim();
            const sunsetStr = item.sunset.trim();

            document.querySelector(".sunrise h2").textContent = formatTime(sunriseStr);
            document.querySelector(".sunset h2").textContent = formatTime(sunsetStr);

            sunriseDate = timeStrToDate(sunriseStr);
            sunsetDate = timeStrToDate(sunsetStr);

        })
        .catch(err => console.error("일출·일몰 API 오류:", err));
}

// ---------------------------
// ☀️ 실시간 애니메이션
// ---------------------------

function animateSun() {

    if (!sunriseDate || !sunsetDate) {
        requestAnimationFrame(animateSun);
        return;
    }

    const now = new Date();
    const progress = getProgress(sunriseDate, sunsetDate, now);
    

    setProgress(progress);
    setSunPosition(progress);

    requestAnimationFrame(animateSun);
}

// ---------------------------
// 🌙 자정 자동 갱신
// ---------------------------

function scheduleMidnightUpdate() {

    const now = new Date();

    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 1
    );

    const timeUntilMidnight = midnight - now;

    setTimeout(() => {

        fetchRiseSet(); // 다음날 데이터 재요청

        // 애니메이션 리셋
        circle.style.strokeDashoffset = circumference;
        setSunPosition(0);

        scheduleMidnightUpdate(); // 다음 자정 예약

    }, timeUntilMidnight);
}

// ---------------------------
// 🚀 실행
// ---------------------------

fetchRiseSet();
animateSun();
scheduleMidnightUpdate();


// =====================================================
// 🔒 설정
// =====================================================
const serviceKey = "0123891d17b0e073ff763a40afc5aed555b9b50358d33ebf729a71244c77c4e0";
const stationName = "의정부동";


// =====================================================
// 🌫 미세먼지 API
// =====================================================
async function getAirQuality() {

    const url =
        `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?` +
        `serviceKey=${serviceKey}` +   
        `&returnType=json` +
        `&numOfRows=1&pageNo=1` +
        `&stationName=${encodeURIComponent(stationName)}` +
        `&dataTerm=DAILY&ver=1.3`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const item = data.response?.body?.items?.[0];
        if (!item) return;

        applyDust(".pm10", item.pm10Value, "pm10");
        applyDust(".pm25", item.pm25Value, "pm25");

    } catch (err) {
        console.error("미세먼지 로드 실패:", err);
    }
}

// =====================================================
// 🎨 미세먼지 화면 적용 (등급만 표시)
// =====================================================
function applyDust(selector, value, type) {

    const box = document.querySelector(selector);
    if (!box) return;

    const textEl = box.querySelector("b");
    const iconEl = box.querySelector(".icon");

    const grade = getGrade(value, type);

    const gradeMap = {
        1: { text: "좋음", icon: "sentiment_very_satisfied", className: "grade-1" },
        2: { text: "보통", icon: "sentiment_satisfied", className: "grade-2" },
        3: { text: "나쁨", icon: "sentiment_dissatisfied", className: "grade-3" },
        4: { text: "매우나쁨", icon: "sentiment_very_dissatisfied", className: "grade-4" }
    };

    // ✅ grade-1~4 제거
    textEl.classList.remove("grade-1","grade-2","grade-3","grade-4");
    iconEl.classList.remove("grade-1","grade-2","grade-3","grade-4");

    if (gradeMap[grade]) {
        const current = gradeMap[grade];

        textEl.textContent = current.text;
        iconEl.textContent = current.icon;

        textEl.classList.add(current.className);
        iconEl.classList.add(current.className);

    } else {
        textEl.textContent = "--";
        iconEl.textContent = "help";
    }
}


// =====================================================
// 📊 등급 계산
// =====================================================
function getGrade(value, type) {

    const num = Number(value);
    if (isNaN(num)) return 0;

    if (type === "pm10") {
        if (num <= 30) return 1;
        if (num <= 80) return 2;
        if (num <= 150) return 3;
        return 4;
    }

    if (type === "pm25") {
        if (num <= 15) return 1;
        if (num <= 35) return 2;
        if (num <= 75) return 3;
        return 4;
    }

    return 0;
}


// =====================================================
// 🌤 날씨 시스템
// =====================================================
const nx = 61;
const ny = 131;

async function getWeatherData() {

    const now = new Date();
    const baseInfo = getBaseTime(now, 45);
    const ncstInfo = getBaseTime(now, 40);

    const fcstUrl =
        `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?` +
        `serviceKey=${serviceKey}` +
        `&pageNo=1&numOfRows=1000&dataType=JSON` +
        `&base_date=${baseInfo.date}` +
        `&base_time=${baseInfo.time}` +
        `&nx=${nx}&ny=${ny}`;

    const ncstUrl =
        `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?` +
        `serviceKey=${serviceKey}` +
        `&pageNo=1&numOfRows=1000&dataType=JSON` +
        `&base_date=${ncstInfo.date}` +
        `&base_time=${ncstInfo.time}` +
        `&nx=${nx}&ny=${ny}`;

    try {

        const [fcstRes, ncstRes] = await Promise.all([
            fetch(fcstUrl),
            fetch(ncstUrl)
        ]);

        const fcstData = await fcstRes.json();
        const ncstData = await ncstRes.json();

        const ncstWeather = extractNcst(ncstData);
        const fcstWeather = extractFcst(fcstData);

        const finalWeather = { ...fcstWeather, ...ncstWeather };

        applyWeather(finalWeather);

    } catch (err) {
        console.error("날씨 로드 실패:", err);
    }
}


// =====================================================
// base_time 계산
// =====================================================
function getBaseTime(now, minuteStandard) {

    const date = new Date(now);

    if (date.getMinutes() < minuteStandard) {
        date.setHours(date.getHours() - 1);
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");

    return {
        date: `${yyyy}${mm}${dd}`,
        time: `${hh}30`
    };
}


// =====================================================
// 📦 실황 추출
// =====================================================
function extractNcst(data) {

    const items = data.response?.body?.items?.item;
    if (!items) return {};

    const weather = {};
    items.forEach(i => weather[i.category] = i.obsrValue);

    return {
        T1H: weather.T1H,
        REH: weather.REH,
        WSD: weather.WSD,
        PTY: weather.PTY
    };
}


// =====================================================
// 📦 예보 추출
// =====================================================
function extractFcst(data) {

    const items = data.response?.body?.items?.item;
    if (!items) return {};

    const times = [...new Set(items.map(i => i.fcstTime))].sort();
    const targetTime = times[0];

    const weather = {};
    items.forEach(i => {
        if (i.fcstTime === targetTime) {
            weather[i.category] = i.fcstValue;
        }
    });

    return weather;
}


// =====================================================
// 🎨 화면 출력
// =====================================================
function applyWeather(weather) {

    document.getElementById("temp").innerHTML =
        `${weather.T1H ?? "--"}<small>℃</small>`;

    document.getElementById("humidity").innerHTML =
        `${weather.REH ?? "--"}<small>%</small>`;

    document.getElementById("wind").innerHTML =
        `${weather.WSD ?? "--"}<small>m/s</small>`;

    // 🌧 강수량 안전 처리
    let rainText = "없음";

    if (
        weather.RN1 &&
        weather.RN1 !== "강수없음" &&
        weather.RN1 !== "0"
    ) {
        rainText = weather.RN1 + "mm";
    }

    document.getElementById("rain").innerHTML = rainText;

    // 🌤 하늘 상태
    const skyText = document.getElementById("sky");
    const skyIcon = document.getElementById("skyIcon");

    const skyMap = {
        "1": { text: "맑음", icon: "wb_sunny" },
        "3": { text: "구름많음", icon: "partly_cloudy_day" },
        "4": { text: "흐림", icon: "cloud" }
    };

    const ptyMap = {
        "1": { text: "비", icon: "rainy" },
        "2": { text: "비/눈", icon: "weather_mix" },
        "3": { text: "눈", icon: "mode_cool" },
        "4": { text: "소나기", icon: "thunderstorm" }
    };

    if (weather.PTY && weather.PTY !== "0") {
        const pty = ptyMap[weather.PTY];
        skyText.textContent = pty?.text || "-";
        skyIcon.textContent = pty?.icon || "help";
    } else {
        const sky = skyMap[weather.SKY];
        skyText.textContent = sky?.text || "-";
        skyIcon.textContent = sky?.icon || "help";
    }
}


// =====================================================
// 🚀 실행
// =====================================================
getAirQuality();
getWeatherData();

setInterval(() => {
    getAirQuality();
    getWeatherData();
}, 600000);
